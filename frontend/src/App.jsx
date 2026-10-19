import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { inventoryApi } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch from backend or mock store
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await inventoryApi.getItems();
        setItems(data);
      } catch (err) {
        console.error('Failed to load items:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  // CRUD Handlers
  const handleAddItem = async (newItemData) => {
    const created = await inventoryApi.createItem(newItemData);
    setItems((prev) => [created, ...prev]);
  };

  const handleUpdateItem = async (id, updatedData) => {
    const updated = await inventoryApi.updateItem(id, updatedData);
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const handleDeleteItem = async (id) => {
    await inventoryApi.deleteItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const renderActiveView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
          Loading inventory records...
        </div>
      );
    }

    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardPage
            items={items}
            onNavigateToInventory={() => setActiveTab('Inventory')}
          />
        );
      case 'Inventory':
        return (
          <InventoryPage
            items={items}
            searchQuery={searchQuery}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {renderActiveView()}
    </DashboardLayout>
  );
}

export default App;
