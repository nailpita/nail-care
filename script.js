const ICONS = {
  sujime: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="8" width="16" height="28" rx="6"></rect><path d="M18 12 L18 32 M22 10 L22 34 M26 12 L26 32"></path></svg>`,
  nimaizume: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10 C13 18 13 28 16 36"></path><path d="M22 8 C20 18 20 30 24 38"></path><path d="M29 10 C31 18 31 28 28 36"></path></svg>`,
  teshiwa: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8 C29 18 32 24 32 29 C32 35.5 27.5 39 22 39 C16.5 39 12 35.5 12 29 C12 24 15 18 22 8 Z"></path></svg>`,
  shokuba: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="16" width="28" height="18" rx="3"></rect><path d="M16 16 V12 a3 3 0 0 1 3 -3 h6 a3 3 0 0 1 3 3 v4"></path></svg>`,
};

const CATEGORY_META = [
  {
    id: "sujime",
    label: "爪の縦すじ・凸凹",
    storyLabel: "お悩み:爪の縦すじ・凹凸",
    title: "その爪の溝、実は私も同じでした。",
    body: [
      "40代に入ってから、爪をなぞるとザラつきを感じるようになったんです。マニキュアを塗ってもムラになるし、光の加減で余計に目立つ。正直、鏡で指先を見るのが少し憂鬱でした。",
      "いろいろ試してたどり着いたのが、削らずに凹凸を埋めてくれるジェル。とろみのあるテクスチャーが溝にしっかり入り込んで、表面がふっとなめらかになる感覚は、使うたびに実感します。"
    ],
    tip: "自爪を傷めたくない方こそ、隠すより埋めるケアを選んでほしいです。"
  },
  {
    id: "nimaizume",
    label: "爪が薄い・二枚爪",
    storyLabel: "お悩み:爪が薄い・二枚爪",
    title: "水仕事のたびに、爪先が欠けるのが悩みでした。",
    body: [
      "家事や消毒で手を洗う回数が増えてから、爪の先が薄く割れやすくなりました。せっかく伸ばしても、ふとした瞬間に層が剥がれてがっかりすることも。",
      "補修ジェルで割れた部分を埋めながら、オイルで日々保湿するようにしてから、次に生えてくる爪の状態が明らかに変わってきました。"
    ],
    tip: "爪切りではなく爪やすりで整えると、二枚爪になりにくくなります。"
  },
  {
    id: "teshiwa",
    label: "手のシワ・乾燥",
    storyLabel: "お悩み:手のシワ・乾燥",
    title: "顔より先に、手で歳を感じることがあります。",
    body: [
      "お客様の手を施術しながら、自分の手の甲にも乾燥ジワが増えていることにふと気づいた瞬間がありました。顔と同じくらい人の目に触れる部分なのに、ケアが後回しになりがちなんですよね。",
      "お風呂上がりや寝る前、水分を与えたあとに油分でフタをするタイミングでハンドクリームを塗るようにしてから、指先の印象がだいぶ変わりました。"
    ],
    tip: "ハンドクリームを塗ったあとの就寝用手袋も効果的です。"
  },
  {
    id: "shokuba",
    label: "職場でバレたくない",
    storyLabel: "お悩み:職場でバレたくない",
    title: "ネイル規定がある職場のお客様に、よくご相談いただきます。",
    body: [
      "「派手な色は避けたいけれど、何もしていないのも寂しい」というご相談、サロンでとても多いんです。そんな方には、色を楽しむより整えることに重点を置いたケアをおすすめしています。",
      "ツヤを抑えたマット仕上げやベースコートのみの仕上げなら、きちんと手入れされている印象は残しつつ、職場でも浮きにくくなります。"
    ],
    tip: "ツヤを抑えたマット仕上げは、ケアしている印象を与えつつ控えめに見えます。"
  },
];

const worryGridEl = document.getElementById("worryGrid");
const worrySectionsEl = document.getElementById("worrySections");

function formatPrice(price) {
  return "¥" + Number(price).toLocaleString("ja-JP");
}

function buildWorryGrid() {
  CATEGORY_META.forEach((cat) => {
    const card = document.createElement("a");
    card.className = "worry-card";
    card.href = `#${cat.id}`;
    card.innerHTML = `${ICONS[cat.id] || ""}<span>${cat.label}</span>`;
    worryGridEl.appendChild(card);
  });
}

function buildDetailSections() {
  CATEGORY_META.forEach((cat) => {
    const section = document.createElement("section");
    section.className = "worry-detail";
    section.id = cat.id;
    const bodyHtml = cat.body.map((p) => `<p class="body-text">${p}</p>`).join("");
    section.innerHTML = `
      <div class="wrap">
        <div class="story-card">
          <div class="story-head">
            <img src="assets/founder.jpg" alt="けい">
            <div>
              <p class="who">けい</p>
              <p class="role">ネイリスト</p>
            </div>
          </div>
          <p class="story-label">${cat.storyLabel}</p>
          <h3>${cat.title}</h3>
          ${bodyHtml}
          <div class="tip-box">
            <p class="tip-label">私だったら、これをおすすめします。</p>
            <p class="tip-body">${cat.tip}</p>
          </div>
        </div>
        <p class="items-label">私が選んだ、${cat.label}ケアアイテム</p>
        <div class="items" id="items-${cat.id}"></div>
      </div>
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
  buildWorryGrid();
  buildDetailSections();

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
