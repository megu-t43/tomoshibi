import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#FFD700', '#C0392B', '#3498DB', '#2ECC71', '#9B59B6'];

export default function LaborTab({ laborData, setLaborData, menuData, salesData }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: 'ホール',
    hours: 8,
    wage: 1200
  });

  // 人件費計算
  const laborMetrics = useMemo(() => {
    const totalCost = laborData.reduce((sum, emp) => sum + (emp.hours * emp.wage), 0);
    
    // 売上合計（当日）
    const totalSales = menuData.reduce((sum, menu, index) => {
      const sales = salesData[index];
      if (!sales) return sum;
      return sum + (menu.price * sales.qtyToday);
    }, 0);

    // 人件費率
    const laborRate = totalSales > 0 ? (totalCost / totalSales * 100) : 0;

    // 役割別集計
    const byRole = laborData.reduce((acc, emp) => {
      const cost = emp.hours * emp.wage;
      if (!acc[emp.role]) {
        acc[emp.role] = { role: emp.role, cost: 0, count: 0 };
      }
      acc[emp.role].cost += cost;
      acc[emp.role].count += 1;
      return acc;
    }, {});

    const roleBreakdown = Object.values(byRole);

    // 日別シミュレーション（ダミー）
    const dailyData = ['月', '火', '水', '木', '金', '土', '日'].map(day => ({
      day,
      人件費: Math.floor(totalCost * (0.8 + Math.random() * 0.4))
    }));

    return {
      totalCost,
      totalSales,
      laborRate,
      roleBreakdown,
      dailyData,
      avgCostPerEmployee: laborData.length > 0 ? Math.round(totalCost / laborData.length) : 0
    };
  }, [laborData, menuData, salesData]);

  // 編集開始
  const startEdit = (employee) => {
    setEditingId(employee.id);
    setEditForm({ ...employee });
  };

  // 編集保存
  const saveEdit = () => {
    setLaborData(laborData.map(emp => 
      emp.id === editingId ? editForm : emp
    ));
    setEditingId(null);
    setEditForm({});
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // 従業員追加
  const addEmployee = (e) => {
    e.preventDefault();
    const newId = Math.max(...laborData.map(emp => emp.id), 0) + 1;
    setLaborData([...laborData, { id: newId, ...newEmployee }]);
    setNewEmployee({ name: '', role: 'ホール', hours: 8, wage: 1200 });
    setShowAddForm(false);
  };

  // 従業員削除
  const deleteEmployee = (id) => {
    if (confirm('この従業員を削除しますか？')) {
      setLaborData(laborData.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="合計人件費"
          value={`¥${laborMetrics.totalCost.toLocaleString()}`}
          icon="💰"
          color="bg-purple-600"
        />
        <SummaryCard 
          title="人件費率"
          value={`${laborMetrics.laborRate.toFixed(1)}%`}
          icon="📊"
          color="bg-accent"
        />
        <SummaryCard 
          title="従業員数"
          value={laborData.length}
          icon="👥"
          color="bg-blue-600"
        />
        <SummaryCard 
          title="1人平均"
          value={`¥${laborMetrics.avgCostPerEmployee.toLocaleString()}`}
          icon="💵"
          color="bg-green-600"
        />
      </div>

      {/* グラフエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 日別人件費 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">📅 週間人件費推移</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={laborMetrics.dailyData}>
                <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  formatter={(value) => `¥${value.toLocaleString()}`}
                />
                <Bar dataKey="人件費" fill="#C0392B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 役割別構成 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">🎯 役割別人件費構成</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={laborMetrics.roleBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ role, cost }) => `${role} ¥${Math.round(cost).toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cost"
                >
                  {laborMetrics.roleBreakdown.map((entry, index) => (
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

      {/* シフト管理テーブル */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">👥 シフト管理</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-primary text-dark rounded-lg hover:bg-yellow-600 font-medium"
          >
            {showAddForm ? 'キャンセル' : '+ 従業員追加'}
          </button>
        </div>

        {/* 追加フォーム */}
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-900 rounded-lg p-4 mb-4"
            onSubmit={addEmployee}
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="氏名"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                required
              />
              <select
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="ホール">ホール</option>
                <option value="キッチン">キッチン</option>
                <option value="マネージャー">マネージャー</option>
                <option value="アルバイト">アルバイト</option>
              </select>
              <input
                type="number"
                placeholder="勤務時間"
                value={newEmployee.hours}
                onChange={(e) => setNewEmployee({ ...newEmployee, hours: parseFloat(e.target.value) })}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                min="0"
                step="0.5"
                required
              />
              <input
                type="number"
                placeholder="時給"
                value={newEmployee.wage}
                onChange={(e) => setNewEmployee({ ...newEmployee, wage: parseInt(e.target.value) })}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                min="0"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-dark hover:bg-yellow-600 rounded-lg font-medium"
              >
                追加
              </button>
            </div>
          </motion.form>
        )}

        {/* テーブル */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">氏名</th>
                <th className="px-4 py-3 text-left text-sm font-medium">役割</th>
                <th className="px-4 py-3 text-right text-sm font-medium">勤務時間</th>
                <th className="px-4 py-3 text-right text-sm font-medium">時給</th>
                <th className="px-4 py-3 text-right text-sm font-medium">日当</th>
                <th className="px-4 py-3 text-center text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {laborData.map((employee, index) => {
                const isEditing = editingId === employee.id;
                const dailyCost = employee.hours * employee.wage;

                return (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-700"
                  >
                    {isEditing ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm"
                          >
                            <option value="ホール">ホール</option>
                            <option value="キッチン">キッチン</option>
                            <option value="マネージャー">マネージャー</option>
                            <option value="アルバイト">アルバイト</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editForm.hours}
                            onChange={(e) => setEditForm({ ...editForm, hours: parseFloat(e.target.value) })}
                            className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-right"
                            step="0.5"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editForm.wage}
                            onChange={(e) => setEditForm({ ...editForm, wage: parseInt(e.target.value) })}
                            className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          ¥{(editForm.hours * editForm.wage).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-medium"
                            >
                              保存
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs font-medium"
                            >
                              キャンセル
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm font-medium">{employee.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 bg-gray-900 rounded text-xs">{employee.role}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">{employee.hours}時間</td>
                        <td className="px-4 py-3 text-sm text-right">¥{employee.wage.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-primary">
                          ¥{dailyCost.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => startEdit(employee)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => deleteEmployee(employee.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium"
                            >
                              削除
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </motion.tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-900">
              <tr>
                <td colSpan="4" className="px-4 py-3 text-right font-bold">合計</td>
                <td className="px-4 py-3 text-right font-bold text-primary text-lg">
                  ¥{laborMetrics.totalCost.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 人件費と売上の関係 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">📈 人件費と売上の関係</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">当日売上</p>
            <p className="text-2xl font-bold text-blue-400">¥{laborMetrics.totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">人件費</p>
            <p className="text-2xl font-bold text-accent">¥{laborMetrics.totalCost.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">人件費率</p>
            <p className={`text-2xl font-bold ${
              laborMetrics.laborRate < 30 ? 'text-green-400' : 
              laborMetrics.laborRate < 35 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {laborMetrics.laborRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {laborMetrics.laborRate < 30 ? '✅ 適正範囲' : 
               laborMetrics.laborRate < 35 ? '⚠️ やや高め' : 
               '⚠️ 要改善'}
            </p>
          </div>
        </div>
      </div>
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
