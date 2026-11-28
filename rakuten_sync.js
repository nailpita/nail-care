/**
 * ネイルピタ お悩み別ランキングページ 商品データ連携バッチ(楽天版)
 * GitHub Secrets: RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY / RAKUTEN_AFFILIATE_ID
 * 必要なライブラリ: npm install undici
 * (fetchはOrigin/Refererヘッダを送れないため、undiciを直接使用)
 *
 * ※「職場でバレたくない」は手動選定のみのため、この自動検索の対象外です(script.js側で管理)
 */

const fs = require('fs');
const { request: undiciRequest } = require('undici');

const OUTPUT_PATH = 'products.json';
const APP_ID = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;
const SITE_ORIGIN = process.env.RAKUTEN_SITE_ORIGIN || 'https://nailpita.github.io';

if (!APP_ID || !ACCESS_KEY) {
  console.error('RAKUTEN_APP_ID または RAKUTEN_ACCESS_KEY が設定されていません。');
  process.exit(1);
}

const WORRY_CATEGORIES = [
  { id: 'tatesuji', label: '縦すじ', keywords: ['爪 リッジフィラー', 'ネイルオイル 爪 補強'], hitsEach: 4 },
  { id: 'yokosuji', label: '横すじ・波打ち', keywords: ['ビオチン サプリ', '亜鉛 サプリ'], hitsEach: 4 },
  { id: 'soriduma', label: 'そり爪・へこみ', keywords: ['鉄 サプリ', 'ネイル美容液'], hitsEach: 4 },
  { id: 'nimaizume', label: '二枚爪・薄い爪', keywords: ['二枚爪 補修', 'ネイルオイル 爪 補強'], hitsEach: 4 },
  { id: 'sasakure', label: 'ささくれ', keywords: ['ささくれ ケア', 'キューティクルオイル'], hitsEach: 4 },
  { id: 'teshiwa', label: '手のシワ・乾燥', keywords: ['ハンドクリーム 尿素', 'ハンドクリーム エイジングケア'], hitsEach: 4 },
  { id: 'fukazume', label: '深爪・噛み癖', keywords: ['育爪'], hitsEach: 6 },
  { id: 'makizume', label: '巻き爪', keywords: ['巻き爪', '巻き爪改善'], hitsEach: 4 },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 楽天APIが一時的に不調(503など)のときは、少し待って再試行します
const RETRY_WAITS = [3000, 8000, 15000];

async function fetchRakutenProducts(keyword, hits, attempt = 0) {
  const endpoint = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701';
  const paramsObj = {
    applicationId: APP_ID,
    accessKey: ACCESS_KEY,
    keyword,
    hits: String(hits),
    sort: '-reviewCount',
    format: 'json',
    formatVersion: '2',
  };
  if (AFFILIATE_ID) paramsObj.affiliateId = AFFILIATE_ID;
  const params = new URLSearchParams(paramsObj);
  const url = `${endpoint}?${params.toString()}`;

  let statusCode, rawText;
  try {
    const res = await undiciRequest(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'nailpita/1.0',
        Origin: SITE_ORIGIN,
        Referer: SITE_ORIGIN,
        accessKey: ACCESS_KEY,
      },
    });
    statusCode = res.statusCode;
    rawText = await res.body.text();
  } catch (err) {
    // 通信自体が失敗した(タイムアウトなど)
    if (attempt < RETRY_WAITS.length) {
      console.log(`  通信エラー(${err.message})。${RETRY_WAITS[attempt] / 1000}秒待って再試行します`);
      await sleep(RETRY_WAITS[attempt]);
      return fetchRakutenProducts(keyword, hits, attempt + 1);
    }
    throw err;
  }

  // 429(アクセス集中)と5xx(楽天側の一時的な不調)は再試行する
  if ((statusCode === 429 || statusCode >= 500) && attempt < RETRY_WAITS.length) {
    console.log(`  楽天APIが一時的に応答できません(HTTP ${statusCode})。${RETRY_WAITS[attempt] / 1000}秒待って再試行します`);
    await sleep(RETRY_WAITS[attempt]);
    return fetchRakutenProducts(keyword, hits, attempt + 1);
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`JSONとして解析できない応答(HTTP ${statusCode}): ${rawText.slice(0, 200)}`);
  }

  if (statusCode < 200 || statusCode >= 300) {
    const msg = data.errorMessage || (data.errors && JSON.stringify(data.errors)) || rawText.slice(0, 200);
    throw new Error(`楽天APIエラー(HTTP ${statusCode}): ${msg}`);
  }

  const count = typeof data.count === 'number' ? data.count : '不明';
  console.log(`    (HTTPステータス:${statusCode} / API上のヒット件数:${count})`);

  return (data.Items || []).map((entry) => {
    const Item = entry.Item || entry;
    const firstImage = Item.mediumImageUrls && Item.mediumImageUrls[0];
    const rawImageUrl = typeof firstImage === 'string' ? firstImage : firstImage && firstImage.imageUrl;
    return {
      name: Item.itemName,
      price: Item.itemPrice,
      imageUrl: (rawImageUrl || '').replace('?_ex=128x128', ''),
      url: Item.affiliateUrl || Item.itemUrl,
    };
  });
}

// 前回の products.json(取得に失敗したカテゴリは、前回の商品をそのまま残すため)
function loadPrevious() {
  try {
    const prev = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    return (prev && prev.categories) || {};
  } catch {
    return {};
  }
}

async function runBatch() {
  const categories = {};
  const previous = loadPrevious();
  let okCount = 0;
  let errorCount = 0;

  for (const category of WORRY_CATEGORIES) {
    console.log(`--- 「${category.label}」を検索中 ---`);
    const merged = [];
    const seenNames = new Set();
    let categoryFailed = false;

    for (const keyword of category.keywords) {
      console.log(`  キーワード:「${keyword}」`);
      try {
        const items = await fetchRakutenProducts(keyword, category.hitsEach || 4);
        for (const item of items) {
          if (!seenNames.has(item.name)) {
            seenNames.add(item.name);
            merged.push(item);
          }
        }
        okCount++;
      } catch (err) {
        console.error(`  キーワード処理エラー(${keyword}): ${err.message}`);
        errorCount++;
        categoryFailed = true;
      }
      await sleep(1000);
    }

    const fresh = merged.slice(0, 6);
    const prevItems = Array.isArray(previous[category.id]) ? previous[category.id] : [];
    if (categoryFailed && fresh.length < prevItems.length) {
      // 一部のキーワードが取れず件数が減ったときは、前回の商品を残す
      categories[category.id] = prevItems;
      console.log(`  → 取得できなかったキーワードがあるため、前回の${prevItems.length}件を残します`);
    } else {
      categories[category.id] = fresh;
      console.log(`  → 合計${fresh.length}件`);
    }
  }

  if (okCount === 0) {
    // すべてのキーワードが失敗(APIキーの期限切れなど)。products.json は書き換えずに失敗として通知する
    console.error('::error::楽天APIから1件も取得できませんでした。APIキーや楽天側の状況を確認してください');
    process.exitCode = 1;
    return;
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), categories }, null, 2));
  console.log(`完了: ${OUTPUT_PATH} を更新しました`);

  if (errorCount > 0) {
    // 一時的な不調で一部だけ取れなかった場合は、警告だけ出して成功扱いにする(前回の商品を残しているため)
    console.log(`::warning::${errorCount}件のキーワードが取得できなかったため、該当カテゴリは前回の商品を残しました`);
  }
}

runBatch();
