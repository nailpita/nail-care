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

async function fetchRakutenProducts(keyword, hits, retriesLeft = 2) {
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

  const { statusCode, body } = await undiciRequest(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'nailpita/1.0',
      Origin: SITE_ORIGIN,
      Referer: SITE_ORIGIN,
      accessKey: ACCESS_KEY,
    },
  });

  const rawText = await body.text();

  if (statusCode === 429 && retriesLeft > 0) {
    console.log('  レート制限のため2秒待って再試行します');
    await sleep(2000);
    return fetchRakutenProducts(keyword, hits, retriesLeft - 1);
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

async function runBatch() {
  const categories = {};
  let hasError = false;

  for (const category of WORRY_CATEGORIES) {
    console.log(`--- 「${category.label}」を検索中 ---`);
    const merged = [];
    const seenNames = new Set();

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
      } catch (err) {
        console.error(`  キーワード処理エラー(${keyword}): ${err.message}`);
        hasError = true;
      }
      await sleep(1000);
    }

    categories[category.id] = merged.slice(0, 6);
    console.log(`  → 合計${categories[category.id].length}件`);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), categories }, null, 2));
  console.log(`完了: ${OUTPUT_PATH} を更新しました`);

  if (hasError) process.exitCode = 1;
}

runBatch();
