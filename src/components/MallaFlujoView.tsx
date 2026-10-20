import React, { useMemo, useState } from 'react';
import { Course } from '../types/curriculum';
import { CheckCircle2, Lock, Filter, Search, Sparkles } from 'lucide-react';

interface MallaFlujoViewProps {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  enrolledCourseIds: string[];
  theme: 'dark' | 'light';
}

export const MallaFlujoView: React.FC<MallaFlujoViewProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  enrolledCourseIds,
  theme
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Los ciclos del plan se derivan de los semestres presentes en la base de datos.
  const semesters = useMemo(
    () => [...new Set(courses.map((course) => course.semester))].sort((a, b) => a - b),
    [courses]
  );

  const filteredCourses = courses.filter((c) => {
    if (filterType !== 'all') {
      if (filterType === 'approved' && c.status !== 'Aprobado') return false;
      if (filterType === 'enrolled' && !enrolledCourseIds.includes(c.id)) return false;
      if (filterType === 'multimedia' && !c.type.includes('Multimedia')) return false;
      if (filterType === 'core' && !c.type.includes('Obligatorio')) return false;
      if (filterType === 'bottlenecks' && !c.isBottleneck) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className={`flex-1 h-full overflow-y-auto p-6 ${theme === 'dark' ? 'bg-[#0b0c0e]' : 'bg-[#f8f9ff]'}`}>
      {/* Header Controls & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Malla Flujo Curricular (Plan 2024)</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {semesters.length} Periodos Académicos
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vista secuencial cronológica con balance de carga y verificación de prerrequisitos por ciclo.
          </p>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar asignatura o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#16181d] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center bg-[#131418] p-1 rounded-xl border border-white/[0.08] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterType === 'all' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('approved')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterType === 'approved' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Aprobados
            </button>
            <button
              onClick={() => setFilterType('enrolled')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterType === 'enrolled' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              En Ruta / Pre-matrícula
            </button>
            <button
              onClick={() => setFilterType('multimedia')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterType === 'multimedia' ? 'bg-violet-500/20 text-violet-300 font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Multimedia
            </button>
            <button
              onClick={() => setFilterType('bottlenecks')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterType === 'bottlenecks' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cuellos de Botella
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Grid of Semesters */}
      <div className="overflow-x-auto pb-6">
        <div
          className="grid gap-4 min-w-[1550px]"
          style={{ gridTemplateColumns: `repeat(${semesters.length}, minmax(0, 1fr))` }}
        >
          {semesters.map((sem) => {
            const semCourses = filteredCourses.filter((c) => c.semester === sem);
            const cicloCompleto = courses.filter((c) => c.semester === sem);
            const semCredits = cicloCompleto.reduce((acc, c) => acc + c.credits, 0);
            const aprobado =
              cicloCompleto.length > 0 && cicloCompleto.every((c) => c.status === 'Aprobado');
            const enCurso = cicloCompleto.some((c) => enrolledCourseIds.includes(c.id));

            return (
              <div
                key={sem}
                className="flex flex-col bg-[#111215]/80 rounded-2xl border border-white/[0.06] p-3 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="pb-3 mb-3 border-b border-white/[0.08] flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white text-xs">Semestre {sem}</h3>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {aprobado ? 'Superado' : enCurso ? 'Actual' : 'Futuro'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16181d] text-zinc-300 border border-white/[0.05]">
                    {semCredits} CR
                  </span>
                </div>

                {/* Courses in this semester */}
                <div className="space-y-3 flex-1">
                  {semCourses.map((course) => {
                    const isSelected = selectedCourseId === course.id;
                    const isEnrolled = enrolledCourseIds.includes(course.id);
                    const isApproved = course.status === 'Aprobado';

                    return (
                      <div
                        key={course.id}
                        onClick={() => onSelectCourse(course.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition transform hover:-translate-y-0.5 ${
                          isSelected
                            ? 'bg-[#1c1e24] border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                            : isApproved
                            ? 'bg-[#16181d] border-emerald-500/40 hover:border-emerald-400'
                            : isEnrolled
                            ? 'bg-[#16181d] border-2 border-emerald-400 shadow-md'
                            : course.isBottleneck
                            ? 'bg-[#16181d] border-amber-500/50 shadow-md'
                            : course.status === 'Bloqueado'
                            ? 'bg-[#111215] border-white/[0.04] opacity-70 hover:opacity-100'
                            : 'bg-[#16181d] border-white/[0.08] hover:border-white/[0.2]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <span
                            className={`font-mono text-[10px] uppercase font-semibold ${
                              course.colorTheme === 'amber'
                                ? 'text-amber-400'
                                : course.colorTheme === 'violet'
                                ? 'text-violet-400'
                                : course.colorTheme === 'cyan'
                                ? 'text-cyan-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {course.code}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400 bg-[#111215] px-1 rounded">
                            {course.credits} CR
                          </span>
                        </div>

                        <h4 className="font-medium text-white text-xs leading-snug line-clamp-2 mb-2">
                          {course.title}
                        </h4>

                        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                          {isApproved ? (
                            <span className="text-emerald-400 font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Nota: {course.grade}
                            </span>
                          ) : isEnrolled ? (
                            <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Pre-matriculado
                            </span>
                          ) : course.status === 'Bloqueado' ? (
                            <span className="text-zinc-500 font-mono flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Bloqueado
                            </span>
                          ) : (
                            <span className="text-zinc-400 font-mono">Disponible</span>
                          )}

                          {course.isBottleneck && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px]">
                              CRÍTICO
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
