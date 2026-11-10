import React, { useMemo, useState } from 'react';
import { BookOpenCheck, Check } from 'lucide-react';
import { Course } from '../types/curriculum';

interface SemesterOnboardingModalProps {
  courses: Course[];
  semesters: number[];
  onConfirm: (semester: number) => void;
}

export const SemesterOnboardingModal: React.FC<SemesterOnboardingModalProps> = ({
  courses,
  semesters,
  onConfirm
}) => {
  const [selectedSemester, setSelectedSemester] = useState(semesters[0] ?? 1);

  const completedCoursesCount = useMemo(
    () => courses.filter((course) => course.semester < selectedSemester).length,
    [courses, selectedSemester]
  );

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#303030]/75 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="semester-onboarding-title"
      data-purpose="semester-onboarding"
    >
      <div className="w-full max-w-lg bg-[#111215] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/[0.08] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c4ee53]/15 border border-[#c4ee53]/30 flex items-center justify-center text-[#c4ee53]">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 id="semester-onboarding-title" className="text-base font-semibold text-white">
              ¿En qué semestre vas?
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Personalicemos tu malla académica</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Marcaremos como completadas las materias de los semestres anteriores. Las del semestre que
            selecciones y los siguientes quedarán pendientes.
          </p>

          <div className="grid grid-cols-4 gap-2">
            {semesters.map((semester) => (
              <button
                key={semester}
                type="button"
                aria-pressed={selectedSemester === semester}
                onClick={() => setSelectedSemester(semester)}
                className={`py-3 rounded-xl text-center font-mono text-xs transition cursor-pointer border ${
                  selectedSemester === semester
                    ? 'bg-[#c4ee53] text-[#1e1e1e] font-bold border-[#c4ee53] shadow-sm'
                    : 'bg-[#16181d] hover:bg-[#1c1e24] text-zinc-300 border-white/[0.07]'
                }`}
              >
                {semester}° semestre
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-[#16181d] border border-white/[0.06] p-3 flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#c4ee53] shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Se marcarán <strong className="text-white">{completedCoursesCount} materias</strong> como
              completadas. No asignaremos calificaciones.
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => onConfirm(selectedSemester)}
            className="w-full py-3 rounded-xl bg-[#c4ee53] hover:bg-[#d2f47d] text-[#1e1e1e] font-semibold text-sm transition cursor-pointer"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
