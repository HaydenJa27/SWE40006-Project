import React from 'react';
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Laptop,
} from 'lucide-react';

export const Sidebar = ({ activeTab = 'Dashboard', onTabChange = () => {} }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Inventory', icon: Package },
  ];

  const bottomItems = [
    { name: 'Settings', icon: Settings },
    { name: 'Log Out', icon: LogOut },
  ];

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-gray-50">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-gray-900 tracking-tight block">Software Evolutions and Deployment</span>
            <span className="text-[10px] text-gray-400 font-medium block -mt-1">Lab Equipment Tracker</span>
          </div> 
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => onTabChange(item.name)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User/Settings Links */}
      <div className="p-4 border-t border-gray-50 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => alert(`${item.name} clicked (DevOps Demo)`)}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Icon className="w-4 h-4 text-gray-400" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
