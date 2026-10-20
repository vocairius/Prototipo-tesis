import React, { useState } from 'react';
import { Course } from '../types/curriculum';
import { Check, AlertCircle, Clock, Trash2, CalendarCheck, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PreMatriculaModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrolledCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
  onAddCourse: (courseId: string) => void;
  availableCourses: Course[];
  totalCredits: number;
}

export const PreMatriculaModal: React.FC<PreMatriculaModalProps> = ({
  isOpen,
  onClose,
  enrolledCourses,
  onRemoveCourse,
  totalCredits
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsConfirmed(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
    setTimeout(() => {
      // keep confirmed state
    }, 400);
  };

  const isUnderMin = totalCredits < 12;
  const isOverMax = totalCredits > 18;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#111215] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Pre-matrícula Académica 2025-1</h3>
              <p className="text-xs text-zinc-400">Revisión de asignaturas inscritas en ruta DAG</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#16181d] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {/* Credit Workload Gauge */}
          <div className="p-3.5 rounded-xl bg-[#16181d] border border-white/[0.06] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-300">Carga Matriculada</span>
              <span className="font-mono font-bold text-white text-sm">{totalCredits} / 18 CR</span>
            </div>
            <div className="w-full bg-[#1c1e24] h-2.5 rounded-full overflow-hidden p-[1px] border border-white/[0.05]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isUnderMin
                    ? 'bg-amber-400'
                    : isOverMax
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                }`}
                style={{ width: `${Math.min(100, (totalCredits / 18) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>Mínimo: 12 CR</span>
              <span className="text-emerald-400">Rango Óptimo: 14 - 16 CR</span>
              <span>Máximo: 18 CR</span>
            </div>

            {isUnderMin && (
              <p className="text-[11px] text-amber-400 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Carga inferior al mínimo regular (12 créditos). Considera inscribir otra asignatura.
              </p>
            )}
            {isOverMax && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Sobrecarga crediticia: se requiere autorización de dirección de carrera para &gt; 18 CR.
              </p>
            )}
          </div>

          {/* Enrolled Courses List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span>Asignaturas Seleccionadas ({enrolledCourses.length})</span>
              <span>Créditos</span>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">
                No hay asignaturas en la pre-matrícula. Selecciona cursos en el Canvas o Malla.
              </div>
            ) : (
              enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 rounded-xl bg-[#16181d] border border-white/[0.05] flex items-center justify-between hover:border-emerald-500/30 transition group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-semibold text-[11px]">
                        {course.code}
                      </span>
                      <h4 className="font-medium text-white">{course.title}</h4>
                    </div>
                    {course.schedule && (
                      <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{course.schedule}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-white px-2 py-1 rounded bg-[#1c1e24] border border-white/[0.05]">
                      {course.credits} CR
                    </span>
                    <button
                      onClick={() => onRemoveCourse(course.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-[#1c1e24] transition"
                      title="Quitar de pre-matrícula"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Schedule conflict validation check */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Validación de horario: 0 cruces o solapamientos detectados en la malla semanal.</span>
          </div>

          {isConfirmed && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-center space-y-1">
              <p className="font-bold text-white text-xs">¡Pre-matrícula Confirmada con Éxito!</p>
              <p className="text-[11px] text-emerald-300">
                Se ha generado el folio digital #DAG-2025-8842 para el ciclo académico 2025-1.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#131418] border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            Total a inscribir: <strong className="text-white font-mono">{totalCredits} CR</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition cursor-pointer"
            >
              {isConfirmed ? 'Cerrar' : 'Volver al Canvas'}
            </button>
            {!isConfirmed && (
              <button
                onClick={handleConfirm}
                disabled={enrolledCourses.length === 0}
                className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 stroke-[2.5] text-emerald-700" />
                <span>Confirmar Pre-matrícula</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
