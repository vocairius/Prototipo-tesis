import React from 'react';
import { Course } from '../types/curriculum';
import { AlertCircle, CalendarCheck, Check, CheckCircle2, Trash2, X } from 'lucide-react';

interface PreMatriculaModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrolledCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
  totalCredits: number;
  currentSemester: number;
  blockedCourses: Course[];
  allCourses: Course[];
  isConfirmed: boolean;
  onConfirm: () => void;
}

export const PreMatriculaModal: React.FC<PreMatriculaModalProps> = ({
  isOpen,
  onClose,
  enrolledCourses,
  onRemoveCourse,
  totalCredits,
  currentSemester,
  blockedCourses,
  allCourses,
  isConfirmed,
  onConfirm
}) => {
  if (!isOpen) return null;

  const coursesById = new Map(allCourses.map((course) => [course.id, course]));

  return (
    <div
      className="fixed inset-0 z-50 bg-[#303030]/75 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="matricula-title"
    >
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-[#252526] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c4ee53]/15 border border-[#c4ee53]/30 flex items-center justify-center text-[#c4ee53]">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 id="matricula-title" className="text-sm font-semibold text-white">
                Matrícula · Semestre {currentSemester}
              </h2>
              <p className="text-xs text-zinc-400">
                Revisa las materias disponibles antes de aceptar.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#383838] transition"
            aria-label="Cerrar matrícula"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
          {isConfirmed && (
            <div
              className="matricula-success flex flex-col items-center gap-2 rounded-xl border border-[#c4ee53]/40 bg-[#c4ee53]/10 p-5 text-center"
              role="status"
              data-purpose="matricula-success"
            >
              <div className="matricula-check w-12 h-12 rounded-full bg-[#c4ee53] text-[#1e1e1e] flex items-center justify-center">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <p className="text-sm font-semibold text-white">¡Matrícula completada!</p>
              <p className="text-xs text-zinc-300">
                {enrolledCourses.length} materias quedaron inscritas para el semestre {currentSemester}.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-[#2d2d30] border border-white/[0.06] p-4">
            <div>
              <span className="block text-zinc-300 font-medium">Materias seleccionadas</span>
              <span className="text-[11px] text-zinc-500">
                {enrolledCourses.length} cursos para el semestre {currentSemester}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-lg font-bold font-mono text-white">{totalCredits} CR</span>
              <span className="text-[10px] text-zinc-500">créditos totales</span>
            </div>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="space-y-2">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 rounded-xl bg-[#2d2d30] border border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#c4ee53] font-semibold text-[11px] shrink-0">
                        {course.code}
                      </span>
                      <h3 className="font-medium text-white truncate">{course.title}</h3>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {course.semester === currentSemester ? `Semestre ${currentSemester}` : 'Materia pendiente'} ·{' '}
                      {course.credits} créditos
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs font-semibold text-white px-2 py-1 rounded bg-[#1e1e1e]">
                      {course.credits} CR
                    </span>
                    {!isConfirmed && (
                      <button
                        type="button"
                        onClick={() => onRemoveCourse(course.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-[#1e1e1e] transition"
                        title="Quitar de la matrícula"
                        aria-label={`Quitar ${course.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-5 text-zinc-400">
              No hay materias matriculables. Revisa las materias bloqueadas y sus prerrequisitos.
            </p>
          )}

          {blockedCourses.length > 0 && (
            <section className="space-y-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <AlertCircle className="w-4 h-4" />
                {blockedCourses.length} materias no disponibles por prerrequisitos
              </h3>
              <ul className="space-y-1.5">
                {blockedCourses.map((course) => {
                  const missingPrerequisites = course.prerequisites
                    .map((id) => coursesById.get(id))
                    .filter((prerequisite) => prerequisite?.status !== 'Aprobado')
                    .map((prerequisite) => prerequisite?.title ?? 'Prerrequisito pendiente');
                  return (
                    <li key={course.id} className="text-[11px] text-zinc-400">
                      <span className="text-zinc-200">{course.title}</span>
                      {missingPrerequisites.length > 0 && (
                        <span> · Falta: {missingPrerequisites.join(', ')}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        <div className="p-4 border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-zinc-300 hover:bg-[#383838] transition cursor-pointer"
          >
            {isConfirmed ? 'Cerrar' : 'Volver a la malla'}
          </button>
          {!isConfirmed && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={enrolledCourses.length === 0}
              className="px-4 py-2.5 rounded-lg bg-[#c4ee53] hover:bg-[#d2f47d] disabled:opacity-40 text-[#1e1e1e] font-semibold transition cursor-pointer disabled:cursor-not-allowed"
            >
              Aceptar matrícula · {totalCredits} CR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
