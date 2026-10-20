import React from 'react';
import { Course } from '../types/curriculum';
import { FileText, CheckCircle2, Award, Calendar, X } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, courses }) => {
  if (!isOpen) return null;

  const approvedCourses = courses.filter((c) => c.status === 'Aprobado');
  const totalApprovedCredits = approvedCourses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#111215] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Historial Académico Certificado</h3>
              <p className="text-xs text-zinc-400">Kardex de materias aprobadas y calificaciones</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#16181d] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {/* Summary Box */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#16181d] border border-white/[0.05] text-center">
            <div>
              <span className="text-[10px] text-zinc-400 block">Materias Aprobadas</span>
              <span className="text-base font-bold text-white font-mono">{approvedCourses.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Créditos Ganados</span>
              <span className="text-base font-bold text-emerald-400 font-mono">{totalApprovedCredits} CR</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Promedio Kardex</span>
              <span className="text-base font-bold text-cyan-400 font-mono">8.72 / 10</span>
            </div>
          </div>

          {/* List of passed courses */}
          <div className="space-y-2">
            {approvedCourses.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-[#16181d] border border-white/[0.04] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-semibold text-[11px]">{c.code}</span>
                    <span className="text-white font-medium">{c.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    Semestre {c.semester} • {c.credits} Créditos • {c.type}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white block">Nota: {c.grade}/10</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Aprobado</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-[#131418] border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs transition"
          >
            Cerrar Kardex
          </button>
        </div>
      </div>
    </div>
  );
};
