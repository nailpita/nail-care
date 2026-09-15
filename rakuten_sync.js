/**
 * ネイルピタ お悩み別ランキングページ 商品データ連携バッチ(楽天版)
 *
 * 必要なもの(GitHub Secretsに設定):
 *   1. RAKUTEN_APP_ID       … 楽天ウェブサービスのアプリケーションID
 *   2. RAKUTEN_ACCESS_KEY   … 楽天ウェブサービスのアクセスキー
 *   3. RAKUTEN_AFFILIATE_ID … 楽天アフィリエイトID
 *
 * 実行イメージ:
 *   RAKUTEN_APP_ID=xxx RAKUTEN_ACCESS_KEY=yyy RAKUTEN_AFFILIATE_ID=zzz node rakuten_sync.js
 *
 * ※ Node.js 18以降は fetch が標準搭載のため、node-fetchのインストールは不要
 *
 * 出力: products.json (お悩みカテゴリごとに商品リストをまとめたもの)
 */

const fs = require('fs');

const OUTPUT_PATH = 'products.json';

// キーはコードに書かず、GitHub Secrets経由の環境変数から読む
const APP_ID = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

if (!APP_ID || !ACCESS_KEY) {
  console.error('RAKUTEN_APP_ID または RAKUTEN_ACCESS_KEY が設定されていません。GitHub Secretsを確認してください。');
  process.exit(1);
}

// お悩みカテゴリと検索キーワード(ここを編集すればカテゴリの追加・変更ができる)
const WORRY_CATEGORIES = [
  { id: 'sujime', label: '爪の縦すじ・凸凹', keyword: 'ベースコート', hits: 4 },
  { id: 'nimaizume', label: '爪が薄い・二枚爪', keyword: 'ネイルオイル', hits: 4 },
  { id: 'teshiwa', label: '手のシワ・乾燥', keyword: 'ハンドクリーム', hits: 4 },
  { id: 'shokuba', label: '職場でバレたくない', keyword: 'マットネイル', hits: 4 },
];

// --- 楽天商品検索APIから商品を取得(2026-07-01版エンドポイント) ---
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

  const res = await fetch(url.toString());
  const data = await res.json();

  // 楽天APIのエラーは単数形 "error" フィールドで返る
  if (data.error) {
    throw new Error(`楽天APIエラー(HTTP ${res.status}): ${data.error} - ${data.error_description || ''}`);
  }

  return (data.Items || []).map((entry) => {
    const Item = entry.Item || entry; // formatVersion=2はネストなしで返る
    return {
      name: Item.itemName,
      price: Item.itemPrice,
      imageUrl: (Item.mediumImageUrls && Item.mediumImageUrls[0] && (Item.mediumImageUrls[0].imageUrl || Item.mediumImageUrls[0])) || '',
      url: Item.affiliateUrl || Item.itemUrl,
    };
  });
}

// --- 実行本体 ---
async function runBatch() {
  const categories = {};
  let hasError = false;

  for (const category of WORRY_CATEGORIES) {
    console.log(`--- 「${category.label}」(${category.keyword})を検索中 ---`);
    try {
      categories[category.id] = await fetchRakutenProducts(category.keyword, category.hits || 4);
      console.log(`  → ${categories[category.id].length}件取得`);
    } catch (err) {
      console.error(`  カテゴリ処理エラー(${category.label}):`, err.message);
      categories[category.id] = [];
      hasError = true;
    }
  }

  const output = {
    updatedAt: new Date().toISOString(),
    categories,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`完了: ${OUTPUT_PATH} を更新しました`);

  // 1件でもエラーがあればCI側で気づけるように異常終了させる
  if (hasError) {
    process.exitCode = 1;
  }
}

runBatch();
