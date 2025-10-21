import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getStockStatus } from '../data/menuData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function InventoryTab({ menuData, setMenuData, salesData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  // カテゴリ一覧取得
  const categories = useMemo(() => {
    const cats = [...new Set(menuData.map(item => item.category))];
    return ['all', ...cats];
  }, [menuData]);

  // フィルタリング
  const filteredData = useMemo(() => {
    return menuData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchType = typeFilter === 'all' || item.type === typeFilter;
      return matchSearch && matchCategory && matchType;
    });
  }, [menuData, searchTerm, categoryFilter, typeFilter]);

  // 在庫ステータス集計
  const stockSummary = useMemo(() => {
    const total = menuData.length;
    const sufficient = menuData.filter(m => m.stock >= m.reorderLevel).length;
    const low = menuData.filter(m => m.stock > 0 && m.stock < m.reorderLevel).length;
    const outOfStock = menuData.filter(m => m.stock === 0).length;
    return { total, sufficient, low, outOfStock };
  }, [menuData]);

  // 詳細モーダル用のチャートデータ
  const getChartData = (menuId) => {
    const sales = salesData.find(s => s.menuId === menuId);
    if (!sales) return [];
    return sales.qtyWeek.map((qty, index) => ({
      day: `${index + 1}日前`,
      販売数: qty
    })).reverse();
  };

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="総メニュー数" 
          value={stockSummary.total} 
          icon="📊"
          color="bg-blue-600"
        />
        <SummaryCard 
          title="在庫十分" 
          value={stockSummary.sufficient} 
          icon="🟢"
          color="bg-green-600"
        />
        <SummaryCard 
          title="在庫不足" 
          value={stockSummary.low} 
          icon="🟡"
          color="bg-yellow-600"
        />
        <SummaryCard 
          title="在庫切れ" 
          value={stockSummary.outOfStock} 
          icon="🔴"
          color="bg-red-600"
        />
      </div>

      {/* フィルター */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">🔍 検索</label>
            <input
              type="text"
              placeholder="メニュー名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">📂 カテゴリ</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'すべて' : cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">🍽️ タイプ</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">すべて</option>
              <option value="food">フード</option>
              <option value="drink">ドリンク</option>
            </select>
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">メニュー名</th>
                <th className="px-4 py-3 text-left text-sm font-medium">カテゴリ</th>
                <th className="px-4 py-3 text-right text-sm font-medium">価格</th>
                <th className="px-4 py-3 text-right text-sm font-medium">原価</th>
                <th className="px-4 py-3 text-right text-sm font-medium">原価率</th>
                <th className="px-4 py-3 text-center text-sm font-medium">在庫数</th>
                <th className="px-4 py-3 text-center text-sm font-medium">ステータス</th>
                <th className="px-4 py-3 text-center text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredData.map((item, index) => {
                const status = getStockStatus(item.stock, item.reorderLevel);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className="hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-4 py-3 text-sm">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-right">¥{item.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right">¥{item.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.costRate}%</td>
                    <td className="px-4 py-3 text-sm text-center font-bold">{item.stock}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon} {status.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="px-3 py-1 bg-primary text-dark rounded hover:bg-yellow-600 text-xs font-medium">
                        詳細
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-primary">{selectedItem.name}</h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">カテゴリ</p>
                  <p className="font-medium">{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">タイプ</p>
                  <p className="font-medium">{selectedItem.type === 'food' ? 'フード' : 'ドリンク'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">販売価格</p>
                  <p className="font-medium text-lg">¥{selectedItem.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">原価</p>
                  <p className="font-medium text-lg">¥{selectedItem.cost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">推奨原価率</p>
                  <p className="font-medium text-lg text-primary">{selectedItem.costRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">発注レベル</p>
                  <p className="font-medium">{selectedItem.reorderLevel}個</p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="font-medium mb-3">📈 過去7日間の販売数</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData(selectedItem.id)}>
                      <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                        labelStyle={{ color: '#FFD700' }}
                      />
                      <Line type="monotone" dataKey="販売数" stroke="#FFD700" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${color} rounded-lg p-6 text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </motion.div>
  );
}
