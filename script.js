const ICONS = {
  tatesuji: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="8" width="16" height="28" rx="6"></rect><path d="M18 12 L18 32 M22 10 L22 34 M26 12 L26 32"></path></svg>`,
  yokosuji: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="8" width="16" height="28" rx="6"></rect><path d="M14 16 L30 16 M14 22 L30 22 M14 28 L30 28"></path></svg>`,
  soriduma: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10 C13 18 13 30 15 36 C19 32 25 32 29 36 C31 30 31 18 29 10"></path></svg>`,
  nimaizume: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10 C13 18 13 28 16 36"></path><path d="M22 8 C20 18 20 30 24 38"></path><path d="M29 10 C31 18 31 28 28 36"></path></svg>`,
  sasakure: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8 v16"></path><path d="M22 24 c-4 2 -6 6 -4 10 c1.5 3 5 3 6 0 c1 3 4.5 3 6 0 c2 -4 0 -8 -4 -10"></path></svg>`,
  teshiwa: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8 C29 18 32 24 32 29 C32 35.5 27.5 39 22 39 C16.5 39 12 35.5 12 29 C12 24 15 18 22 8 Z"></path></svg>`,
  fukazume: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 30 C16 20 18 12 22 8 C26 12 28 20 28 30" ></path><path d="M16 30 a6 6 0 0 0 12 0"></path></svg>`,
  makizume: `<svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8 v14"></path><path d="M14 22 a8 8 0 0 0 16 0"></path><path d="M14 22 c0 6 3 10 3 14"></path><path d="M30 22 c0 6 -3 10 -3 14"></path></svg>`,
};

const MAX_ITEMS_PER_CATEGORY = 3;

const PICKS = {
  tatesuji: [
    {
      name: 'ハンドクリーム ギフト 80g べたつかない 無香料 てんまん エイジングケア ハンドケア 老け手 ヒアルロン酸',
      price: 2500,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/57a4a30f.8ecb2594.57a4a310.dfb2b8af/?me_id=1299286&item_id=10000000&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Ftenman-kosho-yakubo%2Fcabinet%2Ftenman-handcream%2F80g%2Fth003_006.jpg%3F_ex%3D400x400&s=400x400&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/57a4a30f.8ecb2594.57a4a310.dfb2b8af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftenman-kosho-yakubo%2Fbvhs02%2F&link_type=picttext',
    },
    {
      name: '【楽天スーパーセール】ネイルオイル【楽天1位9冠】キューティクルオイル 爪 美容液 植物性 自爪育成 縦線 二枚爪 ハイポニキウム 10ml 育爪 大人の爪オイル',
      price: 3280,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/50d3253b.94448a85.50d3253c.6ab7dffb/?me_id=1426893&item_id=10000000&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fcarnival-mania%2Fcabinet%2Fotonanailoil%2Fimgrc0098820783.jpg%3F_ex%3D240x240&s=240x240&t=picttext',
      url: 'https://hb.afl.rakuten.co.jp/ichiba/50d3253b.94448a85.50d3253c.6ab7dffb/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcarnival-mania%2Fotonaoil%2F&link_type=picttext',
    },
    {
      name: '【OPI公式】ネイルエンビー アセトンフリーリムーバー 2点セット 爪強化コート 補強 二枚爪 薄い爪 自爪ケア ベースコート',
      price: 5693,
      imageUrl: 'https://hbb.afl.rakuten.co.jp/hgb/50b628f4.485
