import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

// Helper to determine loan/inventory status badge based on quantity
export const computeStatus = (quantity) => {
  const qty = Number(quantity);
  if (qty <= 0) return 'Out of Stock';
  if (qty <= 5) return 'Low Stock';
  return 'In Stock';
};

// University Computer Lab & Equipment Lending Store
let mockItems = [
  { id: 101, name: 'Dell Latitude 5540 15.6" Laptop', category: 'Laptops', quantity: 4, price: 1499, status: 'Low Stock' },
  { id: 102, name: 'Apple MacBook Pro 14" M3', category: 'Laptops', quantity: 2, price: 2499, status: 'Low Stock' },
  { id: 103, name: 'Dell OptiPlex 7010 Micro Desktop', category: 'Desktops', quantity: 18, price: 1150, status: 'In Stock' },
  { id: 104, name: 'Dell UltraSharp 27" 4K Monitor', category: 'Monitors', quantity: 14, price: 650, status: 'In Stock' },
  { id: 105, name: 'Keychron K2 Mechanical Keyboard', category: 'Peripherals', quantity: 25, price: 149, status: 'In Stock' },
  { id: 106, name: 'Logitech MX Master 3S Wireless Mouse', category: 'Peripherals', quantity: 30, price: 169, status: 'In Stock' },
  { id: 107, name: 'Anker USB-C 8-in-1 Hub Adapter', category: 'Accessories', quantity: 3, price: 89, status: 'Low Stock' },
  { id: 108, name: 'Raspberry Pi 4 Model B (8GB Kit)', category: 'Lab Kits', quantity: 0, price: 135, status: 'Out of Stock' },
  { id: 109, name: 'Cisco Catalyst 1000 24-Port Switch', category: 'Networking', quantity: 6, price: 750, status: 'In Stock' },
  { id: 110, name: 'Sony WH-1000XM5 Headset', category: 'Audio / Video', quantity: 12, price: 499, status: 'In Stock' },
];

export const inventoryApi = {
  // Read All Items
  getItems: async () => {
    try {
      const response = await apiClient.get('/items');
      return response.data;
    } catch (err) {
      console.warn('Backend not detected. Using mock lab equipment inventory data.', err?.message);
      return [...mockItems];
    }
  },

  // Create Item
  createItem: async (itemData) => {
    try {
      const response = await apiClient.post('/items', itemData);
      return response.data;
    } catch (err) {
      console.warn('Backend not detected. Adding item locally to mock store.', err?.message);
      const newItem = {
        ...itemData,
        id: mockItems.length ? Math.max(...mockItems.map((i) => i.id)) + 1 : 101,
        quantity: Number(itemData.quantity),
        price: Number(itemData.price),
        status: computeStatus(itemData.quantity),
      };
      mockItems = [newItem, ...mockItems];
      return newItem;
    }
  },

  // Update Item
  updateItem: async (id, itemData) => {
    try {
      const response = await apiClient.put(`/items/${id}`, itemData);
      return response.data;
    } catch (err) {
      console.warn(`Backend not detected. Updating item #${id} in local mock store.`);
      const updatedItem = {
        ...itemData,
        id: Number(id),
        quantity: Number(itemData.quantity),
        price: Number(itemData.price),
        status: computeStatus(itemData.quantity),
      };
      mockItems = mockItems.map((item) => (item.id === Number(id) ? updatedItem : item));
      return updatedItem;
    }
  },

  // Delete Item
  deleteItem: async (id) => {
    try {
      await apiClient.delete(`/items/${id}`);
      return true;
    } catch (err) {
      console.warn(`Backend not detected. Deleting item #${id} from local mock store.`);
      mockItems = mockItems.filter((item) => item.id !== Number(id));
      return true;
    }
  },
};
