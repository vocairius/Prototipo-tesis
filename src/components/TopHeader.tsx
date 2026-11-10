import React from 'react';
import { Network } from 'lucide-react';

export const TopHeader: React.FC = () => (
  <header className="app-header h-14 px-5 flex items-center shrink-0 z-30 select-none">
    <div className="w-8 h-8 rounded-md bg-[#4e6cef] flex items-center justify-center text-white">
      <Network className="w-4 h-4" strokeWidth={2.25} />
    </div>
    <div className="ml-3">
      <h1 className="text-sm font-semibold text-white leading-tight">CurriculaGraph</h1>
      <p className="text-[11px] text-zinc-400 leading-tight">Planificador académico</p>
    </div>
  </header>
);
