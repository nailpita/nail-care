// ▼1つのお悩みに表示する商品の最大数
const MAX_ITEMS_PER_CATEGORY = 3;

// ▼楽天の公式バナー画像が表示できなかったとき、楽天の画像置き場(サムネイル)の画像に切り替えるか
//   true=切り替える(おすすめ) / false=切り替えない
const USE_THUMB_FALLBACK = true;

// ▼商品1個ぶんのデータを、リンクと画像のURLつきで作る道具
//   id    : 楽天アフィリエイトのリンクID(hb.afl.rakuten.co.jp/ichiba/ の次の部分)
//   path  : 楽天の商品ページの「ショップ名/商品番号」
//   me/item: 画像のURLに入っている me_id と item_id
//   thumb : 画像のファイルの場所(@0_mall/ の次の部分)
//   from  : true にすると「¥990〜」のように「〜」が付く
//   pick  : true にすると「けいのイチオシ」の目印が付く
//   rating/reviews : 楽天の評価と件数(書くと「★4.64(4,080件)」と表示)
//   voice : 口コミのひとこと(書くとカードに表示)
//   ※me/item がわからない商品は省略可(楽天の画像置き場の画像を直接表示します)
const mk = (o) => {
  const thumbUrl = `https://thumbnail.image.rakuten.co.jp/@0_mall/${o.thumb}?_ex=400x400`;
  return {
    name: o.name,
    label: o.label || '',
    price: o.price,
    priceFrom: !!o.from,
    pick: !!o.pick,
    rating: o.rating || '',
    reviews: o.reviews || '',
    voice: o.voice || '',
    url: `https://hb.afl.rakuten.co.jp/ichiba/${o.id}/?pc=${encodeURIComponent(`https://item.rakuten.co.jp/${o.path}/`)}&link_type=picttext`,
    imageUrl: o.me
      ? `https://hbb.afl.rakuten.co.jp/hgb/${o.id}/?me_id=${o.me}&item_id=${o.item}&pc=${encodeURIComponent(thumbUrl)}&s=400x400&t=picttext`
      : thumbUrl,
    thumbUrl,
  };
};

