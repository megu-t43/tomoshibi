// メニューデータ自動生成

// 全メニューリスト（見出し行を除外済み）
const rawMenuList = {
  food: [
    // 看板・揚げ物系
    { name: 'ともしびチキン', category: '揚げもの' },
    { name: '鮭ときのこのバターホイル焼き', category: '海鮮' },
    { name: 'ハタハタと舞茸の天ぷら', category: '揚げもの' },
    { name: '砂ずりときのこのガリバタ炒め', category: '肉料理' },
    { name: 'ともチキver.2 スパイス', category: '揚げもの' },
    { name: 'ともチキver.3 旨タレ', category: '揚げもの' },
    
    // 海鮮
    { name: '屋台のイカ焼き', category: '海鮮' },
    { name: 'ししゃも炙り', category: '海鮮' },
    { name: '肉厚縞ホッケ半身', category: '海鮮' },
    { name: 'トロたく', category: '海鮮' },
    { name: '大盛りあさりのバター酒蒸し', category: '海鮮' },
    { name: '海老豚大葉巻き', category: '海鮮' },
    { name: '海鮮ユッケ', category: '海鮮' },
    { name: '青唐のピリ辛なめろう', category: '海鮮' },
    
    // 揚げもの
    { name: '若鶏の唐揚げ', category: '揚げもの' },
    { name: '里芋の唐揚げ', category: '揚げもの' },
    { name: 'カリカリチーズスティック', category: '揚げもの' },
    { name: 'アジフライタルタルソース', category: '揚げもの' },
    { name: 'とり天', category: '揚げもの' },
    { name: 'ちくわの磯辺揚げ', category: '揚げもの' },
    { name: 'スパイシーポテト', category: '揚げもの' },
    { name: 'フライドポテト', category: '揚げもの' },
    { name: 'たっぷり九条ネギの厚揚げ', category: '揚げもの' },
    { name: 'イカの唐揚げ', category: '揚げもの' },
    { name: 'あさりの唐揚げ', category: '揚げもの' },
    { name: '厚切りハムカツのタルタル', category: '揚げもの' },
    
    // 一品・冷菜
    { name: '枝豆', category: '一品' },
    { name: '冷奴', category: '一品' },
    { name: 'タタキキュウリ', category: '一品' },
    { name: 'たこわさ', category: '一品' },
    { name: '梅水晶', category: '一品' },
    { name: 'チャンジャ', category: '一品' },
    { name: '豆もやしナムル', category: '一品' },
    { name: 'ピリ辛おつまみメンマ', category: '一品' },
    { name: '鶏のあたりめ', category: '一品' },
    
    // 肉料理
    { name: '肉肉プレート', category: '肉料理' },
    { name: '牛肩ロースたたき', category: '肉料理' },
    { name: '赤身馬刺し', category: '肉料理' },
    { name: 'せせり網焼き 塩ダレ', category: '肉料理' },
    { name: 'せせり網焼き ポン酢', category: '肉料理' },
    { name: 'タン炭火焼き おすすめ', category: '肉料理' },
    { name: '牛スジ煮込み', category: '肉料理' },
    { name: 'つくね炭火焼き おすすめ', category: '肉料理' },
    { name: 'タルタルチキン南蛮', category: '肉料理' },
    
    // 鍋・追加
    { name: '白もつ鍋', category: '鍋・追加' },
    { name: '追加 もつ', category: '鍋・追加' },
    { name: '追加 野菜', category: '鍋・追加' },
    { name: '追加 麺', category: '鍋・追加' },
    { name: '追加 雑炊', category: '鍋・追加' },
    
    // いろいろ
    { name: '海鮮チヂミ', category: '一品' },
    { name: 'エイヒレ炙り', category: '一品' },
    { name: '明太しらすと大葉バケット焼き', category: '一品' },
    { name: 'ピリ辛よだれ鶏', category: '肉料理' },
    { name: '京風だし巻き卵', category: '一品' },
    
    // 野菜
    { name: '自家製ポテトサラダ', category: '野菜' },
    { name: 'きゅうり一本漬け', category: '野菜' },
    { name: 'ともしびサラダ', category: '野菜' },
    { name: '塩だれキャベツ', category: '野菜' },
    { name: '焼き万願寺唐辛子', category: '野菜' },
    
    // 〆もの
    { name: 'デカ盛！焼きそば', category: '〆もの' },
    { name: 'デカ盛！焼きそば ハーフ', category: '〆もの' },
    { name: '濃厚白湯ともしびラーメン', category: '〆もの' },
    { name: 'お茶漬け 明太子', category: '〆もの' },
    { name: 'お茶漬け 鮭', category: '〆もの' },
    { name: 'お茶漬け しらす', category: '〆もの' },
    { name: 'お茶漬け 梅', category: '〆もの' },
    { name: 'おにぎり兄弟 明太子', category: '〆もの' },
    { name: 'おにぎり兄弟 鮭・しらす', category: '〆もの' },
    { name: 'おにぎり兄弟 梅', category: '〆もの' },
    { name: 'ミニ釜揚げしらす丼', category: '〆もの' },
    { name: '海鮮ユッケ丼', category: '〆もの' },
    
    // デザート
    { name: 'さつまいもチップスとアイス', category: 'デザート' },
    { name: '黒蜜きなこアイス', category: 'デザート' },
    { name: 'バニラアイス', category: 'デザート' },
  ],
  drink: [
    // ビール
    { name: 'サントリー生ビール 大瓶', category: 'ビール' },
    { name: 'サッポロ赤星', category: 'ビール' },
    { name: 'アサヒスーパードライ', category: 'ビール' },
    { name: 'ビアカクテル シャンディガフ', category: 'ビール' },
    { name: 'ビアカクテル レッドアイ', category: 'ビール' },
    
    // サワー＆チューハイ
    { name: 'こだわり酒場のレモンサワー', category: 'サワー' },
    { name: 'こだわり酒場のタコハイ', category: 'サワー' },
    { name: 'トマトサワー', category: 'サワー' },
    { name: '赤ブドウサワー', category: 'サワー' },
    { name: 'カルピスサワー', category: 'サワー' },
    { name: 'ライムサワー', category: 'サワー' },
    { name: '柚子はちみつサワー', category: 'サワー' },
    { name: 'メガレモンサワー', category: 'サワー' },
    { name: 'メガトマトサワー', category: 'サワー' },
    { name: 'メガカルピスサワー', category: 'サワー' },
    
    // 特製果実サワー
    { name: '特製果実サワー 桃', category: 'サワー' },
    { name: '特製果実サワー みかん', category: 'サワー' },
    { name: '特製果実サワー パイン', category: 'サワー' },
    
    // ハイボール・ウイスキー
    { name: '梅ハイボール', category: 'ハイボール' },
    { name: '角ハイボール', category: 'ハイボール' },
    { name: 'コーラハイボール', category: 'ハイボール' },
    { name: 'ジンジャーハイボール', category: 'ハイボール' },
    { name: 'トマトハイボール', category: 'ハイボール' },
    { name: '碧 Ao ハイボール', category: 'ハイボール' },
    { name: '碧 Ao 水割', category: 'ウイスキー' },
    { name: '碧 Ao ロック', category: 'ウイスキー' },
    
    // 果実酒
    { name: '南高梅酒', category: '果実酒' },
    { name: 'あらごしみかん', category: '果実酒' },
    { name: 'ゆず酒', category: '果実酒' },
    
    // 焼酎
    { name: '大隅', category: '焼酎' },
    { name: '二階堂', category: '焼酎' },
    { name: 'いいちこ', category: '焼酎' },
    { name: '大隅 黒霧島', category: '焼酎' },
    { name: '富乃宝山', category: '焼酎' },
    { name: '焼酎［ジャスミン］ 茉莉花', category: '焼酎' },
    { name: '焼酎 ハーフボトル', category: '焼酎' },
    { name: 'ボトルセット ウーロン・緑茶割セット', category: '焼酎' },
    { name: 'ボトルセット レモン', category: '焼酎' },
    
    // 日本酒
    { name: '菊正宗 燗', category: '日本酒' },
    { name: '菊正宗 冷', category: '日本酒' },
    { name: '純米吟醸 龍力 一合', category: '日本酒' },
    { name: '安芸虎 一合', category: '日本酒' },
    { name: '菊正宗 一合', category: '日本酒' },
    { name: '純米吟醸 ゆきつばき 一合', category: '日本酒' },
    { name: '純米吟醸 日本刀（かたな） 一合', category: '日本酒' },
    
    // ワイン
    { name: 'ワイン グラス 赤', category: 'ワイン' },
    { name: 'ワイン グラス 白', category: 'ワイン' },
    { name: 'ワイン ボトル 赤', category: 'ワイン' },
    { name: 'ワイン ボトル 白', category: 'ワイン' },
    
    // カクテル
    { name: 'カシスオレンジ', category: 'カクテル' },
    { name: 'カシスウーロン', category: 'カクテル' },
    { name: 'ピーチオレンジ', category: 'カクテル' },
    { name: 'ピーチウーロン', category: 'カクテル' },
    
    // チャミスル
    { name: 'チャミスル マスカット', category: 'チャミスル' },
    { name: 'チャミスル グレープフルーツ', category: 'チャミスル' },
    { name: 'チャミスル すもも', category: 'チャミスル' },
    
    // ジン・ショット
    { name: 'ジャパニーズジン 翠ジンソーダ', category: 'ジン' },
    { name: 'ショット テキーラ', category: 'ショット' },
    { name: 'ショット 翠', category: 'ショット' },
    
    // ノンアルコール
    { name: 'オールフリー', category: 'ノンアル' },
    { name: 'ノンアルコールビールテイスト飲料', category: 'ノンアル' },
    
    // ソフトドリンク
    { name: 'ウーロン茶', category: 'ソフトドリンク' },
    { name: '緑茶', category: 'ソフトドリンク' },
    { name: 'ジンジャーエール', category: 'ソフトドリンク' },
    { name: 'オレンジジュース', category: 'ソフトドリンク' },
    { name: 'コカ･コーラ', category: 'ソフトドリンク' },
    { name: 'ラムネ', category: 'ソフトドリンク' },
    { name: 'カルピス', category: 'ソフトドリンク' },
  ]
};

