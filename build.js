/**
 * ネイルピタ ページ作成スクリプト
 *
 * 使い方:  node build.js
 *   → index.html(トップ) / お悩みごとのページ(○○/index.html) / sitemap.xml を作り直します。
 *
 * 文面を直したいときは、下の WORRIES の中の文章を直して、もう一度 node build.js を実行してください。
 * (お悩みごとの文面は、Notion「爪と手のお悩み13種｜無料説明文（SEO・アフィリエイト用）」から転記したものです)
 * 商品の組み合わせは script.js の PAGE_ITEMS で決めています。
 */
const fs = require('fs');
const path = require('path');

const SITE = 'https://nailpita.github.io/nail-care';
const UPDATED = '2026-10-30';
const UPDATED_JP = '2026年10月30日';
const OG_IMAGE = `${SITE}/assets/hand-care.jpg`;
const ROOM_URL = 'https://room.rakuten.co.jp/room_ed10370aee/items';
const INSTAGRAM_URL = 'https://www.instagram.com/kei_arafif_nail/';
const GA_ID = 'G-RN1JQ474DS';
const GSC_VERIFY = 'fTiN5ONsfGfMuDdtScl3MJups67DtgfAXP_2-65v3HM';

// ===== お悩みごとのアイコン(線画) =====
const NAIL = 'M14 34 C13 22 15 10 22 6 C29 10 31 22 30 34';
const NAIL_BOTTOM = 'M14 32 Q22 37 30 32';
const svg = (inner) =>
  `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const ICONS = {
  tatesuji: svg(`<path d="${NAIL}"></path><path d="${NAIL_BOTTOM}"></path><path d="M18 14 L17 29 M22 10 L22 31 M26 14 L27 29"></path>`),
  yokosuji: svg(`<path d="${NAIL}"></path><path d="${NAIL_BOTTOM}"></path><path d="M16 15 Q22 12 28 15 M15 21 Q22 18 29 21 M15 27 Q22 24 29 27"></path>`),
  namiuchi: svg(`<path d="${NAIL}"></path><path d="${NAIL_BOTTOM}"></path><path d="M16 14 Q19 11 22 14 T28 14 M16 20 Q19 17 22 20 T28 20 M16 26 Q19 23 22 26 T28 26"></path>`),
  soriduma: svg(`<path d="${NAIL}"></path><path d="${NAIL_BOTTOM}"></path><path d="M16 13 Q22 22 28 13"></path>`),
  nimaizume: svg(`<path d="${NAIL}"></path><path d="${NAIL_BOTTOM}"></path><path d="M16 16 Q22 12 28 16"></path><path d="M15 19 Q22 15.5 29 19"></path>`),
  usui: svg(`<path d="${NAIL}"></path><path d="${NAIL_BOTTOM}"></path><path d="M17 20 L27 20" stroke-dasharray="2 3"></path><path d="M17 26 L27 26" stroke-dasharray="2 3"></path>`),
  sasakure: svg(`<path d="${NAIL}"></path><path d="${NAIL_BOTTOM}"></path><path d="M14 26 L11 29 L14.5 30.5"></path>`),
  teshiwa: svg(`<path d="M14 30 C13 19 15 8 22 4 C29 8 31 19 30 30"></path><path d="M14 28 Q22 33 30 28"></path><path d="M16 35 Q22 38 28 35 M17 39 Q22 41.5 27 39"></path>`),
  kansou: svg(`<path d="M22 6 C22 6 12 18 12 26 A10 10 0 0 0 32 26 C32 18 22 6 22 6 Z"></path><path d="M17 27 Q18 31 22 32"></path>`),
  teare: svg(`<path d="${NAIL}"></path><path d="${NAIL_BOTTOM}"></path><path d="M18 14 L22 19 L18 24 L23 30"></path>`),
  fukazume: svg(`<path d="M15 34 C14 24 16 16 22 13 C28 16 30 24 29 34"></path><path d="M16 21 Q19 24 22 20 Q25 24 28 21"></path>`),
  kamizume: svg(`<path d="M14 34 C13 24 14 17 16 14 L19 17 L22 12 L25 17 L28 14 C30 17 31 24 30 34"></path><path d="${NAIL_BOTTOM}"></path>`),
  makizume: svg(`<path d="M14 33 C13 22 15 10 22 6 C29 10 31 22 30 33"></path><path d="M16 30 Q13 33 16 35"></path><path d="M28 30 Q31 33 28 35"></path>`),
};

// ===== お悩みごとの文面(Notionから転記) =====
const WORRIES = [
  {
    slug: 'tatesuji', label: '縦筋',
    seo: '爪の縦筋（縦線）の原因は？目立たなくする毎日のケア',
    paras: [
      '爪に入る縦の筋は、年齢を重ねるとだれにでも出てくるものです。肌にしわができるのと同じで、爪も乾燥すると筋が目立ちやすくなります。',
      '特に、手洗いや水仕事が多い人、除光液をよく使う人は、爪の水分と油分が足りなくなりがち。縦筋そのものより「乾燥して見える」ことが、手元を老けて見せる原因です。',
    ],
    today: [
      '手を洗ったあと、爪の根元にネイルオイルを1滴',
      '筋が気になるときは、目の細かいバッファーで表面を軽くなでる程度に（削りすぎると爪が薄くなるので、月1回まで）',
    ],
    guide: 'ネイルオイル／爪みがき用バッファー（目の細かいもの）／ネイル用美容液',
  },
  {
    slug: 'yokosuji', label: '横筋',
    seo: '爪の横筋（横線）はなぜできる？爪からわかる「あの頃」のサイン',
    paras: [
      '爪に横向きの線やへこみが出たら、それは爪が作られる根元の部分が、一時的にダメージを受けた跡です。',
      'よくあるのは、甘皮を強く押し上げすぎた、指先をぶつけた、体調を崩した、忙しくて食事や睡眠が足りなかった、などの時期。手の爪は1か月に約3ミリ伸びるので、根元から線までの長さで「何か月前のことか」がだいたいわかります。',
      '線は、爪が伸びていくと先のほうへ移動していきます。',
    ],
    today: [
      '甘皮は強く押し上げず、オイルでやわらかくするだけにする',
      '線のあたりは欠けやすいので、ヤスリで先端を整えておく',
    ],
    guide: 'ネイルオイル／甘皮ケア用のやわらかいプッシャー（ゴム・木製）／爪やすり',
  },
  {
    slug: 'namiuchi', label: '波打ち・凸凹',
    seo: '爪が波打つ・凸凹になる原因は？いじり癖と乾燥を見直そう',
    paras: [
      '爪の表面が波のように凸凹しているときは、爪の根元を毎日のように触っていることが多いです。考えごとをしながら親指の甘皮をこする、ささくれをいじる、といった無意識の癖が、作られる途中の爪に跡を残します。',
      'ほかにも、乾燥や、ジェルネイルを落とすときに削りすぎたことでも凸凹は出ます。',
    ],
    today: [
      '爪の根元をいじっていないか、1日だけ意識してみる',
      '触りたくなったら、代わりにハンドクリームを塗る',
    ],
    guide: 'ネイルオイル（ペンタイプだと持ち歩きやすい）／ハンドクリーム／凸凹を整えるベースコート',
  },
  {
    slug: 'soriduma', label: 'そり爪',
    seo: 'そり爪（反り爪）の原因は？爪先が上を向くときの見直しポイント',
    paras: [
      'そり爪は、爪の先がスプーンのように上を向いてしまう状態です。',
      '爪は、指先の皮膚から押し返されることで平らに伸びていきます。深爪で指先のお肉が盛り上がっていたり、爪が薄くやわらかかったりすると、爪が押し上げられて反りやすくなります。鉄分などの栄養が足りないことが関係する場合もあると言われています。',
    ],
    today: [
      '白い部分を1〜2ミリ残して、爪先で指先を守る',
      '爪の裏側（先端の下）にもオイルを塗る',
    ],
    guide: '爪やすり（ガラス製など）／ネイルオイル／ネイル用の補強コート',
  },
  {
    slug: 'nimaizume', label: '二枚爪',
    seo: '二枚爪の原因は乾燥と切り方？爪先がめくれる人の毎日ケア',
    paras: [
      '爪は、薄い層が何枚も重なってできています。その層と層の間がはがれて、先端がめくれた状態が二枚爪です。',
      '原因でよくあるのは、①水仕事などで濡れる・乾くをくり返す、②爪切りで「パチン」と切る衝撃、③爪先で缶やシールを開ける、の3つ。お風呂上がりのやわらかい爪を切るのも、層がずれやすくなります。',
    ],
    today: [
      '長さは爪切りではなくヤスリで整える（一方向に動かす）',
      '爪を整えるのは、爪が乾いているときに',
    ],
    guide: 'ガラス製の爪やすり／ネイルオイル／二枚爪用の補強コート／ゴム手袋',
  },
  {
    slug: 'usui', label: '薄い爪',
    seo: '爪が薄い・すぐ割れる原因は？薄い爪を守る3つの習慣',
    paras: [
      '爪が薄くなる原因は、生まれつきだけではありません。除光液をひんぱんに使う、ジェルネイルを落とすたびに表面を削る、乾燥した状態が続く、といった毎日のことが積み重なって、爪はだんだん薄くなります。',
      '今ある爪を厚くするのは難しくても、これから伸びてくる爪は守れます。',
    ],
    today: [
      '除光液は月2回までにする',
      '爪先で物を開けない（スプーンなど道具を使う）',
      '寝る前にネイルオイル',
    ],
    guide: '爪にやさしい除光液（ノンアセトン）／ネイル用補強コート／ネイルオイル',
  },
  {
    slug: 'sasakure', label: 'ささくれ',
    seo: 'ささくれができる原因は乾燥！むしらずに切るのが正解',
    paras: [
      'ささくれは、爪のまわりの皮膚が乾燥して、めくれてしまった状態です。手洗いや水仕事が多い季節、特に秋から冬に増えます。',
      '気になって指で引っぱると、皮膚が深くまで裂けて、痛みが長引く原因に。ささくれは「むしらずに切る」のが鉄則です。',
    ],
    today: [
      'ささくれは小さなハサミやキューティクルニッパーで、根元から切る',
      '手を洗ったら、爪のまわりまでハンドクリームをなじませる',
    ],
    guide: 'キューティクルニッパー（ささくれ用）／ネイルオイル／ハンドクリーム',
  },
  {
    slug: 'teshiwa', label: '手のしわ',
    seo: '手のしわで老けて見える？原因は乾燥と紫外線',
    paras: [
      '手は、顔より年齢が出やすいと言われる場所です。手の甲の皮膚は薄く、毎日の手洗いで潤いが落ちやすいうえ、顔のように日焼け止めを塗る人が少ないため、乾燥と紫外線の影響を受け続けています。',
      'しわが目立つのは、乾燥で皮膚がしぼんで見えることも大きな理由です。',
    ],
    today: [
      '外に出るときは、手の甲にも日焼け止めを塗る',
      'ハンドクリームは手の甲から塗り、指1本ずつなじませる',
    ],
    guide: '手にも使える日焼け止め／エイジングケア向けハンドクリーム／夜用のハンドマスク・手袋',
  },
  {
    slug: 'kansou', label: '手の乾燥',
    seo: '手の乾燥がひどいときに見直したい、ハンドクリームの塗り方',
    paras: [
      '手のひらは汗をかく場所ですが、皮脂（肌を守る油分）を出す場所がほとんどありません。そのため、手洗いやアルコール消毒のたびに潤いが失われ、カサカサになりやすいのです。',
      '「ハンドクリームを塗っているのに乾燥する」という人は、塗る量とタイミングを見直すと変わることがあります。',
    ],
    today: [
      '手を洗ったら、すぐにやさしく拭いてハンドクリーム',
      '量はパール1粒分。指先と指の間まで塗る',
    ],
    guide: '保湿力の高いハンドクリーム／持ち歩き用の小さいハンドクリーム／手洗い後に使いやすいハンドジェル',
  },
  {
    slug: 'teare', label: '手荒れ',
    seo: '手荒れ・あかぎれがつらい人へ。水仕事の前後でできる手の守り方',
    paras: [
      '手荒れは、乾燥が進んで、肌を守る力が弱くなった状態です。食器洗いのお湯や洗剤、掃除、洗濯など、家事の多い人ほど起こりやすく、ひび割れ（あかぎれ）になると水がしみて毎日つらくなります。',
      '洗剤やお湯は、肌に必要な油分まで落としてしまいます。手を「守る」ことと「潤す」ことの両方が大切です。',
    ],
    today: [
      '洗い物はゴム手袋で。お湯の温度は低めにする',
      '家事のあとは、こまめにハンドクリームを塗り直す',
    ],
    guide: '家事用ゴム手袋（内側が綿のもの）／手荒れ用ハンドクリーム／寝るとき用の保湿手袋',
  },
  {
    slug: 'fukazume', label: '深爪',
    seo: '深爪の原因は切りすぎだけじゃない？ピンクの部分を守る切り方',
    paras: [
      '深爪は、爪を短く切りすぎているだけではありません。爪の下の皮膚がはがれて、爪のピンクの部分が短くなっている状態です。',
      '白い部分を全部切ってしまうと、爪の下の皮膚を守るものがなくなり、ピンクの部分はどんどん短くなっていきます。指先のお肉が盛り上がって見えるのもそのためです。',
      '私自身も、もともとは深爪でした。ケアとジェルで、爪のピンクの部分を伸ばしてきました。',
    ],
    today: [
      '白い部分は1〜2ミリ残す',
      '爪切りではなく、ヤスリで長さを整える',
    ],
    guide: 'ガラス製の爪やすり／ネイルオイル（爪の裏側にも塗れるもの）／爪先を守るベースコート',
  },
  {
    slug: 'kamizume', label: '噛み爪',
    seo: '大人の爪噛みがやめられない人へ。噛み爪を卒業する3ステップ',
    paras: [
      '爪を噛む癖は、退屈なとき、緊張したとき、考えごとをしているときなど、気づかないうちに出ることがほとんど。「やめよう」と思うだけでは、なかなか変わりません。',
      '私も若いころ、爪を噛む癖がやめられませんでした。だからこそ伝えたいのは、意志の強さより「噛みにくい環境」を作るほうが近道だということです。',
    ],
    today: [
      'いつ・どこで噛んでいるか、1週間メモする',
      '爪の角をヤスリで丸くして、引っかかりをなくす',
      '噛みたくなったら、ハンドクリームを塗る',
    ],
    guide: '爪噛み防止のネイルコート（苦味のあるもの）／爪やすり／持ち歩き用ハンドクリーム',
  },
  {
    slug: 'makizume', label: '巻き爪',
    seo: '巻き爪の原因は爪の切り方と靴？痛くなる前に見直したいこと',
    paras: [
      '巻き爪は、足の親指に多く、爪の両端が内側に巻き込んでいく状態です。',
      'よくある原因は、①爪の角を深く切り込む「深爪」、②先の細い靴やきつい靴、③歩くときに指先で地面を踏みしめていないこと。爪は下から押し返されることで平らに保たれるので、指に力がかからない生活が続くと、内側へ巻きやすくなります。',
    ],
    today: [
      '足の爪はまっすぐ切り、角は少しだけ丸める（スクエアオフ）',
      '指先がゆったり動く靴を選ぶ',
    ],
    guide: '足の爪用ニッパー（爪切り）／巻き爪用のケアグッズ／指先がゆったりした靴下・インソール',
  },
];

// トップページの「お悩みから探す」のグループ分け
const GROUPS = [
  ['爪のお悩み', ['tatesuji', 'yokosuji', 'namiuchi', 'soriduma', 'nimaizume', 'usui', 'sasakure', 'fukazume', 'kamizume']],
  ['手のお悩み', ['teshiwa', 'kansou', 'teare']],
  ['足の爪のお悩み', ['makizume']],
];

// ===== 共通パーツ =====
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const bySlug = Object.fromEntries(WORRIES.map((w) => [w.slug, w]));

function metaDesc(w) {
  const sentences = w.paras.join('').split('。').filter(Boolean).map((s) => s + '。');
  let out = '';
  for (const s of sentences) {
    if (out && (out + s).length > 118) break;
    out += s;
    if (out.length >= 70) break;
  }
  return out;
}

function headHtml({ title, desc, url, root, ld, verify }) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${verify ? `<meta name="google-site-verification" content="${GSC_VERIFY}" />\n` : ''}<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="${verify ? 'website' : 'article'}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="ネイルピタ">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}style.css">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>`;
}