const PICKS = {
  // ① 縦すじ
  tatesuji: [
    mk({ id: '57a4a30f.8ecb2594.57a4a310.dfb2b8af', path: 'tenman-kosho-yakubo/bvhs02', me: 1299286, item: 10000000,
         thumb: 'tenman-kosho-yakubo/cabinet/tenman-handcream/80g/th003_006.jpg',
         name: 'てんまん ハンドクリーム 80g 無香料(ヒアルロン酸・日本酒成分配合)', label: 'エイジングケアハンドクリーム', price: 2500 }),
    mk({ id: '50d3253b.94448a85.50d3253c.6ab7dffb', path: 'carnival-mania/otonaoil', me: 1426893, item: 10000000,
         thumb: 'carnival-mania/cabinet/otonanailoil/imgrc0098820783.jpg',
         name: 'ネイルオイル キューティクルオイル 10ml 植物性 大人の爪オイル', label: 'ネイルオイル', price: 3280, pick: true }),
    mk({ id: '50b628f4.485d6265.50b628f5.e82957f4', path: 'opiofficialshop/set_r_06', me: 1403595, item: 10000564,
         thumb: 'opiofficialshop/cabinet/11558824/set_r_06_5off_260618.jpg',
         name: 'OPI ネイルエンビー(爪強化コート) アセトンフリーリムーバー 2点セット', label: 'ネイルハードナー', price: 5693 }),
  ],

  // ② 横すじ・波打ち
  yokosuji: [
    mk({ id: '583cd92d.933d0f90.583cd92e.2ffdfbad', path: 'naturein-store/naturein-sp-bio', me: 1418060, item: 10000027,
         thumb: 'naturein-store/cabinet/naturein/11517932/imgrc0097234568.jpg',
         name: 'ビオチン 180日分(500μg×180粒) Nature In 国内製造', label: 'ビオチンサプリ(指先を健康に)', price: 990, from: true }),
    mk({ id: '2c687d65.a9e2c3e4.2c687d66.6f5218d5', path: 'bambi-water/bambidietshake', me: 1294199, item: 10000052,
         thumb: 'bambi-water/cabinet/page/bps/bps_th00_2412.jpg',
         name: 'バンビウォーター ソイプロテイン 250g 栄養機能食品', label: 'プロテイン(爪の原材料)', price: 2998, from: true }),
    mk({ id: '57a4a07b.ffa48a97.57a4a07c.ab850dd9', path: 'fancl-shop/5947-03', me: 1335893, item: 10009023,
         thumb: 'fancl-shop/cabinet/item-img/5500-5999/5947.jpg',
         name: 'ファンケル 亜鉛 栄養機能食品', label: '亜鉛サプリ', price: 907, from: true }),
  ],

  // ③ そり爪・へこみ
  soriduma: [
    mk({ id: '583ce016.925c2e38.583ce017.61afdb20', path: 'tsubamelife-health/tetsu240', me: 1432349, item: 10000017,
         thumb: 'tsubamelife-health/cabinet/11719095/11897775/11897777/imgrc0098738666.jpg',
         name: '鉄分 21mg(240日分) 鉄サプリ 葉酸 Vitanad+(ビタナッド)', label: '鉄サプリ', price: 1390 }),
    mk({ id: '583ce49a.cc336727.583ce49b.51904b4d', path: 'j-cosme/10000616', me: 1282212, item: 10000616,
         thumb: 'j-cosme/cabinet/biiino/item/main-image/20260717105728_1.jpg',
         name: '興和 ドクターネイル ディープセラム 手爪用 6.6mL', label: 'ネイル美容液', price: 4180 }),
    mk({ id: '583d0a0d.156a1fd9.583d0a0e.d2be2ab7', path: 'cigar-shop/nobisakku', me: 1397216, item: 10002664,
         thumb: 'cigar-shop/cabinet/10735994/11370418/imgrc0092565659.jpg',
         name: 'ノビサック 指サック 使い捨て ゴムタイプ(サイズ展開あり)', label: '指先の保護', price: 440, from: true }),
  ],

  // ④ 二枚爪・薄い爪
  nimaizume: [
    mk({ id: '33cc38c2.863fc636.33cc38c3.ee1572a5', path: 'ken-inc/vt-ns-black', me: 1404059, item: 10000067,
         thumb: 'ken-inc/cabinet/09286543/compass1772773479.jpg',
         name: 'ガラス製 爪やすり ネイルシャイナー(VITOMS)', label: '爪やすり', price: 1000, from: true }),
    mk({ id: '5106d461.29b458c3.5106d462.88e3296e', path: 'titanist/mynailplex-01', me: 1416440, item: 10000024,
         thumb: 'titanist/cabinet/easycreative/mya0152c9a3.jpg',
         name: 'MYNAILPLEX(マイネイルプレックス) ネイルオイル 10mL 日本製', label: '二枚爪におすすめの美容液', price: 2728, pick: true }),
    mk({ id: '2c68703e.80799441.2c68703f.325f3318', path: 'ohora/nail-strengthener', me: 1398160, item: 10004243,
         thumb: 'ohora/cabinet/thumbnail_01/imgrc0106110131.jpg',
         name: 'ohora ネイル強化剤 nail strengthener(カラー&ケア同時)', label: 'ケアしながらマニキュア', price: 1599 }),
  ],

  // ⑤ ささくれ
  sasakure: [
    mk({ id: '50b62307.9a9507c8.50b62308.6cfeac8a', path: 'nenrin/j4560192903740-msm', me: 1309810, item: 10001485,
         thumb: 'nenrin/cabinet/item/003/sasacure_r.jpg',
         name: 'ささくれニッパー ササキュア sasacure 日本製', label: 'ささくれニッパー', price: 2680 }),
    mk({ id: '50b628f2.892dd749.50b628f3.098179cd', path: 'ceevs/cvs-no-01', me: 1428429, item: 10000000,
         thumb: 'ceevs/cabinet/12480252/12480253/imgrc0109371360.jpg',
         name: 'Ceevs キューティクルオイル ペンタイプ ネイルオイル', label: '持ち運びしやすいネイルオイル', price: 1980, from: true, pick: true }),
    mk({ id: '583d146b.d3f81dd5.583d146c.625ceade', path: 'bondstreet007/slg008971', me: 1214354, item: 10016752,
         thumb: 'bondstreet007/cabinet/03140552/imgrc0065458490.jpg',
         name: 'ゾーリンゲン(ドイツ) AXiON ハサミ型 甘皮切り・ささくれ切り', label: 'ハサミタイプのささくれカッター', price: 1584 }),
  ],

  // ⑥ 手のシワ・乾燥
  teshiwa: [
    mk({ id: '57a50dcd.bae6d9e6.57a50dce.5f57a7fa', path: 'primecollection/10018911', me: 1309271, item: 10016865,
         thumb: 'primecollection/cabinet/kihon6/10018911.jpg',
         name: 'メデッサ スキンプロテクトクリーム 200g 医薬部外品 尿素配合', label: '尿素配合ハンドクリーム', price: 3630, pick: true }),
    mk({ id: '50b628f0.51950c59.50b628f1.f3778e6f', path: 'prinature/pnscrub', me: 1360700, item: 10000003,
         thumb: 'prinature/cabinet/dai1/imgrc0140409798.jpg',
         name: 'プリナチュール シュガースクラブ 100g(北海道産てんさい糖)', label: 'ハンドスクラブ', price: 3970 }),
    mk({ id: '50d3253b.94448a85.50d3253c.6ab7dffb', path: 'carnival-mania/wakaku', me: 1426893, item: 10000001,
         thumb: 'carnival-mania/cabinet/handcream/imgrc0097812579.jpg',
         name: 'ハンドクリーム 大人の手肌ワカク(ナイアシンアミド・生プラセンタ配合)', label: '美容成分入りハンドクリーム', price: 4400 }),
  ],

  // ⑦ 深爪・噛み癖
  fukazume: [
    mk({ id: '3254aeb5.39a589ad.3254aeb6.d2cab7c4', path: 'fitone/fukatume-set', me: 1206715, item: 10028402,
         thumb: 'fitone/cabinet/07219617/09117665/imgrc0115272167.jpg',
         name: '深爪卒業ケアセット(爪強化剤・ネイルオイル・爪やすり・リムーバーほか)', label: '深爪卒業セット', price: 10536 }),
    mk({ id: '58245d54.51491727.58245d55.143cef90', path: 'kizku/tsumemamori-otn', me: 1380140, item: 10000007,
         thumb: 'kizku/cabinet/item/item01_tm/imgrc0082320846.jpg',
         name: 'つめまもり 苦いマニキュア 6ml(目立たない・爪噛み防止)', label: '苦味で噛み癖を撃退', price: 1580 }),
    mk({ id: '50b6230d.bf086344.50b6230e.c3876def', path: 'brain-service/compass1732250475', me: 1421360, item: 10000265,
         thumb: 'brain-service/cabinet/product/compass1734400963/imgrc0102978492.jpg',
         name: 'Grown Care キューティクルケアオイル 10ml(柑橘系・ベルガモット)', label: '早く爪を伸ばしたい人に', price: 2280, from: true, pick: true }),
  ],

  // ⑨ 巻き爪
  makizume: [
    mk({ id: '57a51d2a.cc7cc0ab.57a51d2b.0ecced4b', path: 'monoproduction/raku0010', me: 1322883, item: 10004838,
         thumb: 'monoproduction/cabinet/items/rakuraku-walk/12683718/maki_clip_thmb2608.jpg',
         name: '巻き爪クリップ 1個入 一般医療機器 ラクラク歩行', label: '巻き爪クリップ', price: 2860 }),
    mk({ id: '583cf3d6.337d94c4.583cf3d7.77cc8222', path: 'skyglee/bst0020', me: 1440664, item: 10000006,
         thumb: 'skyglee/cabinet/13222318/10.jpg',
         name: '巻き爪テープ 10枚入り 一般医療機器 防水仕様 透明タイプ', label: 'お手軽巻き爪テープ', price: 2999 }),
    mk({ id: '3206a915.c75d1475.3206a916.62e9f7af', path: 'mikagami/10000000', me: 1395225, item: 10000000,
         thumb: 'mikagami/cabinet/item01/2-2.jpg',
         name: '巻き爪用 爪切りニッパー 足用', label: '巻き爪用爪切り', price: 1690 }),
  ],
  // ⑩ かかとのガサガサ(評価・件数は2026年10月31日時点)
  kakato: [
    mk({ id: '585d49df.a3324dd6.585d49e9.da7a211f', path: 'lorelife/b1905c-009',
         thumb: 'lorelife/cabinet/beauty/009/imgrc0077981613.jpg',
         name: 'Lefina かかとやすり(皮膚科医監修・楽天1位15冠)', label: 'かかとやすり', price: 1780,
         rating: '4.64', reviews: '4,080', voice: '50代「裏表でやすりの細さが違うのがよい。丸洗いできる」' }),
    mk({ id: '588f715c.f0e6e669.588f7164.5ca99903', path: 'otbj/sosu-064_sale',
         thumb: 'otbj/cabinet/01928150/03133358/03541596/220916_pr2_1000.jpg',
         name: 'フットピーリングパック ペロリン 2回分(日本製・履くだけ)', label: '履くだけ角質ケア', price: 1390,
         rating: '4.31', reviews: '9,858', voice: '40代「年2回くらい使っている。むけている間はクリームをたっぷりつけて靴下を履く」' }),
    mk({ id: '58f9a792.f962ff4a.58f9a793.c78506f3', path: 'llic/hot-cure',
         thumb: 'llic/cabinet/item2/hot-cure4-1.jpg',
         name: 'Hot-cure(ホットキュア) かかとケア靴下', label: 'かかとケア靴下', price: 2200,
         rating: '4.71', reviews: '1,524', voice: '40代「かかとがしっとりして暖かい」。一方で「少しずれると、かかとの部分が足の裏に当たる」という声もあります。' }),
  ],
};

