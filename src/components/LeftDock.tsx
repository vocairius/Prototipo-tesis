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
    className="w-full shrink-0 flex gap-1 px-4 py-2 bg-[#252526] border-b border-white/[0.08]"
    aria-label="Navegación principal"
    data-purpose="floating-dock"
  >
    <button
      onClick={onOpenCoursesCatalog}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-[#383838] hover:text-white transition cursor-pointer"
      title="Ver catálogo de cursos"
    >
      <BookOpen className="w-4 h-4 text-[#8da2ff]" />
      <span>Ver catálogo</span>
    </button>
    <button
      onClick={onOpenBottlenecks}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-[#383838] hover:text-white transition cursor-pointer"
      title="Ver cuellos de botella"
    >
      <AlertTriangle className="w-4 h-4 text-[#c4ee53]" />
      <span>Cuellos de botella</span>
    </button>
    <button
      onClick={onOpenHistory}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-[#383838] hover:text-white transition cursor-pointer"
      title="Ver materias cursadas"
    >
      <CheckCircle2 className="w-4 h-4 text-[#c4ee53]" />
      <span>Materias cursadas</span>
    </button>
  </nav>
);
