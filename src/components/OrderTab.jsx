import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStockStatus } from '../data/menuData';

export default function OrderTab({ menuData, setMenuData, orderHistory, setOrderHistory }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    item: '',
    quantity: 1,
    supplier: 'A商店',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  });

  // 不足・在庫切れアイテム
  const lowStockItems = useMemo(() => {
    return menuData.filter(item => item.stock <= item.reorderLevel);
  }, [menuData]);

  // 発注フォームを開く
  const openOrderForm = (item) => {
    setSelectedItem(item);
    setFormData({
      ...formData,
      item: item.name
    });
    setShowOrderForm(true);
  };

  // 発注送信
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    const newOrder = {
      id: Date.now(),
      ...formData,
      itemCost: selectedItem.cost,
      totalCost: selectedItem.cost * formData.quantity,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    setOrderHistory([newOrder, ...orderHistory]);

    // 在庫更新（納品予定分を先に加算）
    setMenuData(prevData => 
      prevData.map(item => 
        item.name === formData.item 
          ? { ...item, stock: item.stock + formData.quantity }
          : item
      )
    );

    // フォームリセット
    setShowOrderForm(false);
    setSelectedItem(null);
    setFormData({
      item: '',
      quantity: 1,
      supplier: 'A商店',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
    });
  };

  // 発注履歴の合計コスト
  const totalOrderCost = useMemo(() => {
    return orderHistory.reduce((sum, order) => sum + order.totalCost, 0);
  }, [orderHistory]);

  return (
    <div className="space-y-6">
      {/* サマリー */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard 
          title="要発注アイテム"
          value={lowStockItems.length}
          icon="⚠️"
          color="bg-orange-600"
        />
        <SummaryCard 
          title="発注履歴"
          value={orderHistory.length}
          icon="📋"
          color="bg-blue-600"
        />
        <SummaryCard 
          title="総発注コスト"
          value={`¥${totalOrderCost.toLocaleString()}`}
          icon="💳"
          color="bg-purple-600"
        />
      </div>

      {/* 不足アイテム一覧 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">⚠️ 在庫不足・在庫切れアイテム</h3>
          <span className="text-sm text-gray-400">{lowStockItems.length}件</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">メニュー名</th>
                <th className="px-4 py-3 text-left text-sm font-medium">カテゴリ</th>
                <th className="px-4 py-3 text-center text-sm font-medium">現在庫</th>
                <th className="px-4 py-3 text-center text-sm font-medium">発注レベル</th>
                <th className="px-4 py-3 text-center text-sm font-medium">ステータス</th>
                <th className="px-4 py-3 text-right text-sm font-medium">原価</th>
                <th className="px-4 py-3 text-center text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {lowStockItems.map((item, index) => {
                const status = getStockStatus(item.stock, item.reorderLevel);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-center font-bold">{item.stock}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.reorderLevel}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon} {status.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">¥{item.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openOrderForm(item)}
                        className="px-4 py-2 bg-primary text-dark rounded-lg hover:bg-yellow-600 text-sm font-medium"
                      >
                        発注
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 発注履歴 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📜 発注履歴</h3>
        
        {orderHistory.length === 0 ? (
          <p className="text-gray-400 text-center py-8">発注履歴がありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">発注日時</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">品目</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">数量</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">発注先</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">納品予定</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">小計</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orderHistory.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-sm">
                      {new Date(order.timestamp).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{order.item}</td>
                    <td className="px-4 py-3 text-sm text-center">{order.quantity}</td>
                    <td className="px-4 py-3 text-sm">{order.supplier}</td>
                    <td className="px-4 py-3 text-sm">{order.deliveryDate}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-primary">
                      ¥{order.totalCost.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 発注フォームモーダル */}
      <AnimatePresence>
        {showOrderForm && selectedItem && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowOrderForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary">📝 発注フォーム</h3>
                <button 
                  onClick={() => setShowOrderForm(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">品目</label>
                  <input
                    type="text"
                    value={formData.item}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">数量</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">発注先</label>
                  <select
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="A商店">A商店</option>
                    <option value="B水産">B水産</option>
                    <option value="C食品">C食品</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">発注日</label>
                  <input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">納品予定日</label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">単価</span>
                    <span>¥{selectedItem.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-400">合計</span>
                    <span className="text-primary">¥{(selectedItem.cost * formData.quantity).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-dark hover:bg-yellow-600 rounded-lg font-bold"
                  >
                    発注する
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
