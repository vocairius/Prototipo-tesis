import React from 'react';
import { Course } from '../types/curriculum';
import { Check, CheckCircle2, ChevronRight, BookOpen, Clock, UserCheck } from 'lucide-react';

interface InspectorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | undefined;
  allCourses: Course[];
  enrolledCourseIds: string[];
  onToggleEnrollCourse: (courseId: string) => void;
  totalCompletedCredits: number;
  totalDegreeCredits: number;
  enrolledCredits: number;
  onConfirmPreMatricula: () => void;
  theme: 'dark' | 'light';
}

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  isOpen,
  selectedCourse,
  allCourses,
  enrolledCourseIds,
  onToggleEnrollCourse,
  totalCompletedCredits,
  totalDegreeCredits,
  enrolledCredits,
  onConfirmPreMatricula,
  theme
}) => {
  if (!isOpen) return null;

  const isEnrolled = selectedCourse ? enrolledCourseIds.includes(selectedCourse.id) : false;
  const isApproved = selectedCourse?.status === 'Aprobado';
  const isBlocked = selectedCourse?.status === 'Bloqueado';

  const progressPercent = ((totalCompletedCredits / totalDegreeCredits) * 100).toFixed(1);

  // Find prerequisite details
  const prereqDetails = (selectedCourse?.prerequisites || []).map((pId) => {
    const found = allCourses.find((c) => c.id === pId);
    return {
      id: pId,
      title: found?.title || pId,
      status: found?.status || 'Bloqueado',
      grade: found?.grade || '--'
    };
  });

  // Find unlocks details
  const unlocksDetails = (selectedCourse?.unlocks || []).map((uId) => {
    const found = allCourses.find((c) => c.id === uId);
    return {
      id: uId,
      title: found?.title || uId,
      semester: found?.semester || 0
    };
  });

  return (
    <aside
      className={`w-80 h-full border-l border-white/[0.08] flex flex-col shrink-0 z-20 shadow-2xl transition-panel ${
        theme === 'dark' ? 'bg-[#131418]' : 'bg-[#eff4ff]'
      }`}
      data-purpose="inspector-sidebar"
      id="inspector-sidebar"
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Inspector de Malla</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">DAG-ACTIVE</span>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Metrics Overview Section */}
        <div className="space-y-3" data-purpose="metrics-summary">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Progreso Total de Carrera</span>
            <span className="text-white font-mono font-medium">
              {totalCompletedCredits} / {totalDegreeCredits} CR ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#1c1e24] h-2 rounded-full overflow-hidden p-[1px] border border-white/[0.05]">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="p-2.5 rounded-xl bg-[#16181d] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-400 block">Carga Sugerida</span>
              <span className="text-sm font-semibold text-emerald-400 font-mono">{enrolledCredits} CR</span>
              <span className="text-[10px] text-zinc-500 block">4 asignaturas óptimas</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#16181d] border border-white/[0.05]">
              <span className="text-[10px] text-zinc-400 block">Semestre Proyectado</span>
              <span className="text-sm font-semibold text-white font-mono">3° Nivel</span>
              <span className="text-[10px] text-zinc-500 block">Plan de 8 periodos</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06]" />

        {/* Dynamic Selected Course Details */}
        {selectedCourse ? (
          <div className="space-y-4" data-purpose="node-details-card">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold block">
                  {selectedCourse.code}
                </span>
                <h2 className="text-sm font-semibold text-white mt-0.5 leading-snug">{selectedCourse.title}</h2>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  isApproved
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : isEnrolled
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    : isBlocked
                    ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {selectedCourse.status.toUpperCase()}
              </span>
            </div>

            {/* Meta Badges */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 rounded-md bg-[#16181d] text-zinc-300 border border-white/[0.05]">
                Créditos: <strong className="text-white font-mono">{selectedCourse.credits} CR</strong>
              </span>
              <span className="px-2 py-1 rounded-md bg-[#16181d] text-zinc-300 border border-white/[0.05]">
                Tipo: <strong className="text-white">{selectedCourse.type}</strong>
              </span>
              <span className="px-2 py-1 rounded-md bg-[#16181d] text-zinc-300 border border-white/[0.05]">
                Calificación:{' '}
                <strong className="text-emerald-400 font-mono">
                  {selectedCourse.grade ? `${selectedCourse.grade}${isApproved ? '/10' : ''}` : 'Pendiente'}
                </strong>
              </span>
            </div>

            {/* Description Box */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-zinc-400">Descripción del Módulo</span>
              <p className="text-xs text-zinc-300 leading-relaxed bg-[#16181d]/80 p-3 rounded-xl border border-white/[0.04]">
                {selectedCourse.description}
              </p>
            </div>

            {/* Professor & Schedule if available */}
            {selectedCourse.schedule && (
              <div className="p-3 rounded-xl bg-[#16181d]/50 border border-white/[0.04] space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedCourse.schedule}</span>
                </div>
                {selectedCourse.professor && (
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <UserCheck className="w-3.5 h-3.5 text-violet-400" />
                    <span>{selectedCourse.professor}</span>
                  </div>
                )}
              </div>
            )}

            {/* Course Graph Dependencies Breakdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-medium text-zinc-400">Dependencias DAG</span>
              <div className="space-y-1.5 text-xs">
                {prereqDetails.length > 0 ? (
                  prereqDetails.map((prereq) => (
                    <div
                      key={prereq.id}
                      className="p-2 rounded-lg bg-[#16181d] flex items-center justify-between border border-white/[0.03]"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            prereq.status === 'Aprobado' ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        <span className="text-zinc-300">
                          Prerrequisito: {prereq.id} ({prereq.title.split(' ')[0]})
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {prereq.status === 'Aprobado' ? `Cumplido (${prereq.grade})` : 'Pendiente'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-2 rounded-lg bg-[#16181d] text-zinc-400 text-xs">
                    Sin prerrequisitos (Nivel Inicial)
                  </div>
                )}

                {unlocksDetails.length > 0 &&
                  unlocksDetails.map((unlock) => (
                    <div
                      key={unlock.id}
                      className="p-2 rounded-lg bg-[#16181d] flex items-center justify-between border border-white/[0.03]"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-zinc-300">Desbloquea: {unlock.id}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {unlock.semester ? `Semestre ${unlock.semester}` : 'Próximo ciclo'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Enroll / State Toggle Action */}
            {!isApproved && !isBlocked && (
              <button
                onClick={() => onToggleEnrollCourse(selectedCourse.id)}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  isEnrolled
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-[#0b0c0e] shadow-emerald-500/20'
                    : 'bg-[#1c1e24] hover:bg-[#232630] text-emerald-400 border border-emerald-500/40'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{isEnrolled ? 'Inscrito en Ruta Sugerida' : 'Inscribir en Pre-matrícula'}</span>
              </button>
            )}

            {isApproved && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Asignatura Aprobada ({selectedCourse.credits} CR acreditados)</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-zinc-500 text-xs">
            Selecciona un nodo del grafo para inspeccionar sus dependencias y estado de aprobación.
          </div>
        )}
      </div>

      {/* Inspector Footer Action */}
      <div className="p-4 border-t border-white/[0.08] bg-[#111215]/60 shrink-0" data-purpose="inspector-footer">
        <button
          onClick={onConfirmPreMatricula}
          className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition flex items-center justify-between shadow active:scale-95 cursor-pointer"
        >
          <span>Confirmar Pre-matrícula</span>
          <span className="bg-zinc-300 text-zinc-900 px-2 py-0.5 rounded text-[11px] font-mono">
            {enrolledCredits} CR
          </span>
        </button>
      </div>
    </aside>
  );
};
