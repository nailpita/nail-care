const CATEGORY_META = [
  { id: "sujime", label: "爪の縦すじ・凸凹", lead: "今すぐ隠したい、根本からなめらかにしたい" },
  { id: "nimaizume", label: "爪が薄い・二枚爪", lead: "水仕事や乾燥から爪を守り、補強したい" },
  { id: "teshiwa", label: "手のシワ・乾燥", lead: "手の甲や指先の年齢感をケアしたい" },
  { id: "shokuba", label: "職場でバレたくない", lead: "派手にならず、清潔感のある指先にしたい" },
];

const worryIndexEl = document.getElementById("worryIndex");
const worrySectionsEl = document.getElementById("worrySections");

function formatPrice(price) {
  return "¥" + Number(price).toLocaleString("ja-JP");
}

function buildSections() {
  CATEGORY_META.forEach((cat) => {
    const navLi = document.createElement("li");
    navLi.innerHTML = `<a href="#${cat.id}">${cat.label}</a>`;
    worryIndexEl.appendChild(navLi);

    const section = document.createElement("section");
    section.className = "worry";
    section.id = cat.id;
    section.innerHTML = `
      <div class="worry-head">
        <div class="worry-label">お悩み</div>
        <h2>${cat.label}</h2>
        <p>${cat.lead}</p>
      </div>
      <div class="items" id="items-${cat.id}"></div>
    `;
    worrySectionsEl.appendChild(section);
  });
}

function renderPlaceholder(container, message) {
  container.innerHTML = `<div class="placeholder-card">${message}</div>`;
}

function renderItems(container, items) {
  container.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("a");
    card.className = "item-card";
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener sponsored";
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
      <div class="item-body">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${formatPrice(item.price)}</div>
        <span class="item-cta">詳細を見る</span>
      </div>
    `;
    container.appendChild(card);
  });
}

async function init() {
  buildSections();

  try {
    const res = await fetch("products.json", { cache: "no-store" });
    if (!res.ok) throw new Error("products.json の読み込みに失敗しました");
    const data = await res.json();

    CATEGORY_META.forEach((cat) => {
      const container = document.getElementById(`items-${cat.id}`);
      const items = (data.categories && data.categories[cat.id]) || [];
      if (items.length === 0) {
        renderPlaceholder(container, "現在準備中です。しばらくお待ちください。");
      } else {
        renderItems(container, items);
      }
    });
  } catch (err) {
    CATEGORY_META.forEach((cat) => {
      const container = document.getElementById(`items-${cat.id}`);
      renderPlaceholder(container, "読み込みエラーが発生しました。時間をおいて再度お試しください。");
    });
  }
}

init();