function headerHtml(root) {
  const top = root || './';
  return `<header class="site">
  <div class="wrap">
    <a class="logo" href="${top}">
      <span class="logo-main">ネイルピタ</span>
      <span class="logo-sub">40代50代の手元ケア習慣</span>
    </a>
    <nav class="site-nav" aria-label="メニュー">
      <a href="${top}#about">けいについて</a>
      <a href="${top}#worries">お悩みから探す</a>
      <a href="${top}#shokuba">職場でバレたくない</a>
    </nav>
  </div>
</header>`;
}

function footerHtml() {
  return `<footer class="site">
  <div class="wrap">
    <div>
      <p class="brand">ネイルピタ</p>
      <p class="tagline">何歳になっても、指先をあきらめない。</p>
    </div>
    <p class="credit">本ページで紹介する商品はアフィリエイトプログラムを利用して紹介しています。<br>掲載内容は一般的な情報で、診断や治療を目的としたものではありません。<br>&copy; ネイルピタ / けい</p>
  </div>
</footer>`;
}

function roomCtaHtml() {
  return `<section class="room-cta">
  <div class="wrap">
    <div class="room-card">
      <p class="eyebrow">もっとアイテムを見たい方へ</p>
      <p class="desc">大人の爪悩みに寄り添ったアイテムだけを厳選してご紹介している、楽天ROOM「ネイリストのプチプラ手元足元ケア」もやっています。悩み別のコレクションに分けているので、ここで紹介しきれなかったアイテムも、気になるところからのぞいてみてください。</p>
      <a href="${ROOM_URL}" class="room-btn" target="_blank" rel="nofollow sponsored noopener">楽天ROOMを見てみる →</a>
    </div>
  </div>
</section>`;
}

