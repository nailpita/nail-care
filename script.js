const ICONS = {
  sujime: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="8" width="16" height="28" rx="6"></rect><path d="M18 12 L18 32 M22 10 L22 34 M26 12 L26 32"></path></svg>`,
  nimaizume: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10 C13 18 13 28 16 36"></path><path d="M22 8 C20 18 20 30 24 38"></path><path d="M29 10 C31 18 31 28 28 36"></path></svg>`,
  sasakure: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8 v16"></path><path d="M22 24 c-4 2 -6 6 -4 10 c1.5 3 5 3 6 0 c1 3 4.5 3 6 0 c2 -4 0 -8 -4 -10"></path></svg>`,
  teshiwa: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8 C29 18 32 24 32 29 C32 35.5 27.5 39 22 39 C16.5 39 12 35.5 12 29 C12 24 15 18 22 8 Z"></path></svg>`,
  fukazume: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 30 C16 20 18 12 22 8 C26 12 28 20 28 30" ></path><path d="M16 30 a6 6 0 0 0 12 0"></path></svg>`,
  makizume: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8 v14"></path><path d="M14 22 a8 8 0 0 0 16 0"></path><path d="M14 22 c0 6 3 10 3 14"></path><path d="M30 22 c0 6 -3 10 -3 14"></path></svg>`,
};

// 各カテゴリの「けいイチオシ」商品(手動選定・楽天アフィリエイト)
const PICKS = {
  sujime: [
    {
      name: 'ハンドクリーム ギフト 80g べたつかない 無香料 てんまん エイジングケア ハンドケア 老け手 ヒアルロン酸',
      price: 2500,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/57a4a30f.8ecb2594.57a4a310.dfb2b8af/?me_id=1299286&item_id=10000000&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Ftenman-kosho-yakubo%2Fcabinet%2Ftenman-handcream%2F80g%2Fth003_006.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/57a4a30f.8ecb2594.57a4a310.dfb2b8af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftenman-kosho-yakubo%2Fbvhs02%2F&link_type=picttext',
    },
    {
      name: 'ネイルオイル 爪 美容液 ケア 10ml ペンタイプ 補強 オーガニック キューティクルオイル 甘皮 NATURECOオーガニック ナチュレコ',
      price: 1480,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/4c881b38.f58d47a4.4c881b39.ce0014a0/?me_id=1309777&item_id=10005750&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fvirginbeautyshop%2Fcabinet%2F04226192%2F10115789%2Fnr-og-004-no%2Fnr-og-no.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/4c881b38.f58d47a4.4c881b39.ce0014a0/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fvirginbeautyshop%2Fnr-og-004-no%2F&link_type=picttext',
    },
    {
      name: '【OPI公式】ネイルエンビー アセトンフリーリムーバー 2点セット 爪強化コート 補強 二枚爪 薄い爪 自爪ケア ベースコート',
      price: 5693,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/50b628f4.485d6265.50b628f5.e82957f4/?me_id=1403595&item_id=10000564&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fopiofficialshop%2Fcabinet%2F11558824%2Fset_r_06_5off_260618.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f4.485d6265.50b628f5.e82957f4/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fopiofficialshop%2Fset_r_06%2F&link_type=picttext',
    },
  ],
  nimaizume: [
    {
      name: '【レビュー4.5以上★高評価】ネイルオイル 高濃度 ヘマチン ヒト幹細胞配合 MYNAILPLEX マイネイルプレックス 二枚爪 割れ爪 育爪',
      price: 2728,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/5106d461.29b458c3.5106d462.88e3296e/?me_id=1416440&item_id=10000024&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Ftitanist%2Fcabinet%2Feasycreative%2Fmya0152c9a3.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/5106d461.29b458c3.5106d462.88e3296e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftitanist%2Fmynailplex-01%2F&link_type=picttext',
    },
  ],
  sasakure: [
    {
      name: 'ささくれニッパー ササキュア sasacure ヒカリ 甘皮処理 小爪 爪切り 日本製',
      price: 2680,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/50b62307.9a9507c8.50b62308.6cfeac8a/?me_id=1309810&item_id=10001485&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fnenrin%2Fcabinet%2Fitem%2F003%2Fsasacure_r.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/50b62307.9a9507c8.50b62308.6cfeac8a/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fnenrin%2Fj4560192903740-msm%2F&link_type=picttext',
    },
    {
      name: '【楽天1位】ネイルオイル Ceevs キューティクルオイル ペンタイプ スポイト 育爪 甘皮ケア',
      price: 1980,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/50b628f2.892dd749.50b628f3.098179cd/?me_id=1428429&item_id=10000000&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fceevs%2Fcabinet%2F12480252%2F12480253%2Fimgrc0109371360.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f2.892dd749.50b628f3.098179cd/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fceevs%2Fcvs-no-01%2F&link_type=picttext',
    },
  ],
  teshiwa: [
    {
      name: 'メデッサ スキンプロテクトクリーム 200g 医薬部外品 尿素配合ハンドクリーム 手荒れ 乾燥 あかぎれ',
      price: 3630,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/57a50dcd.bae6d9e6.57a50dce.5f57a7fa/?me_id=1309271&item_id=10016865&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fprimecollection%2Fcabinet%2Fkihon6%2F10018911.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/57a50dcd.bae6d9e6.57a50dce.5f57a7fa/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fprimecollection%2F10018911%2F&link_type=picttext',
    },
  ],
  fukazume: [
    {
      name: 'Grown Care キューティクルケアオイル 10ml グロウンケアオイル 正規 ネイルケア 育成 補強 強化 コート 甘皮 爪甲剥離 柑橘系 ベルガモット',
      price: 2230,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/50b6230d.bf086344.50b6230e.c3876def/?me_id=1421360&item_id=10000265&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fbrain-service%2Fcabinet%2Fproduct%2Fcompass1734400963%2Fimgrc0102978492.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/50b6230d.bf086344.50b6230e.c3876def/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbrain-service%2Fcompass1732250475%2F&link_type=picttext',
    },
  ],
  makizume: [
    {
      name: '＼楽天1位獲得／ 一般医療機器 巻き爪クリップ 1個入 ラクラク歩行 メディカル フットケア',
      price: 2860,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/57a51d2a.cc7cc0ab.57a51d2b.0ecced4b/?me_id=1322883&item_id=10004838&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fmonoproduction%2Fcabinet%2Fitems%2Frakuraku-walk%2F12683718%2Fmaki_clip_thmb2608.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/57a51d2a.cc7cc0ab.57a51d2b.0ecced4b/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmonoproduction%2Fraku0010%2F&link_type=picttext',
    },
  ],
};

