/**
 * ネイルピタ お悩み別ランキングページ 商品データ連携バッチ(楽天版)
 * GitHub Secrets: RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY / RAKUTEN_AFFILIATE_ID
 */

const fs = require('fs');
const https = require('https');

const OUTPUT_PATH = 'products.json';
const APP_ID = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

if (!APP_ID || !ACCESS_KEY) {
  console.error('RAKUTEN_APP_ID または RAKUTEN_ACCESS_KEY が設定されていません。');
  process.exit(1);
}

const WORRY_CATEGORIES = [
  { id: 'sujime', label: '爪の縦すじ・凸凹', keyword: 'ベースコート', hits: 4 },
  { id: 'nimaizume', label: '爪が薄い・二枚爪', keyword: 'ネイルオイル', hits: 4 },
  { id: 'teshiwa', label: '手のシワ・乾燥', keyword: 'ハンドクリーム', hits: 4 },
  { id: 'shokuba', label: '職場でバレたくない', keyword: 'マットネイル', hits: 4 },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// https モジュールで直接リクエスト(fetchのReferer制限を回避)
function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
  });
}

async function fetchRakutenProducts(keyword, hits) {
  const url = new URL('https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701');
  url.searchParams.set('applicationId', APP_ID);
  url.searchParams.set('accessKey', ACCESS_KEY);
  if (AFFILIATE_ID) url.searchParams.set('affiliateId', AFFILIATE_ID);
  url.searchParams.set('keyword', keyword);
  url.searchParams.set('hits', String(hits));
  url.searchParams.set('sort', '-reviewCount');
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatVersion', '2');

  const { status, body } = await httpsGet(url.toString(), {
    'Referer': 'https://nailpita.github.io/',
    'User-Agent': 'Mozilla/5.0 (compatible; NailPitaBot/1.0)',
  });

  let data;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(`JSONとして解析できない応答(HTTP ${status}): ${body.slice(0, 200)}`);
  }

  if (data.error || data.errors) {
    const msg = data.error_description || (data.errors && JSON.stringify(data.errors)) || data.error;
    throw new Error(`楽天APIエラー(HTTP ${status}): ${msg}`);
  }

  const count = typeof data.count === 'number' ? data.count : '不明';
  console.log(`    (HTTPステータス:${status} / API上のヒット件数:${count})`);
  if (count === '不明') {
    console.log(`    応答の中身: ${JSON.stringify(data).slice(0, 300)}`);
  }

  return (data.Items || []).map((entry) => {
    const Item = entry.Item || entry;
    return {
      name: Item.itemName,
      price: Item.itemPrice,
      imageUrl: (Item.mediumImageUrls && Item.mediumImageUrls[0] && (Item.mediumImageUrls[0].imageUrl || Item.mediumImageUrls[0])) || '',
      url: Item.affiliateUrl || Item.itemUrl,
    };
  });
}

async function runBatch() {
  const categories = {};
  let hasError = false;

  for (const category of WORRY_CATEGORIES) {
    console.log(`--- 「${category.label}」(${category.keyword})を検索中 ---`);
    try {
      categories[category.id] = await fetchRakutenProducts(category.keyword, category.hits || 4);
      console.log(`  → ${categories[category.id].length}件取得`);
    } catch (err) {
      console.error(`  カテゴリ処理エラー(${category.label}): ${err.message}`);
      categories[category.id] = [];
      hasError = true;
    }
    await sleep(1000);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), categories }, null, 2));
  console.log(`完了: ${OUTPUT_PATH} を更新しました`);

  if (hasError) process.exitCode = 1;
}

runBatch();
