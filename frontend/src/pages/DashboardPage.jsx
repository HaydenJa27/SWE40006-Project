import React from 'react';
import { Laptop, Boxes, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const DashboardPage = ({ items = [], onNavigateToInventory = () => {} }) => {
  // Aggregate stats from live items
  const totalItems = items.length;
  const totalStockUnits = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const lowStockCount = items.filter((item) => Number(item.quantity) <= 5).length;
  const categoriesCount = new Set(items.map((item) => item.category)).size;

  // Priority preview items (showing low-stock items first, up to 5)
  const previewItems = [...items]
    .sort((a, b) => Number(a.quantity) - Number(b.quantity))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Cards Across Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Equipment"
          value={totalItems}
          subtitle="Cataloged lab devices"
          icon={Laptop}
          color="blue"
        />
        <StatCard
          title="Total Stock Units"
          value={totalStockUnits.toLocaleString()}
          subtitle="Units available across lab"
          icon={Boxes}
          color="emerald"
        />
        <StatCard
          title="Low Stock / High Loan"
          value={lowStockCount}
          subtitle="Available units ≤ 5"
          icon={AlertTriangle}
          color="orange"
        />
        <StatCard
          title="Equipment Categories"
          value={categoriesCount}
          subtitle="Hardware & peripheral types"
          icon={Layers}
          color="purple"
        />
      </div>

      {/* Preview Table: Priority Stock Attention */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Equipment Priority & Low Stock</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Devices with limited available units or requiring return check-ins
            </p>
          </div>
          <button
            onClick={onNavigateToInventory}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Manage All Lab Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400">
                <th className="pb-3 font-medium">Asset ID</th>
                <th className="pb-3 font-medium">Equipment Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Available</th>
                <th className="pb-3 font-medium">Unit Value</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {previewItems.length > 0 ? (
                previewItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-mono text-xs text-gray-400">#{item.id}</td>
                    <td className="py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="py-3 text-gray-500">{item.category}</td>
                    <td className="py-3 font-semibold text-gray-700">{item.quantity}</td>
                    <td className="py-3 text-gray-700 font-medium">AUD ${Number(item.price).toLocaleString()}</td>
                    <td className="py-3">
                      <Badge status={item.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                    No equipment currently registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
