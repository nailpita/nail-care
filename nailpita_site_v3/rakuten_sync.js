/**
 * ネイルピタ お悩み別ランキングページ 商品データ連携バッチ(楽天版) v3
 *
 * 【v3での変更点】
 * 1. 13個のお悩みカテゴリに対応(縦筋/波打ち・凸凹/そり爪/二枚爪/薄い爪/ささくれ/
 *    深爪/噛み爪/巻き爪/横筋/手のしわ/手の乾燥/手荒れ)
 * 2. 「厳選静的データ」を土台にする方式に変更。
 *    - 事前にリサーチ済みの商品(アフィリエイトリンク確定済み)をCURATED_PRODUCTSに
 *      直接書き込んでおく。これがAPIの調子に関わらず必ず表示される土台。
 *    - 各商品は itemCode(ショップコード:商品コード)を持っているので、楽天APIで
 *      最新の画像・価格・レビューを取得して自動更新する(APIが落ちていても
 *      静的データの値にフォールバックするので安全)。
 *    - さらに各カテゴリにキーワード検索(API)を行い、1カテゴリあたり合計5点に
 *      なるまで商品を追加する(ユーザー希望:「品数は5点ほどが選びやすい」)。
 * 3. APIは完全に残したまま(ユーザー希望:「APIも残してOK」)。
 *
 * 必要なライブラリ: npm install node-fetch@2
 * 出力: products.json (お悩みカテゴリごとに商品リストをまとめたもの)
 */

const fetch = require('node-fetch');
const fs = require('fs');

const OUTPUT_PATH = 'products.json';
const TARGET_COUNT_PER_CATEGORY = 5; // 1カテゴリあたりの商品数(ユーザー希望:5点)

// ここに直接IDを書き込みます(GitHub Secretsの登録は不要)
const APP_ID = "f7caa972-8b81-4802-bf69-685db23b1cc2";
const ACCESS_KEY = "pk_8EFRkS01yZEuhfqqkUk40Q8SwERCt3GksswB1QoBcJd";
const AFFILIATE_ID = "56f04eff.04cce6cb.56f04f00.fedc8c9c";

const API_ENDPOINT = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601';
const REFERER = 'https://nailpita.github.io/nail-care/';

/* =========================================================
   ① 厳選静的データ(リサーチ済み・アフィリエイトリンク確定済み)
   itemCode: "ショップコード:商品コード"(楽天APIで商品を一意に検索するためのキー)
   ここにある商品は、APIが使えなくても必ず表示される安全な土台。
   ========================================================= */
