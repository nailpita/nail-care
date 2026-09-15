/**
 * ネイルピタ お悩み別ランキングページ 商品データ連携バッチ(楽天版)
 *
 * 必要なもの(GitHub Secretsに設定):
 *   1. RAKUTEN_APP_ID       … 楽天ウェブサービスのアプリケーションID
 *   2. RAKUTEN_ACCESS_KEY   … 楽天ウェブサービスのアクセスキー(2026年新仕様で必須)
 *   3. RAKUTEN_AFFILIATE_ID … 楽天アフィリエイトID
 *
 * 実行イメージ:
 *   RAKUTEN_APP_ID=xxx RAKUTEN_ACCESS_KEY=yyy RAKUTEN_AFFILIATE_ID=zzz node rakuten_sync.js
 *
 * 必要なライブラリ: npm install node-fetch
 *
 * 出力: products.json (お悩みカテゴリごとに商品リストをまとめたもの)
 */

const fetch = require('node-fetch');
const fs = require('fs');

const OUTPUT_PATH = 'products.json';

// ここに直接IDを書き込みます(GitHub Secretsの登録は不要になります)
const APP_ID = "f7caa972-8b81-4802-bf69-685db23b1cc2";
const ACCESS_KEY = "pk_8EFRkS01yZEuhfqqkUk40Q8SwERCt3GksswB1QoBcJd";
const AFFILIATE_ID = "56f04eff.04cce6cb.56f04f00.fedc8c9c";

// お悩みカテゴリと検索キーワード(ここを編集すればカテゴリの追加・変更ができる)
const WORRY_CATEGORIES = [
  { id: 'sujime', label: '爪の縦すじ・凸凹', keyword: 'ベースコート', hits: 4 },
  { id: 'nimaizume', label: '爪が薄い・二枚爪', keyword: 'ネイルオイル', hits: 4 },
  { id: 'teshiwa', label: '手のシワ・乾燥', keyword: 'ハンドクリーム', hits: 4 },
  { id: 'shokuba', label: '職場でバレたくない', keyword: 'マットネイル', hits: 4 },
];

// --- 楽天商品検索APIから商品を取得(2026年新エンドポイント対応) ---
async function fetchRakutenProducts(keyword, hits) {
  const url = new URL('https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601');
  url.searchParams.set('applicationId', APP_ID);
  url.searchParams.set('accessKey', ACCESS_KEY);
  url.searchParams.set('affiliateId', AFFILIATE_ID);
  url.searchParams.set('keyword', keyword);
  url.searchParams.set('hits', String(hits));
  url.searchParams.set('sort', '-reviewCount');
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.errors) {
    throw new Error(`楽天APIエラー: ${JSON.stringify(data.errors)}`);
  }

  return (data.Items || []).map(({ Item }) => ({
    name: Item.itemName,
    price: Item.itemPrice,
    imageUrl: (Item.mediumImageUrls && Item.mediumImageUrls[0] && Item.mediumImageUrls[0].imageUrl) || '',
    url: Item.affiliateUrl || Item.itemUrl,
  }));
}

// --- 実行本体 ---
async function runBatch() {
  const categories = {};

  for (const category of WORRY_CATEGORIES) {
    console.log(`--- 「${category.label}」(${category.keyword})を検索中 ---`);
    try {
      categories[category.id] = await fetchRakutenProducts(category.keyword, category.hits || 4);
      console.log(`  → ${categories[category.id].length}件取得`);
    } catch (err) {
      console.error(`  カテゴリ処理エラー(${category.label}):`, err.message);
      categories[category.id] = [];
    }
  }

  const output = {
    updatedAt: new Date().toISOString(),
    categories,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`完了: ${OUTPUT_PATH} を更新しました`);
}

runBatch();
