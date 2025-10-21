import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateMenuData, generateSalesData } from './data/menuData';
import InventoryTab from './components/InventoryTab';
import SalesTab from './components/SalesTab';
import OrderTab from './components/OrderTab';
import LaborTab from './components/LaborTab';

function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [menuData, setMenuData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [laborData, setLaborData] = useState([
    { id: 1, name: '田中 太郎', role: 'ホール', hours: 8, wage: 1200 },
    { id: 2, name: '佐藤 花子', role: 'キッチン', hours: 8, wage: 1300 },
    { id: 3, name: '鈴木 一郎', role: 'ホール', hours: 5, wage: 1100 },
    { id: 4, name: '山田 美咲', role: 'キッチン', hours: 6, wage: 1250 },
  ]);
  const [posEnabled, setPosEnabled] = useState(false);

  // 初期データ生成
  useEffect(() => {
    const menus = generateMenuData();
    const sales = generateSalesData(menus);
    setMenuData(menus);
    setSalesData(sales);
  }, []);

  // POS連動機能（10秒ごとにランダム販売）
  useEffect(() => {
    if (!posEnabled) return;

    const interval = setInterval(() => {
      setSalesData(prevSales => {
        const newSales = [...prevSales];
        // ランダムに3〜5品を選択
        const numItems = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numItems; i++) {
          const randomIndex = Math.floor(Math.random() * newSales.length);
          const addQty = 1 + Math.floor(Math.random() * 3);
          newSales[randomIndex] = {
            ...newSales[randomIndex],
            qtyToday: newSales[randomIndex].qtyToday + addQty
          };
        }
        return newSales;
      });

      // 在庫減少
      setMenuData(prevMenu => {
        return prevMenu.map((menu, index) => {
          const sales = salesData[index];
          if (!sales) return menu;
          const soldToday = salesData[index]?.qtyToday || 0;
          const newStock = Math.max(0, menu.stock - 1);
          return soldToday > 0 ? { ...menu, stock: newStock } : menu;
        });
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [posEnabled, salesData]);

  const tabs = [
    { id: 'inventory', label: '在庫管理', icon: '📦' },
    { id: 'sales', label: '売上管理', icon: '💰' },
    { id: 'order', label: '発注管理', icon: '📋' },
    { id: 'labor', label: '人件費管理', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-dark text-white font-sans">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-primary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center md:justify-start gap-3">
                🏮 ともしび
              </h1>
              <p className="text-gray-400 text-sm mt-1">飲食店統合ダッシュボード</p>
            </div>
            <div className="text-xs text-gray-500 text-center md:text-right">
              <p>※価格・原価は相場感ベースのダミーデータです</p>
              <p>（実在価格ではありません・エビデンスなし）</p>
            </div>
          </div>
        </div>
      </header>

      {/* タブナビゲーション */}
      <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-gray-800'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'inventory' && (
              <InventoryTab 
                menuData={menuData} 
                setMenuData={setMenuData}
                salesData={salesData}
              />
            )}
            {activeTab === 'sales' && (
              <SalesTab 
                menuData={menuData} 
                salesData={salesData}
                orderHistory={orderHistory}
                laborData={laborData}
                posEnabled={posEnabled}
                setPosEnabled={setPosEnabled}
              />
            )}
            {activeTab === 'order' && (
              <OrderTab 
                menuData={menuData}
                setMenuData={setMenuData}
                orderHistory={orderHistory}
                setOrderHistory={setOrderHistory}
              />
            )}
            {activeTab === 'labor' && (
              <LaborTab 
                laborData={laborData}
                setLaborData={setLaborData}
                menuData={menuData}
                salesData={salesData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 border-t border-gray-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="mb-2">
            ✅ ともしび 統合ダッシュボード（ダミー稼働版）が完成しました。
          </p>
          <p>
            右上の Publish からデプロイすると、商談で共有できるURLが発行されます。🚀
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
