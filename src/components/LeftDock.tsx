import React from 'react';
import { AlertTriangle, BookOpen, CheckCircle2 } from 'lucide-react';

interface LeftDockProps {
  onOpenBottlenecks: () => void;
  onOpenHistory: () => void;
  onOpenCoursesCatalog: () => void;
}

export const LeftDock: React.FC<LeftDockProps> = ({
  onOpenBottlenecks,
  onOpenHistory,
  onOpenCoursesCatalog
}) => (
  <nav
    className="w-full shrink-0 flex gap-1 overflow-x-auto px-2 py-2 bg-[#252526] border-b border-white/[0.08] sm:px-4"
    aria-label="Navegación principal"
    data-purpose="floating-dock"
  >
    <button
      onClick={onOpenCoursesCatalog}
      className="flex shrink-0 items-center gap-2 px-2 py-2.5 rounded-lg text-xs text-zinc-300 hover:bg-[#383838] hover:text-white transition cursor-pointer sm:gap-3 sm:px-3 sm:text-sm"
      title="Ver catálogo de cursos"
    >
      <BookOpen className="w-4 h-4 text-[#8da2ff]" />
      <span>Ver catálogo</span>
    </button>
    <button
      onClick={onOpenBottlenecks}
      className="flex shrink-0 items-center gap-2 px-2 py-2.5 rounded-lg text-xs text-zinc-300 hover:bg-[#383838] hover:text-white transition cursor-pointer sm:gap-3 sm:px-3 sm:text-sm"
      title="Ver cuellos de botella"
    >
      <AlertTriangle className="w-4 h-4 text-[#c4ee53]" />
      <span>Cuellos de botella</span>
    </button>
    <button
      onClick={onOpenHistory}
      className="flex shrink-0 items-center gap-2 px-2 py-2.5 rounded-lg text-xs text-zinc-300 hover:bg-[#383838] hover:text-white transition cursor-pointer sm:gap-3 sm:px-3 sm:text-sm"
      title="Ver materias cursadas"
    >
      <CheckCircle2 className="w-4 h-4 text-[#c4ee53]" />
      <span>Materias cursadas</span>
    </button>
  </nav>
);
