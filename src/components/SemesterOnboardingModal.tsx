import React, { useMemo, useState } from 'react';
import { AlertCircle, BookOpenCheck, Check, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { Course } from '../types/curriculum';

interface SemesterOnboardingModalProps {
  courses: Course[];
  semesters: number[];
  onExplore: () => void;
  onConfirm: (semester: number, failedCourseIds: string[]) => void;
}

type OnboardingStep = 'choice' | 'semester' | 'failed' | 'failed-courses';

export const SemesterOnboardingModal: React.FC<SemesterOnboardingModalProps> = ({
  courses,
  semesters,
  onExplore,
  onConfirm
}) => {
  const [step, setStep] = useState<OnboardingStep>('choice');
  const [selectedSemester, setSelectedSemester] = useState(semesters[0] ?? 1);
  const [selectedFailedSemesters, setSelectedFailedSemesters] = useState<number[]>([]);
  const [selectedFailedCourseIds, setSelectedFailedCourseIds] = useState<string[]>([]);

  const previousSemesters = useMemo(
    () => semesters.filter((semester) => semester < selectedSemester),
    [semesters, selectedSemester]
  );
  const coursesInSelectedSemesters = useMemo(
    () => courses.filter((course) => selectedFailedSemesters.includes(course.semester)),
    [courses, selectedFailedSemesters]
  );

  const toggleFailedSemester = (semester: number) => {
    setSelectedFailedSemesters((previous) =>
      previous.includes(semester)
        ? previous.filter((item) => item !== semester)
        : [...previous, semester].sort((a, b) => a - b)
    );
    setSelectedFailedCourseIds((previous) =>
      previous.filter((id) => courses.find((course) => course.id === id)?.semester !== semester)
    );
  };

  const toggleFailedCourse = (courseId: string) => {
    setSelectedFailedCourseIds((previous) =>
      previous.includes(courseId)
        ? previous.filter((id) => id !== courseId)
        : [...previous, courseId]
    );
  };

  const handleExplore = () => {
    onExplore();
  };

  const handleNoFailedCourses = () => {
    onConfirm(selectedSemester, []);
  };

  const handleConfirmSimulation = () => {
    onConfirm(selectedSemester, selectedFailedCourseIds);
  };

  const title =
    step === 'choice'
      ? '¿Qué quieres hacer hoy?'
      : step === 'semester'
        ? '¿Qué semestre vas a cursar?'
        : step === 'failed'
          ? '¿Has perdido alguna materia?'
          : '¿Qué materias perdiste?';

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#303030]/75 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="semester-onboarding-title"
      data-purpose="semester-onboarding"
    >
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#252526] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/[0.08] flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#c4ee53]/15 border border-[#c4ee53]/30 flex items-center justify-center text-[#c4ee53]">
            {step === 'choice' ? <Compass className="w-5 h-5" /> : <BookOpenCheck className="w-5 h-5" />}
          </div>
          <div>
            <h2 id="semester-onboarding-title" className="text-base font-semibold text-white">
              {title}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {step === 'choice'
                ? 'Elige cómo quieres consultar tu malla curricular.'
                : step === 'failed-courses'
                  ? `Selecciona semestres anteriores y las materias que debes repetir para cursar el ${selectedSemester}° semestre.`
                  : 'Personalicemos tu malla académica.'}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {step === 'choice' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStep('semester')}
                className="min-h-36 p-5 rounded-xl border border-[#c4ee53]/50 bg-[#c4ee53]/10 hover:bg-[#c4ee53]/15 text-left transition cursor-pointer"
              >
                <BookOpenCheck className="w-6 h-6 text-[#c4ee53] mb-4" />
                <span className="block text-sm font-semibold text-white">Simular matrícula</span>
                <span className="block mt-1 text-xs text-zinc-400">
                  Calcula las materias disponibles según tu avance y tus prerrequisitos.
                </span>
              </button>
              <button
                type="button"
                onClick={handleExplore}
                className="min-h-36 p-5 rounded-xl border border-white/[0.1] bg-[#2d2d30] hover:bg-[#383838] text-left transition cursor-pointer"
              >
                <Compass className="w-6 h-6 text-[#8da2ff] mb-4" />
                <span className="block text-sm font-semibold text-white">Explorar malla</span>
                <span className="block mt-1 text-xs text-zinc-400">
                  Consulta el plan completo sin iniciar una simulación.
                </span>
              </button>
            </div>
          )}

          {step === 'semester' && (
            <>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Selecciona el semestre que planeas cursar. Después podrás indicar las materias pendientes de
                semestres anteriores.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {semesters.map((semester) => (
                  <button
                    key={semester}
                    type="button"
                    aria-pressed={selectedSemester === semester}
                    onClick={() => setSelectedSemester(semester)}
                    className={`py-3 rounded-xl text-center font-mono text-xs transition cursor-pointer border ${
                      selectedSemester === semester
                        ? 'bg-[#c4ee53] text-[#1e1e1e] font-bold border-[#c4ee53]'
                        : 'bg-[#2d2d30] hover:bg-[#383838] text-zinc-300 border-white/[0.07]'
                    }`}
                  >
                    {semester}° semestre
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'failed' && (
            <>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Las materias que no aprobaste quedarán pendientes y se tendrán en cuenta al calcular qué puedes
                matricular.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStep('failed-courses')}
                  disabled={previousSemesters.length === 0}
                  className="p-4 rounded-xl border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/15 disabled:opacity-40 text-left transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <AlertCircle className="w-5 h-5 text-amber-300 mb-3" />
                  <span className="block text-sm font-semibold text-white">Sí, he perdido materias</span>
                  <span className="block mt-1 text-xs text-zinc-400">Elegir semestre y asignaturas.</span>
                </button>
                <button
                  type="button"
                  onClick={handleNoFailedCourses}
                  className="p-4 rounded-xl border border-[#c4ee53]/40 bg-[#c4ee53]/10 hover:bg-[#c4ee53]/15 text-left transition cursor-pointer"
                >
                  <Check className="w-5 h-5 text-[#c4ee53] mb-3" />
                  <span className="block text-sm font-semibold text-white">No, ninguna</span>
                  <span className="block mt-1 text-xs text-zinc-400">Continuar con la simulación.</span>
                </button>
              </div>
              {previousSemesters.length === 0 && (
                <p className="text-xs text-zinc-500">No hay semestres anteriores para seleccionar.</p>
              )}
            </>
          )}

          {step === 'failed-courses' && (
            <>
              {previousSemesters.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {previousSemesters.map((semester) => {
                    const isSelected = selectedFailedSemesters.includes(semester);
                    return (
                      <button
                        key={semester}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleFailedSemester(semester)}
                        className={`py-2 rounded-lg text-xs border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#4e6cef]/20 text-[#aebcff] border-[#4e6cef]/60'
                            : 'bg-[#2d2d30] text-zinc-300 border-white/[0.08] hover:bg-[#383838]'
                        }`}
                      >
                        Sem. {semester}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">No hay semestres anteriores en este plan.</p>
              )}

              {selectedFailedSemesters.length > 0 ? (
                <div className="space-y-4">
                  {selectedFailedSemesters.map((semester) => (
                    <section key={semester} className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Semestre {semester}
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {coursesInSelectedSemesters
                          .filter((course) => course.semester === semester)
                          .map((course) => {
                            const isSelected = selectedFailedCourseIds.includes(course.id);
                            return (
                              <button
                                key={course.id}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => toggleFailedCourse(course.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#4e6cef]/15 border-[#4e6cef]/60'
                                    : 'bg-[#2d2d30] border-white/[0.08] hover:bg-[#383838]'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-[#4e6cef] border-[#4e6cef] text-white'
                                      : 'border-zinc-500'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                </span>
                                <span>
                                  <span className="block text-xs font-medium text-white">{course.title}</span>
                                  <span className="block text-[10px] text-zinc-400">
                                    {course.code} · {course.credits} créditos
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">
                  Elige uno o más semestres para ver las materias que puedes marcar como perdidas.
                </p>
              )}
              {selectedFailedCourseIds.length === 0 && (
                <p className="text-xs text-amber-300">Selecciona al menos una materia perdida para continuar.</p>
              )}
            </>
          )}
        </div>

        {step !== 'choice' && (
          <div className="p-5 border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setStep(step === 'failed-courses' ? 'failed' : 'choice')}
              className="px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-[#383838] transition cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Atrás
            </button>
            {step === 'semester' && (
              <button
                type="button"
                onClick={() => setStep('failed')}
                className="px-4 py-2.5 rounded-lg bg-[#c4ee53] hover:bg-[#d2f47d] text-[#1e1e1e] font-semibold text-xs transition cursor-pointer flex items-center gap-1"
              >
                Continuar
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {step === 'failed-courses' && (
              <button
                type="button"
                onClick={handleConfirmSimulation}
                disabled={selectedFailedCourseIds.length === 0}
                className="px-4 py-2.5 rounded-lg bg-[#c4ee53] hover:bg-[#d2f47d] disabled:opacity-40 text-[#1e1e1e] font-semibold text-xs transition cursor-pointer disabled:cursor-not-allowed"
              >
                Ver mi ruta ({selectedFailedCourseIds.length})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
