import React from 'react';
import { Check, CheckCircle2, Network } from 'lucide-react';

interface TopHeaderProps {
  completedCredits: number;
  totalCredits: number;
  enrolledCount: number;
  enrolledCredits: number;
  isMatriculaAccepted: boolean;
  onReviewMatricula: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  completedCredits,
  totalCredits,
  enrolledCount,
  enrolledCredits,
  isMatriculaAccepted,
  onReviewMatricula
}) => {
  const progress = totalCredits > 0 ? (completedCredits / totalCredits) * 100 : 0;

  return (
    <header className="app-header min-h-14 px-3 py-2 flex items-center justify-between gap-2 sm:px-5 sm:gap-5 shrink-0 z-30 select-none">
      <div className="flex items-center shrink-0">
        <div className="w-8 h-8 rounded-md bg-[#4e6cef] flex items-center justify-center text-white">
          <Network className="w-4 h-4" strokeWidth={2.25} />
        </div>
        <div className="ml-3">
          <h1 className="text-sm font-semibold text-white leading-tight">CurriculaGraph</h1>
          <p className="text-[11px] text-zinc-400 leading-tight">Planificador académico</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md">
        <span className="text-[11px] text-zinc-400 whitespace-nowrap">Progreso de carrera</span>
        <div
          className="flex-1 h-2 rounded-full bg-[#1e1e1e] border border-white/[0.08] overflow-hidden"
          role="progressbar"
          aria-label="Progreso de carrera"
          aria-valuemin={0}
          aria-valuemax={totalCredits}
          aria-valuenow={completedCredits}
        >
          <div
            className="h-full rounded-full bg-[#c4ee53] transition-all duration-500"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <span className="text-xs text-zinc-200 font-mono whitespace-nowrap">
          {completedCredits}/{totalCredits} CR
        </span>
      </div>

      <button
        type="button"
        onClick={onReviewMatricula}
        className={`shrink-0 flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition cursor-pointer sm:gap-2 sm:px-3 ${
          isMatriculaAccepted
            ? 'bg-[#c4ee53]/15 text-[#c4ee53] border border-[#c4ee53]/30'
            : 'bg-[#c4ee53] hover:bg-[#d2f47d] text-[#1e1e1e]'
        }`}
      >
        {isMatriculaAccepted ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
        <span className="hidden sm:inline">
          {isMatriculaAccepted ? 'Matrícula aceptada' : 'Revisar matrícula'}
        </span>
        <span className="sm:hidden">{isMatriculaAccepted ? 'Aceptada' : 'Matrícula'}</span>
        <span className="px-1.5 py-0.5 rounded bg-black/10 font-mono">
          {enrolledCount} · {enrolledCredits} CR
        </span>
      </button>
    </header>
  );
};
