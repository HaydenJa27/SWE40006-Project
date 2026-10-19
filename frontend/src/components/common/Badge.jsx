import React from 'react';

export const Badge = ({ status }) => {
  const normalized = status?.toLowerCase() || '';

  let style = 'bg-gray-100 text-gray-700 border-gray-200';
  if (normalized.includes('in stock')) {
    style = 'bg-emerald-50 text-emerald-600 border border-emerald-200';
  } else if (normalized.includes('low')) {
    style = 'bg-red-50 text-red-500 border border-red-200';
  } else if (normalized.includes('out')) {
    style = 'bg-slate-100 text-slate-500 border border-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
};