// 「職場でバレたくない」は完全手動・API検索なしの独立枠
const SHOKUBA_ITEMS = [
  {
    name: '【送料無料】SHINYGEL Mio ベーシックセット(ピールベース・ワイプレストップ・カラージェル1色) はがせるジェルネイル 日本製',
    price: 2400,
    imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/3206a917.0bc0de04.3206a918.3fe2a07f/?me_id=1204435&item_id=10006757&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fnailkoubou%2Fcabinet%2Fsyouhin3%2Fmioset.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
    url: 'https://hb.afl.rakuten.co.jp/ichiba/3206a917.0bc0de04.3206a918.3fe2a07f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fnailkoubou%2Fshinygelmio-set%2F&link_type=picttext',
  },
  {
    name: '＼楽天ランキング1位／【ネイリスト監修】キューティクルニッパー 甘皮処理 ネイルケアセット',
    price: 1480,
    imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/2c6e94f1.a24b8d1f.2c6e94f2.2f9d021e/?me_id=1385805&item_id=10000006&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Ftcconlineshop%2Fcabinet%2Fcompass1645408067.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
    url: 'https://hb.afl.rakuten.co.jp/ichiba/2c6e94f1.a24b8d1f.2c6e94f2.2f9d021e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftcconlineshop%2Fatyc_008%2F&link_type=picttext',
  },
  {
    name: '【楽天369週1位】LED＆UVジェルネイルライト 48W 低ヒート機能 セルフネイル 1年保証 LaCurie公式',
    price: 2999,
    imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/17c473de.a80b972c.17c473df.cc380b23/?me_id=1322774&item_id=10000022&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Ftorreya-shop%2Fcabinet%2Fnaillight%2F11935452%2Fthumbnail_re2509.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
    url: 'https://hb.afl.rakuten.co.jp/ichiba/17c473de.a80b972c.17c473df.cc380b23/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftorreya-shop%2F100000013%2F&link_type=picttext',
  },
];