function worryCard(w, root) {
  return `<a class="worry-card" href="${root}${w.slug}/">${ICONS[w.slug]}<span>${esc(w.label)}</span></a>`;
}

// ===== お悩みページ =====
function worryPage(w) {
  const root = '../';
  const url = `${SITE}/${w.slug}/`;
  const title = `${w.seo}｜ネイルピタ`;
  const desc = metaDesc(w);
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: w.seo,
      description: desc,
      inLanguage: 'ja',
      datePublished: UPDATED,
      dateModified: UPDATED,
      image: OG_IMAGE,
      mainEntityOfPage: url,
      author: { '@type': 'Person', name: 'けい' },
      publisher: { '@type': 'Organization', name: 'ネイルピタ' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ネイルピタ', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: w.label, item: url },
      ],
    },
  ];
  const others = WORRIES.filter((x) => x !== w);

  return `${headHtml({ title, desc, url, root, ld, verify: false })}
<body data-root="${root}">

${headerHtml(root)}

<main>
<article class="worry-page">
  <div class="wrap">
    <nav class="crumbs" aria-label="パンくずリスト">
      <a href="${root}">ネイルピタ</a> › <a href="${root}#worries">お悩みから探す</a> › <span>${esc(w.label)}</span>
    </nav>

    <p class="eyebrow">お悩み：${esc(w.label)}</p>
    <h1>${esc(w.seo)}</h1>
    <p class="byline"><img src="${root}assets/founder.jpg" alt="けい" width="32" height="32"><span>書いた人：けい（ネイリスト）｜${UPDATED_JP}更新</span></p>

    <h2>${esc(w.label)}の原因と考え方</h2>
    ${w.paras.map((p) => `<p>${esc(p)}</p>`).join('\n    ')}

    <h2>今日からできること</h2>
    <ul class="today-list">
      ${w.today.map((t) => `<li>${esc(t)}</li>`).join('\n      ')}
    </ul>

    <h2>おすすめアイテム</h2>
    <p class="item-guide">選ぶときの目安：${esc(w.guide)}</p>
    <div class="items" id="items" data-page="${w.slug}"><noscript><p class="price-note">商品の表示にはJavaScriptが必要です。</p></noscript></div>
    <p class="price-note">※価格・送料は掲載時点(2026年9〜10月)のものです。最新の情報は楽天のページでご確認ください。</p>

    <aside class="author-box">
      <img src="${root}assets/founder.jpg" alt="けい" width="64" height="64">
      <div>
        <p class="who">この記事を書いた人：けい</p>
        <p>ネイル歴25年。2008年ネイル検定1級に合格。私自身も、もともとは深爪＆噛み爪でした。<a href="${root}#about">プロフィールを見る</a></p>
      </div>
    </aside>
  </div>
</article>

<section class="other-worries">
  <div class="wrap">
    <h2>ほかのお悩みも見る</h2>
    <div class="worry-grid">
      ${others.map((o) => worryCard(o, root)).join('\n      ')}
    </div>
  </div>
</section>
</main>

${roomCtaHtml()}

${footerHtml()}

<script src="${root}script.js"></script>
</body>
</html>
`;
}

