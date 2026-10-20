import React from 'react';
import { Network, GitBranch, Award, Sliders, Play, Check, Menu, Sun, Moon } from 'lucide-react';

interface TopHeaderProps {
  activeView: 'canvas' | 'malla' | 'auditoria';
  onSelectView: (view: 'canvas' | 'malla' | 'auditoria') => void;
  onOpenDiagnostic: () => void;
  onRunDAG: () => void;
  isDagRunning: boolean;
  enrolledCredits: number;
  onOpenPreMatricula: () => void;
  onToggleInspector: () => void;
  isInspectorOpen: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeView,
  onSelectView,
  onOpenDiagnostic,
  onRunDAG,
  isDagRunning,
  enrolledCredits,
  onOpenPreMatricula,
  onToggleInspector,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="h-14 bg-[#111215] border-b border-white/[0.08] px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Window Controls & Workspace Name */}
      <div className="flex items-center space-x-4">
        {/* macOS Window Traffic Lights */}
        <div className="flex items-center space-x-2 mr-1" title="macOS Controls">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm hover:opacity-80 transition cursor-pointer active:scale-90" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm hover:opacity-80 transition cursor-pointer active:scale-90" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm hover:opacity-80 transition cursor-pointer active:scale-90" />
        </div>

        {/* App Branding / Breadcrumb */}
        <div className="flex items-center space-x-2 border-l border-zinc-800 pl-4 py-1">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-md">
            <Network className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-semibold tracking-wider text-white">CurriculaGraph</span>
          <span className="text-zinc-600">/</span>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">Plan-2024 (Multimedia)</span>
          <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono font-medium">
            DAG v2.4
          </span>
        </div>
      </div>

      {/* Center: View Switcher Pill */}
      <div className="hidden md:flex items-center bg-[#131418] p-1 rounded-xl border border-white/[0.07] text-xs font-medium">
        <button
          onClick={() => onSelectView('canvas')}
          className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
            activeView === 'canvas'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Network className={`w-3.5 h-3.5 ${activeView === 'canvas' ? 'text-emerald-400' : ''}`} />
          <span>Canvas de Nodos</span>
        </button>

        <button
          onClick={() => onSelectView('malla')}
          className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
            activeView === 'malla'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <GitBranch className={`w-3.5 h-3.5 ${activeView === 'malla' ? 'text-cyan-400' : ''}`} />
          <span>Malla Flujo</span>
        </button>

        <button
          onClick={() => onSelectView('auditoria')}
          className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
            activeView === 'auditoria'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Award className={`w-3.5 h-3.5 ${activeView === 'auditoria' ? 'text-violet-400' : ''}`} />
          <span>Auditoría de Grado</span>
        </button>
      </div>

      {/* Right Header Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Cambiar a modo técnico claro' : 'Cambiar a modo técnico oscuro'}
          className="p-1.5 rounded-lg bg-[#16181d] hover:bg-[#1c1e24] border border-white/[0.08] text-zinc-400 hover:text-white transition"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
        </button>

        {/* Diagnostics Button */}
        <button
          onClick={onOpenDiagnostic}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#16181d] hover:bg-[#1c1e24] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          title="Abrir Calibración de Diagnóstico"
        >
          <Sliders className="w-3.5 h-3.5 text-violet-400" />
          <span className="hidden sm:inline">Diagnóstico</span>
        </button>

        {/* Run DAG Button */}
        <button
          onClick={onRunDAG}
          disabled={isDagRunning}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-medium text-emerald-300 hover:text-emerald-200 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-60"
        >
          {isDagRunning ? (
            <>
              <svg className="animate-spin w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Calculando...</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ejecutar DAG</span>
            </>
          )}
        </button>

        {/* Pre-enrollment High Contrast Pill */}
        <button
          onClick={onOpenPreMatricula}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-semibold flex items-center gap-1.5 shadow hover:bg-zinc-100 transition cursor-pointer active:scale-95"
          title="Ver resumen y confirmar pre-matrícula"
        >
          <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
          <span className="hidden xs:inline">Pre-matrícula</span>
          <span className="bg-zinc-200 text-zinc-900 px-1.5 py-0.5 rounded text-[11px] font-mono">
            {enrolledCredits} CR
          </span>
        </button>

        {/* Toggle Inspector Button */}
        <button
          onClick={onToggleInspector}
          className="p-2 rounded-lg bg-[#16181d] hover:bg-[#1c1e24] text-zinc-400 hover:text-white border border-white/[0.08] transition active:scale-95 cursor-pointer"
          title="Alternar Inspector Lateral"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