// カテゴリ別価格帯・原価率設定
const categoryConfig = {
  '揚げもの': { priceMin: 480, priceMax: 780, costRateMin: 0.28, costRateMax: 0.33 },
  '海鮮': { priceMin: 680, priceMax: 1200, costRateMin: 0.38, costRateMax: 0.45 },
  '肉料理': { priceMin: 780, priceMax: 1280, costRateMin: 0.38, costRateMax: 0.42 },
  '鍋・追加': { priceMin: 380, priceMax: 1680, costRateMin: 0.35, costRateMax: 0.40 },
  '〆もの': { priceMin: 580, priceMax: 1080, costRateMin: 0.30, costRateMax: 0.35 },
  '一品': { priceMin: 380, priceMax: 780, costRateMin: 0.30, costRateMax: 0.35 },
  '野菜': { priceMin: 380, priceMax: 680, costRateMin: 0.30, costRateMax: 0.35 },
  'デザート': { priceMin: 300, priceMax: 580, costRateMin: 0.25, costRateMax: 0.30 },
  'ビール': { priceMin: 550, priceMax: 780, costRateMin: 0.28, costRateMax: 0.33 },
  'サワー': { priceMin: 500, priceMax: 700, costRateMin: 0.25, costRateMax: 0.32 },
  'ハイボール': { priceMin: 500, priceMax: 700, costRateMin: 0.25, costRateMax: 0.32 },
  'ウイスキー': { priceMin: 600, priceMax: 800, costRateMin: 0.30, costRateMax: 0.38 },
  '果実酒': { priceMin: 550, priceMax: 750, costRateMin: 0.30, costRateMax: 0.38 },
  '焼酎': { priceMin: 550, priceMax: 750, costRateMin: 0.30, costRateMax: 0.40 },
  '日本酒': { priceMin: 700, priceMax: 980, costRateMin: 0.35, costRateMax: 0.45 },
  'ワイン': { priceMin: 600, priceMax: 800, costRateMin: 0.30, costRateMax: 0.40 },
  'カクテル': { priceMin: 550, priceMax: 750, costRateMin: 0.25, costRateMax: 0.32 },
  'チャミスル': { priceMin: 700, priceMax: 900, costRateMin: 0.30, costRateMax: 0.40 },
  'ジン': { priceMin: 600, priceMax: 900, costRateMin: 0.25, costRateMax: 0.35 },
  'ショット': { priceMin: 600, priceMax: 900, costRateMin: 0.25, costRateMax: 0.35 },
  'ノンアル': { priceMin: 300, priceMax: 500, costRateMin: 0.20, costRateMax: 0.30 },
  'ソフトドリンク': { priceMin: 300, priceMax: 500, costRateMin: 0.20, costRateMax: 0.30 },
};