// ⑧ 職場でバレたくない
const SHOKUBA_ITEMS = [
  mk({ id: '3206a917.0bc0de04.3206a918.3fe2a07f', path: 'nailkoubou/shinygelmio-set', me: 1204435, item: 10006757,
       thumb: 'nailkoubou/cabinet/syouhin3/mioset.jpg',
       name: 'SHINYGEL Mio ベーシックセット(ピールベース・ワイプレストップ・カラージェル1色) はがせるジェルネイル', label: 'はがせるジェルネイルセット', price: 2400, from: true }),
  mk({ id: '2c6e94f1.a24b8d1f.2c6e94f2.2f9d021e', path: 'tcconlineshop/atyc_008', me: 1385805, item: 10000006,
       thumb: 'tcconlineshop/cabinet/compass1645408067.jpg',
       name: 'キューティクルニッパー ネイリスト監修 甘皮処理', label: '甘皮ケアに', price: 1480 }),
  mk({ id: '17c473de.a80b972c.17c473df.cc380b23', path: 'torreya-shop/100000013', me: 1322774, item: 10000022,
       thumb: 'torreya-shop/cabinet/naillight/11935452/thumbnail_re2509.jpg',
       name: 'LED&UV ジェルネイルライト 48W 低ヒート機能 1年保証', label: 'ネイルライト', price: 2999 }),
];