// ===== トップページ =====
function indexPage() {
  const root = '';
  const url = `${SITE}/`;
  const title = 'ネイルピタ | 40代50代の手元ケア習慣';
  const desc = `爪の縦筋・横筋・二枚爪・薄い爪・ささくれ・手のしわ・手荒れ・深爪・噛み爪・巻き爪など、40代50代の爪と手のお悩みを${WORRIES.length}項目に分けて、原因と今日からできるケア、おすすめアイテムをネイリストが紹介します。`;
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ネイルピタ',
      url,
      inLanguage: 'ja',
      description: desc,
    },
  ];
  const oldHashes = ['tatesuji', 'yokosuji', 'soriduma', 'nimaizume', 'sasakure', 'teshiwa', 'fukazume', 'makizume'];

  const groupsHtml = GROUPS.map(
    ([name, slugs]) => `<h3 class="group-title">${esc(name)}</h3>
    <div class="worry-grid">
      ${slugs.map((s) => worryCard(bySlug[s], root)).join('\n      ')}
    </div>`
  ).join('\n    ');

  return `${headHtml({ title, desc, url, root, ld, verify: true }).replace(
    '</head>',
    `<script>
// 以前の「ページ内リンク(#tatesuji など)」で来た人を、お悩みごとのページへ案内します
(function () {
  var ok = ${JSON.stringify(Object.fromEntries(oldHashes.map((h) => [h, 1])))};
  var h = location.hash.replace('#', '');
  if (ok[h]) { location.replace(h + '/'); }
})();
</script>
</head>`
  )}
<body data-root="">

${headerHtml(root)}

<main>
<section class="hero">
  <div class="wrap">
    <h1>40代・50代の爪と手のお悩み、<br class="sp">原因と今日からできるケア</h1>
    <p>縦筋・二枚爪・手荒れ・深爪・巻き爪まで。${WORRIES.length}のお悩みをひとつずつ、ネイリストのけいが解説します。</p>
  </div>
</section>

<section class="about" id="about">
  <div class="wrap">
    <div class="avatar-wrap">
      <img src="assets/founder.jpg" alt="ネイリストのけい" width="200" height="200">
    </div>
    <div class="about-body">
      <p class="eyebrow">はじめまして、けいです</p>

      <p class="lead">はじめまして、けいです。<br>ネイルの仕事を25年続けています💅</p>

      <p>実は私も、若いころは爪を噛む癖がやめられない深爪でした。人に手を見られるのが嫌で、手元に自信が持てなかった時期があります。</p>

      <p>ネイリストになってから、ケアとジェルで少しずつ爪のピンクの部分を伸ばしてきました。お客様に驚かれたことをきっかけに、深爪ケアをメニューにしました。</p>

      <p>高いものを買ったわけでも、特別なことをしたわけでもありません。毎日のくせを知って、続けられるケアを選んだだけです。</p>

      <ul class="worry-list">
        <li>🌿 ネイル歴25年</li>
        <li>🌿 2008年 ネイル検定1級に合格</li>
        <li>🌿 元・深爪＆噛み爪</li>
      </ul>

      <p>このサイトでは、縦筋・二枚爪・薄い爪・ささくれ・手のしわ・手荒れ・深爪・噛み爪・巻き爪など、40代・50代の爪と手のお悩みを、原因と今日からできるケア、続けやすいアイテムといっしょに、ネイリストの目線でお伝えしています。</p>

      <p>爪は1か月に約3ミリ伸びます。今日からの小さなケアが、数か月後の手元をつくります。</p>

      <p>「どれを選べばいい？」と迷ったら、<a href="${INSTAGRAM_URL}" target="_blank" rel="noopener">Instagram</a>のDMで気軽に聞いてくださいね。</p>

      <a href="#worries" class="cta-btn">お悩みから探す</a>
    </div>
  </div>
</section>

<div class="banner">
  <img src="assets/hand-care.jpg" alt="手元をいたわるハンドケアのイメージ">
</div>

<section class="worries-nav" id="worries">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">お悩み</span>
      <h2>あなたの指先・足先、どのお悩みですか？</h2>
    </div>
    ${groupsHtml}
  </div>
</section>

<section class="shokuba" id="shokuba">
  <div class="wrap">
    <div class="shokuba-intro">
      <p class="eyebrow" style="text-align:center;">職場でバレたくない</p>
      <h2 style="margin-bottom:14px;">派手にならず、きちんとケアしている指先へ</h2>
      <p>「規定で派手な色はNG」「でもケアはちゃんとしたい」というお悩みは意外とよく聞きます。色を楽しむというより、爪の表面を整えて清潔感を出す発想に切り替えるのがコツ。ツヤを抑えたマット仕上げや、クリア系のベースコートだけの仕上げなら、派手にならずきちんとケアしている印象を残せます。</p>
      <p>万一バレてもぺろっと剥がせるジェルネイルならチャレンジしやすいです。ベースジェルを塗布後カラージェル・トップジェルを塗るだけでジェルネイルが完成、工程ごとにネイルライトで固めるので乾かす手間もありません。</p>
    </div>
    <div class="items" id="items-shokuba"></div>
    <p class="price-note">※価格・送料は掲載時点(2026年9〜10月)のものです。最新の情報は楽天のページでご確認ください。</p>
  </div>
</section>

<section class="jelly-cta">
  <div class="wrap">
    <div class="jelly-card">
      <p class="eyebrow">もっと本格的に楽しみたい方へ</p>
      <h3>セルフジェルネイルに<br>チャレンジしてみる</h3>
      <p>道具の選び方から、剥がせるジェルの塗り方4ステップ、バレにくい色選びまで。職場でバレずに楽しむセルフジェルネイルの手順を、写真付きでまとめました。</p>
      <a href="https://nailpita.github.io/nailpita/" class="cta-btn">セルフジェルネイルの手順を見る →</a>
    </div>
  </div>
</section>
</main>

${roomCtaHtml()}

${footerHtml()}

<script src="script.js"></script>
</body>
</html>
`;
}

