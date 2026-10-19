import React from 'react';
import { Search, User } from 'lucide-react';

export const Header = ({ searchQuery, onSearchChange }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search laptops, monitors, accessories..."
            className="w-full bg-[#F9FAFB] hover:bg-[#F3F4F6] focus:bg-white text-sm text-gray-800 placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* User Icon & Status */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <span className="text-xs font-semibold text-gray-800 block">Lab Administrator</span>
          <span className="text-[10px] text-emerald-600 font-medium block">SWE40006 Lab</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