// ▼表示の確認用:ページのURLの最後に ?debug=1 を付けると、画像の表示結果が画面の下に出ます
const DEBUG = new URLSearchParams(location.search).get('debug') === '1';
const imgLog = {};

function esc(str) {
  return String(str).replace(/[&<>"']/g, (s) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[s]));
}

function formatPrice(price, from) {
  return '¥' + Number(price).toLocaleString('ja-JP') + (from ? '〜' : '');
}

function logImg(img, status) {
  if (!DEBUG) return;
  imgLog[img.dataset.name || img.alt] = status;
  let panel = document.getElementById('imgDebug');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'imgDebug';
    panel.style.cssText = 'position:fixed;left:0;right:0;bottom:0;max-height:45vh;overflow:auto;background:#000d;color:#fff;font-size:11px;line-height:1.5;padding:8px 10px;z-index:9999;';
    document.body.appendChild(panel);
  }
  const rows = Object.keys(imgLog).map((k) => `${imgLog[k]} ${k.slice(0, 22)}`);
  panel.innerHTML = `<b>画面の幅 ${window.innerWidth}px / 画像の結果(${rows.length}件)</b><br>` + rows.join('<br>');
}

// 画像が表示できなかったとき:①楽天の画像置き場の画像に切り替え → ②それも無理なら「画像は楽天で確認」の表示に
function onItemImgError(img) {
  if (img.dataset.step !== 'thumb' && USE_THUMB_FALLBACK && img.dataset.thumb) {
    img.dataset.step = 'thumb';
    logImg(img, '[公式画像NG→切替中]');
    img.src = img.dataset.thumb;
    return;
  }
  img.dataset.step = 'none';
  img.parentElement.classList.add('no-img');
  logImg(img, '[画像NG]');
}

// 読み込みは成功しても、1ピクセルほどの空の画像が返ってきたときも「失敗」として扱う
function onItemImgLoad(img) {
  if (img.naturalWidth <= 2) {
    onItemImgError(img);
    return;
  }
  logImg(img, img.dataset.step === 'thumb' ? '[OK:切替後の画像]' : '[OK]');
}
window.onItemImgError = onItemImgError;
window.onItemImgLoad = onItemImgLoad;

function renderPlaceholder(container, message) {
  container.innerHTML = `<div class="placeholder-card">${message}</div>`;
}

function itemCardHtml(item) {
  const isPick = !!item.pick;
  const lazy = DEBUG ? 'eager' : 'lazy';
  return `
    <a class="item-card${isPick ? ' pick' : ''}" href="${item.url}" target="_blank" rel="noopener sponsored">
      <div class="item-thumb">
        ${isPick ? '<span class="pick-badge">けいのイチオシ</span>' : ''}
        <img src="${item.imageUrl}" data-thumb="${item.thumbUrl || ''}" data-name="${esc(item.name)}" alt="${esc(item.name)}"
             loading="${lazy}" decoding="async" onload="onItemImgLoad(this)" onerror="onItemImgError(this)">
      </div>
      <div class="item-body">
        ${item.label ? `<p class="item-tag">${esc(item.label)}</p>` : ''}
        <div class="item-name">${esc(item.name)}</div>
        <div class="item-price">${formatPrice(item.price, item.priceFrom)}</div>
        ${item.rating ? `<p class="item-rating">★${esc(item.rating)}${item.reviews ? `(${esc(item.reviews)}件)` : ''}</p>` : ''}
        ${item.voice ? `<p class="item-voice">${esc(item.voice)}</p>` : ''}
        <span class="item-cta">楽天で見る</span>
      </div>
    </a>
  `;
}

function renderItems(container, pickItems, apiItems) {
  const remaining = Math.max(0, MAX_ITEMS_PER_CATEGORY - pickItems.length);
  const limitedApi = apiItems.slice(0, remaining);

  const cards = [];
  pickItems.forEach((item) => cards.push(itemCardHtml(item)));
  limitedApi.forEach((item) => cards.push(itemCardHtml(item)));
  container.innerHTML = cards.join('');
}

// ▼ページごとに表示する商品の組み合わせ
//   picks : [PICKSのカテゴリ名, その中の何番目か(0から数える)] の並び。上から順に表示されます
//   api   : 商品が3つに満たないとき、products.json のどのカテゴリから足すか(なければ省略)
const PAGE_ITEMS = {
  tatesuji:  { picks: [['tatesuji', 0], ['tatesuji', 1], ['tatesuji', 2]], api: 'tatesuji' },
  yokosuji:  { picks: [['nimaizume', 1], ['nimaizume', 0]] },
  namiuchi:  { picks: [['sasakure', 1], ['tatesuji', 0]], api: 'tatesuji' },
  soriduma:  { picks: [['nimaizume', 0], ['nimaizume', 1], ['nimaizume', 2]] },
  nimaizume: { picks: [['nimaizume', 0], ['nimaizume', 1], ['nimaizume', 2]] },
  usui:      { picks: [['tatesuji', 2], ['nimaizume', 2], ['nimaizume', 1]] },
  sasakure:  { picks: [['sasakure', 0], ['sasakure', 1], ['sasakure', 2]] },
  teshiwa:   { picks: [['teshiwa', 2], ['teshiwa', 0]] },
  kansou:    { picks: [['teshiwa', 0], ['teshiwa', 2]] },
  teare:     { picks: [['teshiwa', 0], ['teshiwa', 2]] },
  fukazume:  { picks: [['fukazume', 0], ['fukazume', 2], ['nimaizume', 0]] },
  kamizume:  { picks: [['fukazume', 1], ['nimaizume', 0], ['fukazume', 2]] },
  makizume:  { picks: [['makizume', 0], ['makizume', 1], ['makizume', 2]] },
  kakato:    { picks: [['kakato', 0], ['kakato', 1], ['kakato', 2]] },
};

async function init() {
  const root = document.body.dataset.root || '';

  // トップページ:「職場でバレたくない」の商品
  const shokubaEl = document.getElementById('items-shokuba');
  if (shokubaEl) renderItems(shokubaEl, SHOKUBA_ITEMS, []);

  // お悩みページ:そのページ用の商品
  const box = document.getElementById('items');
  if (!box) return;
  const conf = PAGE_ITEMS[box.dataset.page];
  if (!conf) return;

  const picks = conf.picks.map(([cat, i]) => (PICKS[cat] || [])[i]).filter(Boolean);
  let apiItems = [];
  if (conf.api && picks.length < MAX_ITEMS_PER_CATEGORY) {
    try {
      const res = await fetch(root + 'products.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        apiItems = (data.categories && data.categories[conf.api]) || [];
      }
    } catch (err) {
      // 読み込めなくても、手動で選んだ商品だけで表示します
    }
  }

  if (picks.length + apiItems.length === 0) {
    renderPlaceholder(box, '現在準備中です。しばらくお待ちください。');
  } else {
    renderItems(box, picks, apiItems);
  }
}

init();