const CURATED_PRODUCTS = {
  sujime: [
    { itemCode: 'prinature:manicure', name: 'prinature 自爪風マニキュア(全7色・10ml)', price: 2290, reviewAverage: 4.75, reviewCount: 626, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f0.51950c59.50b628f1.f3778e6f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fprinature%2Fmanicure%2F', itemUrl: 'https://item.rakuten.co.jp/prinature/manicure/' },
    { itemCode: 'prinature:lcn2set', name: 'LCN ネイルケア2点セット(ダイヤモンドパワーほか)', price: 3560, reviewAverage: 4.59, reviewCount: 267, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f0.51950c59.50b628f1.f3778e6f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fprinature%2Flcn2set%2F', itemUrl: 'https://item.rakuten.co.jp/prinature/lcn2set/' },
    { itemCode: 'ceevs:cvs-no-01', name: 'Ceevs キューティクルオイル(ペンタイプ)', price: 1980, reviewAverage: 4.69, reviewCount: 1423, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f2.892dd749.50b628f3.098179cd/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fceevs%2Fcvs-no-01%2F', itemUrl: 'https://item.rakuten.co.jp/ceevs/cvs-no-01/' },
  ],
  namiuchi: [
    { itemCode: 'shopsachi:001', name: 'La SACHI ガラス爪やすり・爪磨き', price: 899, reviewAverage: 4.53, reviewCount: 1026, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/32061f0e.bf860f62.32061f0f.f9a25f27/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fshopsachi%2F001%2F', itemUrl: 'https://item.rakuten.co.jp/shopsachi/001/' },
    { itemCode: 'ken-inc:vt-ns-01', name: '爪磨き ガラス爪やすり(TVシューイチで紹介)', price: 1280, reviewAverage: 4.63, reviewCount: 864, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/33cc38c2.863fc636.33cc38c3.ee1572a5/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fken-inc%2Fvt-ns-01%2F', itemUrl: 'https://item.rakuten.co.jp/ken-inc/vt-ns-01/' },
    { itemCode: 'shizenshop:glassnail', name: 'ウルンラップ ガラス製爪磨き 2本セット', price: 2100, reviewAverage: 4.57, reviewCount: 847, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/3206ab1d.d183ff89.3206ab1e.1bdf8ee8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fshizenshop%2Fglassnail%2F', itemUrl: 'https://item.rakuten.co.jp/shizenshop/glassnail/' },
  ],
  soriume: [
    { itemCode: 'opiofficialshop:1008051', name: 'OPI ネイルエンビー 爪強化コート 大容量15mL', price: 4290, reviewAverage: 4.33, reviewCount: 1220, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f4.485d6265.50b628f5.e82957f4/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fopiofficialshop%2F1008051%2F', itemUrl: 'https://item.rakuten.co.jp/opiofficialshop/1008051/' },
    { itemCode: 'mikagami:10000029', name: 'ネイルハードナー 爪補強コート(楽天1位&3冠)', price: 1280, reviewAverage: 4.4, reviewCount: 460, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/3206a915.c75d1475.3206a916.62e9f7af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmikagami%2F10000029%2F', itemUrl: 'https://item.rakuten.co.jp/mikagami/10000029/' },
    { itemCode: 'prinature:nailcareserum', name: 'ネイルケアセラム 爪美容液(医薬部外品)', price: 2990, reviewAverage: 4.62, reviewCount: 610, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f0.51950c59.50b628f1.f3778e6f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fprinature%2Fnailcareserum%2F', itemUrl: 'https://item.rakuten.co.jp/prinature/nailcareserum/' },
  ],
  nimaizume: [
    { itemCode: 'shizenshop:nailserum', name: 'ウルンラップ ネイルオイル 爪美容液(シアバター配合)', price: 1700, reviewAverage: 4.5, reviewCount: 2073, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/3206ab1d.d183ff89.3206ab1e.1bdf8ee8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fshizenshop%2Fnailserum%2F', itemUrl: 'https://item.rakuten.co.jp/shizenshop/nailserum/' },
    { itemCode: 'prinature:nailcareoil', name: 'ネイルケア専門店 ネイルオイル(植物油のみ・無香料)', price: 3970, reviewAverage: 4.69, reviewCount: 1347, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f0.51950c59.50b628f1.f3778e6f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fprinature%2Fnailcareoil%2F', itemUrl: 'https://item.rakuten.co.jp/prinature/nailcareoil/' },
    { itemCode: 'prinature:basecoat', name: 'ベースコート ネイルハードナー(割れやすい爪に)', price: 2290, reviewAverage: 4.66, reviewCount: 112, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f0.51950c59.50b628f1.f3778e6f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fprinature%2Fbasecoat%2F', itemUrl: 'https://item.rakuten.co.jp/prinature/basecoat/' },
  ],
  usuizume: [
    { itemCode: 'virginbeautyshop:nr-og-004-no', name: 'ネイルオイル 爪美容液 10ml(ペン)', price: 1480, reviewAverage: 4.55, reviewCount: 1225, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/4c881b38.f58d47a4.4c881b39.ce0014a0/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fvirginbeautyshop%2Fnr-og-004-no%2F', itemUrl: 'https://item.rakuten.co.jp/virginbeautyshop/nr-og-004-no/' },
    { itemCode: 'takeuchi-labo:pf-01', name: 'ネイルオイル 金木犀 10ml', price: 1100, reviewAverage: 4.45, reviewCount: 626, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/58f3580c.7d76e3b1.58f3580d.e0991577/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftakeuchi-labo%2Fpf-01%2F', itemUrl: 'https://item.rakuten.co.jp/takeuchi-labo/pf-01/' },
    { itemCode: 'carnival-mania:otonaoil', name: '大人の爪育成 ネイルオイル(楽天1位9冠)', price: 3280, reviewAverage: 4.52, reviewCount: 236, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50d3253b.94448a85.50d3253c.6ab7dffb/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcarnival-mania%2Fotonaoil%2F', itemUrl: 'https://item.rakuten.co.jp/carnival-mania/otonaoil/' },
  ],
  sasakure: [
    { itemCode: 'tcconlineshop:atyc_008', name: 'ネイリスト監修 キューティクルニッパー&プッシャー', price: 1480, reviewAverage: 4.76, reviewCount: 1181, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/2c6e94f1.a24b8d1f.2c6e94f2.2f9d021e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftcconlineshop%2Fatyc_008%2F', itemUrl: 'https://item.rakuten.co.jp/tcconlineshop/atyc_008/' },
    { itemCode: 'mikagami:10000007', name: '中目黒ネイルサロンオーナー監修 ネイルオイル', price: 1100, reviewAverage: 4.68, reviewCount: 2961, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/3206a915.c75d1475.3206a916.62e9f7af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmikagami%2F10000007%2F', itemUrl: 'https://item.rakuten.co.jp/mikagami/10000007/' },
    { itemCode: 'eternalwind:a8000-1', name: 'ネイルオイル ペンタイプ 1本', price: 599, reviewAverage: 4.45, reviewCount: 703, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/2c68a27c.dc219f51.2c68a27d.2519665a/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Feternalwind%2Fa8000-1%2F', itemUrl: 'https://item.rakuten.co.jp/eternalwind/a8000-1/' },
  ],
  fukazume: [
    { itemCode: 'brain-service:compass1732250475', name: 'Grown Care キューティクルケアオイル 10ml', price: 2380, reviewAverage: 4.77, reviewCount: 675, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50b6230d.bf086344.50b6230e.c3876def/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbrain-service%2Fcompass1732250475%2F', itemUrl: 'https://item.rakuten.co.jp/brain-service/compass1732250475/' },
    { itemCode: 'inter-c:andnailn-nbo', name: 'アンドネイル ネイルベッドオイル 10ml(爪先オイル)', price: 1760, reviewAverage: 4.62, reviewCount: 318, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/5889ce4b.6059f32e.5889ce4c.9570e9c5/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Finter-c%2Fandnailn-nbo%2F', itemUrl: 'https://item.rakuten.co.jp/inter-c/andnailn-nbo/' },
    { itemCode: 'mikagami:10000000', name: '巻き爪用 爪切りニッパー(楽天1位)', price: 1690, reviewAverage: 4.53, reviewCount: 1428, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/3206a915.c75d1475.3206a916.62e9f7af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmikagami%2F10000000%2F', itemUrl: 'https://item.rakuten.co.jp/mikagami/10000000/' },
  ],
  kamizume: [
    { itemCode: 'value-create:tumekami', name: 'ヌルエール 爪噛み防止マニキュア(爪噛み専門家監修)', price: 1280, reviewAverage: 4.31, reviewCount: 1633, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/58f3587b.1f3d1f11.58f3587c.96f1510e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fvalue-create%2Ftumekami%2F', itemUrl: 'https://item.rakuten.co.jp/value-create/tumekami/' },
    { itemCode: 'oval:kamupita_adult', name: 'かむピタアルファ 大人の爪噛み防止マニキュア', price: 1998, reviewAverage: 4.53, reviewCount: 103, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/58f35897.5d063e8c.58f35898.737efc39/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Foval%2Fkamupita_adult%2F', itemUrl: 'https://item.rakuten.co.jp/oval/kamupita_adult/' },
    { itemCode: 'alamode:0451-0910', name: '爪噛み防止マニキュア 日本製 無添加', price: 1580, reviewAverage: 4.31, reviewCount: 127, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/2d383324.13b91a01.2d383325.2a160a91/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Falamode%2F0451-0910%2F', itemUrl: 'https://item.rakuten.co.jp/alamode/0451-0910/' },
  ],
  makizume: [
    { itemCode: 'mikagami:10000000', name: '巻き爪用 爪切りニッパー(楽天1位)', price: 1690, reviewAverage: 4.53, reviewCount: 1428, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/3206a915.c75d1475.3206a916.62e9f7af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmikagami%2F10000000%2F', itemUrl: 'https://item.rakuten.co.jp/mikagami/10000000/' },
    { itemCode: 'himawari-corp:nailaid16', name: 'ネイル・エイド 16mm(巻き爪クリップ)', price: 5480, reviewAverage: 4.57, reviewCount: 1251, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/58ccc451.4868efa9.58ccc454.08709eba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhimawari-corp%2Fnailaid16%2F', itemUrl: 'https://item.rakuten.co.jp/himawari-corp/nailaid16/' },
    { itemCode: 'pegasus-store:makidume_care', name: '巻き爪 爪やすり・爪垢取り', price: 998, reviewAverage: 4.72, reviewCount: 306, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/58875fe6.4be15398.58875fed.c9842976/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpegasus-store%2Fmakidume_care%2F', itemUrl: 'https://item.rakuten.co.jp/pegasus-store/makidume_care/' },
  ],
  yokosuji: [
    { itemCode: 'fitone:borageseed', name: 'otona nail ボラージシードネイルオイル', price: 1000, reviewAverage: 4.58, reviewCount: 658, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/3254aeb5.39a589ad.3254aeb6.d2cab7c4/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffitone%2Fborageseed%2F', itemUrl: 'https://item.rakuten.co.jp/fitone/borageseed/' },
    { itemCode: 'colorful-nail:t-0217all', name: 'ネイルオイル ペンタイプ 10本セット', price: 1590, reviewAverage: 4.36, reviewCount: 375, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/2c68a26e.22675ae7.2c68a26f.4232c33a/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcolorful-nail%2Ft-0217all%2F', itemUrl: 'https://item.rakuten.co.jp/colorful-nail/t-0217all/' },
    { itemCode: 'prinature:ikusei_set', name: '爪のネイルケアセットA(オイル・医薬部外品セラムほか)', price: 6490, reviewAverage: 4.74, reviewCount: 314, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/50b628f0.51950c59.50b628f1.f3778e6f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fprinature%2Fikusei_set%2F', itemUrl: 'https://item.rakuten.co.jp/prinature/ikusei_set/' },
  ],
  teshiwa: [
    { itemCode: 'fanfareshop:srj01_y', name: 'Sirojam ハンドクリーム(シワ・シミ)', price: 5260, reviewAverage: 4.34, reviewCount: 1251, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/57aa766b.f57f3f66.57aa766c.599fa956/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffanfareshop%2Fsrj01_y%2F', itemUrl: 'https://item.rakuten.co.jp/fanfareshop/srj01_y/' },
    { itemCode: 'fancl-shop:3093-22', name: 'ファンケル ハンドクリーム ブライトニング&エイジングケア(医薬部外品)', price: 1100, reviewAverage: 4.71, reviewCount: 875, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/57a4a07b.ffa48a97.57a4a07c.ab850dd9/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffancl-shop%2F3093-22%2F', itemUrl: 'https://item.rakuten.co.jp/fancl-shop/3093-22/' },
    { itemCode: 'kewpie-blueflag:52439', name: 'キユートピア ハンデコルテ 35g', price: 3850, reviewAverage: 4.4, reviewCount: 962, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/57aa7670.db93b977.57aa7677.a3120e1f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkewpie-blueflag%2F52439%2F', itemUrl: 'https://item.rakuten.co.jp/kewpie-blueflag/52439/' },
  ],
  tekansou: [
    { itemCode: 'adpentel:591634', name: '天然保湿 尿素クリーム(顔・手・体)', price: 3980, reviewAverage: 4.78, reviewCount: 2147, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/58f35929.593a10a1.58f3592a.b5bc4aee/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fadpentel%2F591634%2F', itemUrl: 'https://item.rakuten.co.jp/adpentel/591634/' },
    { itemCode: 'murasakikoubou:10000007', name: '桜膏 保湿クリーム(無添加)', price: 1100, reviewAverage: 4.63, reviewCount: 1077, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/58f35936.b46c9fe4.58f35937.42a313c3/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmurasakikoubou%2F10000007%2F', itemUrl: 'https://item.rakuten.co.jp/murasakikoubou/10000007/' },
    { itemCode: 'yuukiseiyaku:4524326500007-m2c4', name: 'しあわせバーユ 純国産馬油100', price: 1980, reviewAverage: 4.67, reviewCount: 823, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/58f3595a.d776663b.58f3595b.4ac106bc/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fyuukiseiyaku%2F4524326500007-m2c4%2F', itemUrl: 'https://item.rakuten.co.jp/yuukiseiyaku/4524326500007-m2c4/' },
  ],
  tegare: [
    { itemCode: 'tenman-kosho-yakubo:bvhs02', name: 'てんまん ハンドクリーム 80g(無香料・無添加)', price: 2500, reviewAverage: 4.61, reviewCount: 1981, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/57a4a30f.8ecb2594.57a4a310.dfb2b8af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftenman-kosho-yakubo%2Fbvhs02%2F', itemUrl: 'https://item.rakuten.co.jp/tenman-kosho-yakubo/bvhs02/' },
    { itemCode: 'import-garden:nalc-handcream', name: 'NALC 薬用ハンドクリーム', price: 2017, reviewAverage: 4.65, reviewCount: 1016, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/58f359ca.6c38cb87.58f359cb.da831ca9/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fimport-garden%2Fnalc-handcream%2F', itemUrl: 'https://item.rakuten.co.jp/import-garden/nalc-handcream/' },
    { itemCode: 'milasic:1899', name: '日本製 おやすみ手袋(スマホ対応)', price: 1580, reviewAverage: 4.3, reviewCount: 1261, affiliateUrl: 'https://hb.afl.rakuten.co.jp/ichiba/583520a5.75cc04fe.583520b1.4844a798/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmilasic%2F1899%2F', itemUrl: 'https://item.rakuten.co.jp/milasic/1899/' },
  ],
};

/* =========================================================
   ② お悩みカテゴリ一覧(表示ラベル + 不足分を埋めるAPI検索キーワード)
   ========================================================= */
const WORRY_CATEGORIES = [
  { id: 'sujime', label: '爪の縦すじ・凸凹', keyword: 'ネイルケア 美容液' },
  { id: 'namiuchi', label: '爪の波打ち・凸凹', keyword: 'ガラス爪やすり' },
  { id: 'soriume', label: 'そり爪・弱い爪', keyword: 'ネイルハードナー' },
  { id: 'nimaizume', label: '二枚爪', keyword: 'ネイルオイル' },
  { id: 'usuizume', label: '爪が薄い', keyword: 'ネイルオイル 爪育成' },
  { id: 'sasakure', label: '甘皮のささくれ', keyword: 'キューティクルオイル' },
  { id: 'fukazume', label: '深爪', keyword: 'ネイルベッドオイル' },
  { id: 'kamizume', label: '噛み爪', keyword: '爪噛み防止 マニキュア' },
  { id: 'makizume', label: '巻き爪', keyword: '巻き爪 ケア' },
  { id: 'yokosuji', label: '爪の横筋', keyword: 'ネイルオイル' },
  { id: 'teshiwa', label: '手のしわ', keyword: 'ハンドクリーム エイジングケア' },
  { id: 'tekansou', label: '手の乾燥', keyword: 'ハンドクリーム 保湿' },
  { id: 'tegare', label: '手荒れ', keyword: '薬用ハンドクリーム' },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ---------- itemCodeを指定して1商品の最新情報を取得 ---------- */
async function fetchByItemCode(itemCode) {
  const url = new URL(API_ENDPOINT);
  url.searchParams.set('applicationId', APP_ID);
  url.searchParams.set('accessKey', ACCESS_KEY);
  url.searchParams.set('affiliateId', AFFILIATE_ID);
  url.searchParams.set('itemCode', itemCode);
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString(), { headers: { Referer: REFERER } });
  const data = await res.json();
  if (data.errors) {
    throw new Error(JSON.stringify(data.errors));
  }
  const item = data.Items && data.Items[0] && data.Items[0].Item;
  if (!item) return null;
  return {
    name: item.itemName,
    price: item.itemPrice,
    imageUrl: (item.mediumImageUrls && item.mediumImageUrls[0] && item.mediumImageUrls[0].imageUrl) || '',
    url: item.affiliateUrl || item.itemUrl,
    reviewAverage: item.reviewAverage,
    reviewCount: item.reviewCount,
  };
}

/* ---------- キーワードで商品を検索(不足分の補充用) ---------- */
async function fetchByKeyword(keyword, hits) {
  const url = new URL(API_ENDPOINT);
  url.searchParams.set('applicationId', APP_ID);
  url.searchParams.set('accessKey', ACCESS_KEY);
  url.searchParams.set('affiliateId', AFFILIATE_ID);
  url.searchParams.set('keyword', keyword);
  url.searchParams.set('hits', String(hits));
  url.searchParams.set('sort', '-reviewCount');
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString(), { headers: { Referer: REFERER } });
  const data = await res.json();
  if (data.errors) {
    throw new Error(JSON.stringify(data.errors));
  }
  return (data.Items || []).map(({ Item }) => ({
    name: Item.itemName,
    price: Item.itemPrice,
    imageUrl: (Item.mediumImageUrls && Item.mediumImageUrls[0] && Item.mediumImageUrls[0].imageUrl) || '',
    url: Item.affiliateUrl || Item.itemUrl,
    reviewAverage: Item.reviewAverage,
    reviewCount: Item.reviewCount,
  }));
}

/* ---------- 静的データ(フォールバック)をカード表示用の形式に変換 ---------- */
function curatedAsFallback(curated) {
  return {
    name: curated.name,
    price: curated.price,
    imageUrl: '', // APIが使えない場合は画像なし(カード側でプレースホルダー表示)
    url: curated.affiliateUrl,
    reviewAverage: curated.reviewAverage,
    reviewCount: curated.reviewCount,
  };
}

/* ---------- 実行本体 ---------- */
async function runBatch() {
  const categories = {};

  for (const category of WORRY_CATEGORIES) {
    console.log(`--- 「${category.label}」を処理中 ---`);
    const curatedList = CURATED_PRODUCTS[category.id] || [];
    const items = [];
    const usedUrls = new Set();

    // ① 静的データの商品をAPIで最新化(失敗したら静的データのままフォールバック)
    for (const curated of curatedList) {
      let item;
      try {
        const fresh = await fetchByItemCode(curated.itemCode);
        item = fresh || curatedAsFallback(curated);
        if (fresh) console.log(`  ✓ ${curated.itemCode} → API最新データ取得`);
      } catch (err) {
        console.error(`  ⚠ ${curated.itemCode} のAPI取得失敗(静的データで表示します): ${err.message}`);
        item = curatedAsFallback(curated);
      }
      // 静的データのアフィリエイトリンクを優先(確定済みのリンクを壊さないため)
      item.url = curated.affiliateUrl;
      items.push(item);
      usedUrls.add(curated.itemUrl);
      await sleep(250); // APIレート制限対策
    }

    // ② 5点に満たない分をキーワード検索で補充
    if (items.length < TARGET_COUNT_PER_CATEGORY) {
      const need = TARGET_COUNT_PER_CATEGORY - items.length;
      try {
        const extra = await fetchByKeyword(category.keyword, need + 3); // 重複除外の余裕を持って多めに取得
        for (const ex of extra) {
          if (items.length >= TARGET_COUNT_PER_CATEGORY) break;
          if (usedUrls.has(ex.url)) continue;
          items.push(ex);
          usedUrls.add(ex.url);
        }
        console.log(`  → キーワード検索で${items.length - curatedList.length}件追加(合計${items.length}件)`);
      } catch (err) {
        console.error(`  ⚠ キーワード検索失敗(${category.keyword}): ${err.message}`);
      }
      await sleep(250);
    }

    categories[category.id] = items;
  }

  const output = {
    updatedAt: new Date().toISOString(),
    categories,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`完了: ${OUTPUT_PATH} を更新しました`);
}

runBatch();
