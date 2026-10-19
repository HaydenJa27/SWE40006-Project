import React from 'react';

export const MetricItem = ({ icon: Icon, value, label, iconColor = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-500',
    purple: 'bg-purple-50 text-purple-500',
    orange: 'bg-amber-50 text-amber-500',
    green: 'bg-emerald-50 text-emerald-500',
    cyan: 'bg-cyan-50 text-cyan-500',
  };

  return (
    <div className="flex flex-col items-start gap-1 p-2">
      <div className="flex items-center gap-2 mb-1">
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[iconColor] || colorMap.blue}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <span className="text-lg font-bold text-gray-900 tracking-tight">{value}</span>
      <span className="text-xs font-normal text-gray-500">{label}</span>
    </div>
  );
};

export const CardContainer = ({ title, actionLabel, onAction, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {actionLabel && (
            <button
              onClick={onAction}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
