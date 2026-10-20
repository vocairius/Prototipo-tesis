import React, { useState } from 'react';
import { Course } from '../types/curriculum';
import { AlertTriangle, GitFork, ArrowRight, ShieldAlert, X, Zap } from 'lucide-react';

interface CuellosBotellaModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export const CuellosBotellaModal: React.FC<CuellosBotellaModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectCourse
}) => {
  const [selectedDelayCourse, setSelectedDelayCourse] = useState<string>('CC-201');

  if (!isOpen) return null;

  // Identify bottleneck courses
  const bottleneckCourses = courses.filter((c) => c.isBottleneck || c.unlocks.length >= 2);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#111215] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-amber-950/20">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Análisis de Cuellos de Botella Curriculares (DAG)
              </h3>
              <p className="text-xs text-zinc-400">
                Identificación de bifurcaciones críticas y riesgo de retraso en titulación
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#16181d] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto text-xs">
          {/* Explanation Banner */}
          <div className="p-3.5 rounded-xl bg-[#16181d] border border-white/[0.06] text-zinc-300 leading-relaxed">
            Un <strong>cuello de botella</strong> es una asignatura que desbloquea múltiples ramas del plan de estudios.
            Reprobar o postergar un nodo crítico puede retrasar hasta <strong>2 semestres completos</strong> la fecha de graduación debido a cadenas de prerequisitos lineales.
          </div>

          {/* Critical Crossroads List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Nodos de Alto Impacto Detectados
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bottleneckCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => {
                    onSelectCourse(course.id);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-[#16181d] border border-white/[0.08] hover:border-amber-400/60 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-amber-400">
                      {course.code}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                      Desbloquea {course.unlocks.length} cursos
                    </span>
                  </div>

                  <h5 className="font-medium text-white text-xs group-hover:text-amber-200 transition">
                    {course.title}
                  </h5>

                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {course.bottleneckReason || `Requisito indispensable para avanzar hacia Semestre ${course.semester + 1}.`}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500">Estado: {course.status}</span>
                    <span className="text-amber-400 font-mono flex items-center gap-1 group-hover:translate-x-1 transition">
                      Ver en Canvas <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delay Impact Simulator */}
          <div className="p-4 rounded-xl bg-[#16181d] border border-white/[0.06] space-y-3">
            <h4 className="font-semibold text-white text-xs flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-violet-400" />
              Simulador de Impacto por Postergación
            </h4>
            <p className="text-[11px] text-zinc-400">
              ¿Qué ocurre si no matriculo <strong>POO (CC-201)</strong> o <strong>Computación Gráfica (MUL-201)</strong> este ciclo?
            </p>

            <div className="p-3 rounded-lg bg-[#111215] border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-rose-400 font-semibold text-[11px]">Riesgo de Cascada: ALTO</span>
                <span className="font-mono text-zinc-400 text-[10px]">+1 Semestre Proyectado</span>
              </div>
              <p className="text-[11px] text-zinc-300">
                Si postergas POO este ciclo 2025-1, Arquitectura de Software quedará bloqueada en 2025-2, retrasando Sistemas Operativos y el inicio del Proyecto de Grado I a 2027.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#131418] border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs transition"
          >
            Entendido, volver
          </button>
        </div>
      </div>
    </div>
  );
};