// ===== sitemap.xml =====
function sitemap() {
  const urls = [`${SITE}/`, ...WORRIES.map((w) => `${SITE}/${w.slug}/`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${UPDATED}</lastmod></url>`).join('\n')}
</urlset>
`;
}

// ===== 書き出しと、書き出したあとの自動チェック =====
function write(rel, text) {
  const file = path.join(__dirname, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

const pages = [['index.html', indexPage()], ...WORRIES.map((w) => [`${w.slug}/index.html`, worryPage(w)])];
pages.forEach(([rel, html]) => write(rel, html));
write('sitemap.xml', sitemap());

let problems = 0;
const titles = new Set();
pages.forEach(([rel, html]) => {
  const h1 = (html.match(/<h1[ >]/g) || []).length;
  const title = (html.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="(.*?)">/) || [])[1] || '';
  if (h1 !== 1) { console.error(`NG ${rel}: h1が${h1}個`); problems++; }
  if (/【|】/.test(html)) { console.error(`NG ${rel}: 書き足し用の【 】が残っています`); problems++; }
  if (titles.has(title)) { console.error(`NG ${rel}: titleが重複`); problems++; }
  titles.add(title);
  if (!rel.startsWith('index') && !html.includes(`<link rel="canonical" href="${SITE}/${rel.replace('index.html', '')}">`)) {
    console.error(`NG ${rel}: canonicalが想定と違います`); problems++;
  }
  console.log(`${rel.padEnd(24)} title ${String(title.length).padStart(3)}字 / description ${String(desc.length).padStart(3)}字`);
});
if (problems) { console.error(`\n${problems}件の問題があります`); process.exit(1); }
console.log(`\nOK: ${pages.length}ページ + sitemap.xml を作りました`);