const CATEGORY_META = [
  {
    id: 'sujime',
    label: '縦すじ・凹凸',
    storyLabel: 'お悩み:爪の縦すじ・凹凸',
    title: 'その爪の溝、実は私も同じでした。',
    body: [
      '爪をなぞるとザラつく、マニキュアを塗るとムラになる…その正体は「爪甲縦条(そうこうじゅうじょう)」と呼ばれる縦線で、40代を過ぎた頃からぐっと気になり始める、いわば"年齢爪"の代表選手です。乾燥や加齢が主な原因なので、慌てて削って平らにしようとすると爪が薄く柔らかくなってしまうのでNG。まずは保湿からはじめてみませんか?',
      '横方向の凹凸や波打ちは、体調不良やストレス、栄養不足、甘皮への刺激が原因のことも。爪の主成分であるタンパク質(ケラチン)や、亜鉛・ビタミンB群を意識して摂るのもおすすめです。スプーン状にへこむ場合は鉄欠乏が関係していることもあるので、気になる方は皮膚科や内科に相談してみてくださいね。',
    ],
    tip: 'ネイルオイルは爪の根元(マトリックス)や甘皮までしっかり届くので、これから伸びてくる爪自体の質を底上げしてくれます。凹凸が気になるときは、削らずに埋めてくれるベースコートを重ねるのがおすすめです。',
  },
  {
    id: 'nimaizume',
    label: '二枚爪・薄い爪',
    storyLabel: 'お悩み:二枚爪・薄い爪',
    title: '爪の先がペロッとめくれる、あのお悩み。',
    body: [
      '爪の先が層になってペロッとめくれてしまう二枚爪。正式には「爪甲層状分裂症」といって、水仕事や消毒、除光液の使いすぎによる乾燥が主な原因です。めくれた部分は無理に剥がさず、爪切りよりも爪用やすりでそっと整えてあげるのがポイントです。',
    ],
    tip: 'ネイルオイルは爪の内部にうるおいを与えて、層がバラバラになるのを防いでくれます。伸びてくる途中の爪が薄くて心配なときは、補強コートで外側から守ってあげると割れやすさがぐっと減りますよ。',
  },
  {
    id: 'sasakure',
    label: 'ささくれ',
    storyLabel: 'お悩み:ささくれ',
    title: 'ピリッと痛む、あのささくれ。',
    body: [
      '爪の脇の皮膚がめくれてピリッと痛む、ささくれ。乾燥や水仕事、甘皮ケア不足が原因で、季節の変わり目に増えやすいお悩みです。気になってもつい引っ張りたくなりますが、清潔なはさみで切ってから保湿するのが正解です。',
    ],
    tip: 'ネイルオイルは甘皮の際まですっと浸透するテクスチャーなので、ささくれの根本原因である乾燥そのものにアプローチできます。朝・昼・寝る前の1日3回を習慣にできると、見違えるような変化を実感できると思います。',
  },
  {
    id: 'teshiwa',
    label: '手のシワ・乾燥',
    storyLabel: 'お悩み:手のシワ・乾燥(老け手)',
    title: '顔より先に、手で歳を感じることがあります。',
    body: [
      '「顔より先に手で歳を感じる」とよく言われる"老け手"。手の甲のシワや乾燥は、水分・油分の減少や紫外線の積み重ねが主な原因です。特別なことより、洗うたびに保湿する、というシンプルな習慣がいちばん効きます。',
    ],
    tip: '尿素配合のハンドクリームは、硬くなりがちな指先の角質までやわらげてくれるので、乾燥小ジワが気になる手肌にしっかりアプローチしてくれます。入浴後・手洗い後・寝る前のタイミングで塗るのが習慣化のコツです。手のゴワツキが気になるときは、ハンドスクラブから始めてみてください。',
  },
  {
    id: 'fukazume',
    label: '深爪・噛み癖',
    storyLabel: 'お悩み:深爪・噛み癖',
    title: '気づくと爪を噛んでしまう、そんな癖。',
    body: [
      '気づくと爪を噛んでしまう…この癖は医学的には「咬爪症(こうそうしょう)」と呼ばれ、無意識のうちに触ってしまうことが多いのが特徴です。大事なのは「我慢」より「触りたくならない状態」を作ること。私の場合は爪をヤスリで削ったり、甘皮ケアしたり、ジェルネイルをしたことで「噛みたい!」という気持ちが抑えられました。',
    ],
    tip: 'ネイルオイルは、触りたくなった瞬間の"代わりの行動"として塗る習慣にしやすいアイテム。ガラスファイルは爪先を少しずつ優しく整えられるので、深爪から抜け出す最初の一歩として使いやすいです。',
  },
  {
    id: 'makizume',
    label: '巻き爪',
    storyLabel: 'お悩み:巻き爪',
    title: '足の爪の端が食い込む、あの痛み。',
    body: [
      '足の爪の端が内側に巻き込んでしまう巻き爪。深爪や合わない靴、歩き方のクセが主な原因で、悪化すると「陥入爪(かんにゅうそう)」として痛みを伴うこともあります。爪の角を丸く削りすぎず、まっすぐ長めに切るのが基本のケアです。',
    ],
    tip: '巻き爪専用の保護アイテムは、痛みをやわらげながら正しい形へ少しずつ導いてくれるので、自己流のケアで悪化させてしまうリスクを減らせます。',
  },
];

