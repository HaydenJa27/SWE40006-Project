import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ItemModal } from '../components/inventory/ItemModal';

export const InventoryPage = ({
  items = [],
  searchQuery = '',
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Extract categories for filter dropdown
  const categories = ['All', ...new Set(items.map((i) => i.category))];

  // Filter items based on header search query and category filter
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (editingItem) {
      await onUpdateItem(editingItem.id, formData);
    } else {
      await onAddItem(formData);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from lab inventory?`)) {
      onDeleteItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Title, Filter, Add Item button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Lab Equipment Inventory</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Catalog, loan stock levels, replacement values, and hardware availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Hardware Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Add New Item Button */}
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
          </button>
        </div>
      </div>

      {/* Main CRUD Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFBFD] border-b border-gray-100">
              <tr className="text-xs font-semibold text-gray-400">
                <th className="py-3.5 px-6 font-medium">Asset ID</th>
                <th className="py-3.5 px-4 font-medium">Equipment Name</th>
                <th className="py-3.5 px-4 font-medium">Category</th>
                <th className="py-3.5 px-4 font-medium">Available Units</th>
                <th className="py-3.5 px-4 font-medium">Unit Value (AUD$)</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs text-gray-400">#{item.id}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3.5 px-4 text-gray-500">{item.category}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      AUD ${Number(item.price).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={item.status} />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Equipment"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          title="Delete Equipment"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                    No matching lab equipment found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Modal (Create & Edit) */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
};