// ランダム値生成（シード付き）
let seed = 12345;
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// 10円単位に丸める
function roundTo10(num) {
  return Math.round(num / 10) * 10;
}

// メニューデータ生成
export function generateMenuData() {
  const menuData = [];
  let idCounter = 1;

  // フードメニュー生成
  rawMenuList.food.forEach(item => {
    const config = categoryConfig[item.category];
    const priceRange = config.priceMax - config.priceMin;
    const price = roundTo10(config.priceMin + seededRandom() * priceRange);
    
    const costRateRange = config.costRateMax - config.costRateMin;
    const costRate = config.costRateMin + seededRandom() * costRateRange;
    const cost = Math.round(price * costRate);
    
    const stock = Math.floor(5 + seededRandom() * 36); // 5-40
    const reorderLevel = Math.floor(3 + seededRandom() * 6); // 3-8

    menuData.push({
      id: idCounter++,
      name: item.name,
      category: item.category,
      type: 'food',
      price,
      cost,
      stock,
      reorderLevel,
      costRate: Math.round(costRate * 100)
    });
  });

  // ドリンクメニュー生成
  rawMenuList.drink.forEach(item => {
    const config = categoryConfig[item.category];
    const priceRange = config.priceMax - config.priceMin;
    const price = roundTo10(config.priceMin + seededRandom() * priceRange);
    
    const costRateRange = config.costRateMax - config.costRateMin;
    const costRate = config.costRateMin + seededRandom() * costRateRange;
    const cost = Math.round(price * costRate);
    
    const stock = Math.floor(5 + seededRandom() * 36); // 5-40
    const reorderLevel = Math.floor(3 + seededRandom() * 6); // 3-8

    menuData.push({
      id: idCounter++,
      name: item.name,
      category: item.category,
      type: 'drink',
      price,
      cost,
      stock,
      reorderLevel,
      costRate: Math.round(costRate * 100)
    });
  });

  return menuData;
}

// 売上ダミーデータ生成
export function generateSalesData(menuData) {
  const salesData = menuData.map(menu => {
    // 当日販売数（0-20の範囲）
    const qtyToday = Math.floor(seededRandom() * 21);
    
    // 週間販売数（7日分）
    const qtyWeek = Array.from({ length: 7 }, () => Math.floor(seededRandom() * 15));
    
    // 月間販売数（30日分）
    const qtyMonth = Array.from({ length: 30 }, () => Math.floor(seededRandom() * 12));

    return {
      menuId: menu.id,
      qtyToday,
      qtyWeek,
      qtyMonth
    };
  });

  return salesData;
}

// 在庫ステータス判定
export function getStockStatus(stock, reorderLevel) {
  if (stock === 0) return { status: '在庫切れ', color: 'text-red-600 bg-red-100', icon: '🔴' };
  if (stock <= reorderLevel / 2) return { status: '不足', color: 'text-orange-600 bg-orange-100', icon: '🟠' };
  if (stock <= reorderLevel) return { status: 'やや不足', color: 'text-yellow-600 bg-yellow-100', icon: '🟡' };
  return { status: '十分', color: 'text-green-600 bg-green-100', icon: '🟢' };
}