const worryGridEl = document.getElementById('worryGrid');
const worrySectionsEl = document.getElementById('worrySections');

function formatPrice(price) {
  return '¥' + Number(price).toLocaleString('ja-JP');
}

function buildWorryGrid() {
  CATEGORY_META.forEach((cat) => {
    const card = document.createElement('a');
    card.className = 'worry-card';
    card.href = `#${cat.id}`;
    card.innerHTML = `${ICONS[cat.id] || ''}<span>${cat.label}</span>`;
    worryGridEl.appendChild(card);
  });
}

function buildDetailSections() {
  CATEGORY_META.forEach((cat) => {
    const section = document.createElement('section');
    section.className = 'worry-detail';
    section.id = cat.id;
    const bodyHtml = cat.body.map((p) => `<p class="body-text">${p}</p>`).join('');
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
        <div class="items" id="items-${cat.id}"></div>
      </div>
    `;
    worrySectionsEl.appendChild(section);
  });
}

function renderPlaceholder(container, message) {
  container.innerHTML = `<div class="placeholder-card">${message}</div>`;
}

function itemCardHtml(item, isPick) {
  return `
    <a class="item-card${isPick ? ' pick' : ''}" href="${item.url}" target="_blank" rel="noopener sponsored">
      <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
      <div class="item-body">
        ${isPick ? '<span class="pick-badge">けいのイチオシ</span>' : ''}
        <div class="item-name">${item.name}</div>
        <div class="item-price">${formatPrice(item.price)}</div>
        <span class="item-cta">詳細を見る</span>
      </div>
    </a>
  `;
}

function renderItems(container, pickItems, apiItems) {
  const cards = [];
  pickItems.forEach((item) => cards.push(itemCardHtml(item, true)));
  apiItems.forEach((item) => cards.push(itemCardHtml(item, false)));
  container.innerHTML = cards.join('');
}

async function init() {
  buildWorryGrid();
  buildDetailSections();

  // 「職場でバレたくない」枠(完全手動、API検索なし)
  renderItems(document.getElementById('items-shokuba'), SHOKUBA_ITEMS, []);

  try {
    const res = await fetch('products.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('products.json の読み込みに失敗しました');
    const data = await res.json();

    CATEGORY_META.forEach((cat) => {
      const container = document.getElementById(`items-${cat.id}`);
      const picks = PICKS[cat.id] || [];
      const apiItems = (data.categories && data.categories[cat.id]) || [];
      if (picks.length === 0 && apiItems.length === 0) {
        renderPlaceholder(container, '現在準備中です。しばらくお待ちください。');
      } else {
        renderItems(container, picks, apiItems);
      }
    });
  } catch (err) {
    CATEGORY_META.forEach((cat) => {
      const container = document.getElementById(`items-${cat.id}`);
      const picks = PICKS[cat.id] || [];
      if (picks.length > 0) {
        renderItems(container, picks, []);
      } else {
        renderPlaceholder(container, '読み込みエラーが発生しました。時間をおいて再度お試しください。');
      }
    });
  }
}

init();
