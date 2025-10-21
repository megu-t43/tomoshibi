import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#FFD700', '#C0392B', '#3498DB', '#2ECC71'];

export default function SalesTab({ menuData, salesData, orderHistory, laborData, posEnabled, setPosEnabled }) {
  const [period, setPeriod] = useState('day'); // day, week, month
  const [visitorCount] = useState(85); // ダミーの来客数

  // 売上計算
  const salesMetrics = useMemo(() => {
    let totalSales = 0;
    let totalCost = 0;
    let salesByMenu = [];

    menuData.forEach((menu, index) => {
      const sales = salesData[index];
      if (!sales) return;

      let qty = 0;
      if (period === 'day') {
        qty = sales.qtyToday;
      } else if (period === 'week') {
        qty = sales.qtyWeek.reduce((a, b) => a + b, 0);
      } else {
        qty = sales.qtyMonth.reduce((a, b) => a + b, 0);
      }

      const revenue = menu.price * qty;
      const cost = menu.cost * qty;
      
      totalSales += revenue;
      totalCost += cost;

      if (qty > 0) {
        salesByMenu.push({
          id: menu.id,
          name: menu.name,
          category: menu.category,
          type: menu.type,
          qty,
          revenue,
          cost,
          profit: revenue - cost
        });
      }
    });

    // 粗利
    const grossProfit = totalSales - totalCost;

    // 人件費合計
    const totalLabor = laborData.reduce((sum, l) => sum + (l.hours * l.wage), 0);

    // 発注コスト合計（当日分）
    const orderCost = orderHistory
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      })
      .reduce((sum, order) => {
        const menu = menuData.find(m => m.name === order.item);
        return sum + (menu ? menu.cost * order.quantity : 0);
      }, 0);

    // 営業利益 = 売上 - (原価 + 人件費 + 発注コスト)
    const operatingProfit = totalSales - (totalCost + totalLabor + orderCost);

    // 人件費率
    const laborRate = totalSales > 0 ? (totalLabor / totalSales * 100) : 0;

    // TOP10メニュー
    const top10 = salesByMenu
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // フード vs ドリンク
    const foodSales = salesByMenu.filter(s => s.type === 'food').reduce((sum, s) => sum + s.revenue, 0);
    const drinkSales = salesByMenu.filter(s => s.type === 'drink').reduce((sum, s) => sum + s.revenue, 0);

    // 客単価
    const avgPerCustomer = visitorCount > 0 ? Math.round(totalSales / visitorCount) : 0;

    return {
      totalSales,
      totalCost,
      grossProfit,
      totalLabor,
      orderCost,
      operatingProfit,
      laborRate,
      top10,
      foodSales,
      drinkSales,
      avgPerCustomer
    };
  }, [menuData, salesData, period, laborData, orderHistory, visitorCount]);

  // チャート用データ（日別売上）
  const chartData = useMemo(() => {
    if (period === 'day') {
      // 当日の時間帯別（ダミー）
      return Array.from({ length: 12 }, (_, i) => ({
        label: `${i + 11}時`,
        売上: Math.floor(Math.random() * 50000 + 10000)
      }));
    } else if (period === 'week') {
      const days = ['月', '火', '水', '木', '金', '土', '日'];
      return days.map((day, i) => {
        const daySales = menuData.reduce((sum, menu, index) => {
          const sales = salesData[index];
          if (!sales) return sum;
          return sum + (menu.price * (sales.qtyWeek[i] || 0));
        }, 0);
        return { label: day, 売上: daySales };
      });
    } else {
      // 月間（5日ごと）
      return Array.from({ length: 6 }, (_, i) => {
        const start = i * 5 + 1;
        const end = Math.min(start + 4, 30);
        const periodSales = menuData.reduce((sum, menu, index) => {
          const sales = salesData[index];
          if (!sales) return sum;
          const periodQty = sales.qtyMonth.slice(start - 1, end).reduce((a, b) => a + b, 0);
          return sum + (menu.price * periodQty);
        }, 0);
        return { label: `${start}-${end}日`, 売上: periodSales };
      });
    }
  }, [period, menuData, salesData]);

  // 構成比データ
  const compositionData = [
    { name: 'フード', value: salesMetrics.foodSales },
    { name: 'ドリンク', value: salesMetrics.drinkSales }
  ];

  return (
    <div className="space-y-6">
      {/* POS連動トグル */}
      <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">🔄 POS連動モード</h3>
          <p className="text-sm text-gray-400">ONにすると10秒ごとにランダム販売データが更新されます</p>
        </div>
        <button
          onClick={() => setPosEnabled(!posEnabled)}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            posEnabled 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          {posEnabled ? 'ON 🟢' : 'OFF ⚫'}
        </button>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard 
          title="売上合計" 
          value={`¥${salesMetrics.totalSales.toLocaleString()}`}
          color="bg-blue-600"
          icon="💰"
        />
        <MetricCard 
          title="原価合計" 
          value={`¥${salesMetrics.totalCost.toLocaleString()}`}
          color="bg-orange-600"
          icon="📊"
        />
        <MetricCard 
          title="粗利" 
          value={`¥${salesMetrics.grossProfit.toLocaleString()}`}
          color="bg-green-600"
          icon="📈"
        />
        <MetricCard 
          title="営業利益" 
          value={`¥${salesMetrics.operatingProfit.toLocaleString()}`}
          color="bg-purple-600"
          icon="💎"
        />
        <MetricCard 
          title="人件費率" 
          value={`${salesMetrics.laborRate.toFixed(1)}%`}
          color="bg-accent"
          icon="👥"
        />
      </div>

      {/* 期間選択 */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex gap-2">
          {[
            { id: 'day', label: '日別' },
            { id: 'week', label: '週別' },
            { id: 'month', label: '月別' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                period === p.id
                  ? 'bg-primary text-dark'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* グラフエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 売上推移 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">📊 売上推移</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="label" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  formatter={(value) => `¥${value.toLocaleString()}`}
                />
                <Bar dataKey="売上" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 構成比 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">🥘 フード vs ドリンク構成比</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TOP10メニュー */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">🏆 売上TOP10メニュー</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">順位</th>
                <th className="px-4 py-3 text-left text-sm font-medium">メニュー名</th>
                <th className="px-4 py-3 text-left text-sm font-medium">カテゴリ</th>
                <th className="px-4 py-3 text-right text-sm font-medium">売上</th>
                <th className="px-4 py-3 text-right text-sm font-medium">数量</th>
                <th className="px-4 py-3 text-right text-sm font-medium">粗利</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {salesMetrics.top10.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-sm font-bold text-primary">#{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold">¥{item.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">{item.qty}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-400">¥{item.profit.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* その他指標 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">来客数</p>
          <p className="text-3xl font-bold text-primary">{visitorCount}人</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">客単価</p>
          <p className="text-3xl font-bold text-primary">¥{salesMetrics.avgPerCustomer.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">人件費</p>
          <p className="text-3xl font-bold text-accent">¥{salesMetrics.totalLabor.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, color, icon }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`${color} rounded-lg p-6 text-white`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm opacity-90">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}
