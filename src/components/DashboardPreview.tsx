import React from 'react';

export function DashboardPreview() {
  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 h-full w-full shadow-inner font-sans text-white">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Team Statistics</h3>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {[ { label: 'Win', val: '64%' }, { label: 'Goal', val: '19' }, { label: 'Clean', val: '6' }, { label: 'Atten', val: '99%' } ].map(item => (
          <div key={item.label} className="bg-slate-900 rounded p-2">
            <p className="text-[8px] text-slate-600 uppercase font-medium">{item.label}</p>
            <p className="text-sm font-black text-pitch-green">{item.val}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 h-20">
        <div className="bg-slate-900 rounded flex items-center justify-center">
           <div className="w-12 h-12 rounded-full border-4 border-pitch-green border-r-slate-800" />
        </div>
        <div className="bg-slate-900 rounded p-1 flex items-end gap-1">
           <div className="w-1/4 bg-pitch-green h-1/2" /><div className="w-1/4 bg-red-500 h-1/4" /><div className="w-1/4 bg-pitch-green h-3/4" /><div className="w-1/4 bg-red-500 h-1/3" />
        </div>
      </div>
    </div>
  );
}
