/* =========================================================
   ネイルピタ お悩み別ランキングページ
   products.json(GitHub Actionsが定期更新)を読み込んで表示する方式。
   ブラウザから楽天APIを直接呼ばないため、Referer/CORS関連の
   エラーが発生しない。
   ========================================================= */

/* ---------- お悩みカテゴリの表示設定 ----------
   ここでの id は、rakuten_sync.js の WORRY_CATEGORIES の id と
   一致させる必要があります(products.json 側のキーと対応するため)。 */
const CATEGORY_META = [
  { id: "sujime", label: "爪の縦すじ・凸凹", lead: "今すぐ隠したい、根本からなめらかにしたい" },
  { id: "namiuchi", label: "爪の波打ち・凸凹", lead: "表面のでこぼこを整えてつるんとした爪先に" },
  { id: "soriume", label: "そり爪・弱い爪", lead: "欠けやすい・反りやすい爪をしっかり補強したい" },
  { id: "nimaizume", label: "二枚爪", lead: "水仕事や乾燥から爪を守り、補強したい" },
  { id: "usuizume", label: "爪が薄い", lead: "薄くて弱い爪をじっくり育てたい" },
  { id: "sasakure", label: "甘皮のささくれ", lead: "痛い・見た目が気になるささくれをケアしたい" },
  { id: "fukazume", label: "深爪", lead: "短くなった爪を労って育てたい" },
  { id: "kamizume", label: "噛み爪", lead: "ついやってしまう爪噛みのクセをやめたい" },
  { id: "makizume", label: "巻き爪", lead: "食い込みや痛みをケアしたい" },
  { id: "yokosuji", label: "爪の横筋", lead: "体調や季節で出やすい横すじをケアしたい" },
  { id: "teshiwa", label: "手のしわ", lead: "手の甲や指先の年齢感をケアしたい" },
  { id: "tekansou", label: "手の乾燥", lead: "カサカサ・ひび割れをしっとりケアしたい" },
  { id: "tegare", label: "手荒れ", lead: "水仕事や乾燥による手荒れを和らげたい" },
];

const worrySectionsEl = document.getElementById("worrySections");
const worryIndexEl = document.getElementById("worryIndex");
const sectionContainers = {};

function formatPrice(price) {
  if (!price) return "";
  return "¥" + Number(price).toLocaleString("ja-JP");
}

function formatReview(item) {
  if (!item.reviewAverage || !item.reviewCount) return "";
  return "★" + Number(item.reviewAverage).toFixed(2) + "(" + Number(item.reviewCount).toLocaleString("ja-JP") + "件)";
}

function renderPlaceholder(container, message) {
  const div = document.createElement("div");
  div.className = "placeholder-card";
  div.textContent = message;
  container.appendChild(div);
}

function renderItems(container, items) {
  container.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";

    if (item.imageUrl) {
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.name;
      img.loading = "lazy";
      img.decoding = "async";
      card.appendChild(img);
    } else {
      const noImg = document.createElement("div");
      noImg.className = "item-noimage";
      noImg.textContent = "NAIL PITA";
      card.appendChild(noImg);
    }

    const body = document.createElement("div");
    body.className = "item-body";

    const name = document.createElement("div");
    name.className = "item-name";
    name.textContent = item.name;
    body.appendChild(name);

    const review = formatReview(item);
    if (review) {
      const reviewEl = document.createElement("div");
      reviewEl.className = "item-review";
      reviewEl.textContent = review;
      body.appendChild(reviewEl);
    }

    const price = document.createElement("div");
    price.className = "item-price";
    price.textContent = formatPrice(item.price);
    body.appendChild(price);

    const cta = document.createElement("a");
    cta.className = "item-cta";
    cta.href = item.url;
    cta.target = "_blank";
    cta.rel = "noopener noreferrer sponsored";
    cta.textContent = "楽天で詳しく見る";
    body.appendChild(cta);

    card.appendChild(body);
    container.appendChild(card);
  });
}

/* ---------- ページの土台(ナビ+各お悩みセクション)を組み立てる ---------- */
CATEGORY_META.forEach((category) => {
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
  sectionContainers[category.id] = itemsContainer;

  renderPlaceholder(itemsContainer, "読み込み中…");
});

/* ---------- products.json を読み込んで表示する ---------- */
fetch("./products.json", { cache: "no-store" })
  .then((res) => {
    if (!res.ok) {
      throw new Error("products.json が見つかりません(HTTP " + res.status + ")");
    }
    return res.json();
  })
  .then((data) => {
    const categories = data.categories || {};
    CATEGORY_META.forEach((category) => {
      const container = sectionContainers[category.id];
      const items = categories[category.id] || [];
      if (items.length === 0) {
        renderPlaceholder(container, "現在準備中です。しばらくお待ちください。");
        return;
      }
      renderItems(container, items);
    });
  })
  .catch((err) => {
    CATEGORY_META.forEach((category) => {
      renderPlaceholder(
        sectionContainers[category.id],
        "商品データの読み込みに失敗しました: " + err.message
      );
    });
  });
