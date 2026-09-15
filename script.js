/* =========================================================
   ネイルピタ お悩み別ランキングページ
   楽天商品検索API(IchibaItem/Search)連携スクリプト
   ========================================================= */

/* ---------- ① ここにご自身のIDを入力してください ---------- */
const APP_ID = "f7caa972-8b81-4802-bf69-685db23b1cc2";
const AFFILIATE_ID = "56f04eff.04cce6cb.56f04f00.fedc8c9c";

/* ---------- ② お悩みカテゴリ設定 ----------
   ラベル・説明文・検索キーワードを自由に編集/追加できます。
   keyword は楽天市場の商品検索に使うワードです。 */
const WORRY_CATEGORIES = [
  {
    id: "sujime",
    label: "爪の縦すじ・凸凹",
    lead: "今すぐ隠したい、根本からなめらかにしたい",
    keyword: "ネイル ベースコート 凹凸 補正",
    hits: 4
  },
  {
    id: "nimaizume",
    label: "爪が薄い・二枚爪",
    lead: "水仕事や乾燥から爪を守り、補強したい",
    keyword: "ネイル ハードナー 爪 補強",
    hits: 4
  },
  {
    id: "teshiwa",
    label: "手のシワ・乾燥",
    lead: "手の甲や指先の年齢感をケアしたい",
    keyword: "ハンドクリーム エイジングケア 保湿",
    hits: 4
  },
  {
    id: "shokuba",
    label: "職場でバレたくない",
    lead: "派手にならず、清潔感のある指先にしたい",
    keyword: "ネイル マット ベースコート 自爪風",
    hits: 4
  }
];

/* ---------- ③ 以下は自動処理(基本的に編集不要) ---------- */

const worrySectionsEl = document.getElementById("worrySections");
const worryIndexEl = document.getElementById("worryIndex");
const configBannerEl = document.getElementById("configBanner");

const isConfigured =
  APP_ID && APP_ID.indexOf("ここに") === -1 &&
  AFFILIATE_ID && AFFILIATE_ID.indexOf("ここに") === -1;

if (isConfigured && configBannerEl) {
  configBannerEl.style.display = "none";
}

function formatPrice(price) {
  return "¥" + Number(price).toLocaleString("ja-JP");
}

function renderPlaceholder(container, message) {
  const div = document.createElement("div");
  div.className = "placeholder-card";
  div.textContent = message;
  container.appendChild(div);
}

function renderItems(container, items) {
  container.innerHTML = "";
  items.forEach((wrapper) => {
    const item = wrapper.Item;
    const card = document.createElement("div");
    card.className = "item-card";

    const img = document.createElement("img");
    img.src =
      (item.mediumImageUrls && item.mediumImageUrls[0] && item.mediumImageUrls[0].imageUrl) ||
      "";
    img.alt = item.itemName;
    card.appendChild(img);

    const body = document.createElement("div");
    body.className = "item-body";

    const name = document.createElement("div");
    name.className = "item-name";
    name.textContent = item.itemName;
    body.appendChild(name);

    const price = document.createElement("div");
    price.className = "item-price";
    price.textContent = formatPrice(item.itemPrice);
    body.appendChild(price);

    const cta = document.createElement("a");
    cta.className = "item-cta";
    cta.href = item.affiliateUrl || item.itemUrl;
    cta.target = "_blank";
    cta.rel = "noopener noreferrer sponsored";
    cta.textContent = "詳しく見る";
    body.appendChild(cta);

    card.appendChild(body);
    container.appendChild(card);
  });
}

/* JSONPで楽天APIを呼び出す(ブラウザからの直接fetchはCORSで弾かれるため) */
function fetchRakutenItems(category, container) {
  const callbackName = "rakutenCallback_" + category.id;

  window[callbackName] = function (data) {
    delete window[callbackName];
    script.remove();

    if (!data || !data.Items || data.Items.length === 0) {
      renderPlaceholder(container, "商品が見つかりませんでした。キーワードを見直してください。");
      return;
    }
    renderItems(container, data.Items);
  };

  const params = new URLSearchParams({
    format: "json",
    keyword: category.keyword,
    hits: String(category.hits || 4),
    sort: "-reviewCount",
    applicationId: APP_ID,
    affiliateId: AFFILIATE_ID,
    callback: callbackName
  });

  const script = document.createElement("script");
  script.src =
    "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?" +
    params.toString();
  script.onerror = function () {
    renderPlaceholder(container, "商品の取得に失敗しました。IDの設定をご確認ください。");
  };
  document.body.appendChild(script);
}

/* ---------- ページ組み立て ---------- */
WORRY_CATEGORIES.forEach((category) => {
  // ナビ
  const navLi = document.createElement("li");
  const navA = document.createElement("a");
  navA.href = "#" + category.id;
  navA.textContent = category.label;
  navLi.appendChild(navA);
  worryIndexEl.appendChild(navLi);

  // セクション
  const section = document.createElement("section");
  section.className = "worry";
  section.id = category.id;

  const head = document.createElement("div");
  head.className = "worry-head";
  head.innerHTML = `
    <div class="worry-label">お悩み</div>
    <h2>${category.label}</h2>
    <p>${category.lead}</p>
  `;
  section.appendChild(head);

  const itemsContainer = document.createElement("div");
  itemsContainer.className = "items";
  section.appendChild(itemsContainer);

  worrySectionsEl.appendChild(section);

  if (isConfigured) {
    renderPlaceholder(itemsContainer, "読み込み中…");
    fetchRakutenItems(category, itemsContainer);
  } else {
    renderPlaceholder(
      itemsContainer,
      "APP_ID / AFFILIATE_ID を設定すると、ここに商品が自動表示されます"
    );
  }
});
