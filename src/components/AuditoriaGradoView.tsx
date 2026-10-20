import React from 'react';
import { DEGREE_AUDIT_CATEGORIES } from '../data/curriculumData';
import { Award, CheckCircle, TrendingUp, Calendar, Download, Check, Sparkles, BookOpen } from 'lucide-react';

interface AuditoriaGradoViewProps {
  totalCompletedCredits: number;
  totalDegreeCredits: number;
  enrolledCredits: number;
  theme: 'dark' | 'light';
}

export const AuditoriaGradoView: React.FC<AuditoriaGradoViewProps> = ({
  totalCompletedCredits,
  totalDegreeCredits,
  enrolledCredits,
  theme
}) => {
  const percentage = ((totalCompletedCredits / totalDegreeCredits) * 100).toFixed(1);

  return (
    <div className={`flex-1 h-full overflow-y-auto p-6 max-w-6xl mx-auto space-y-6 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
      {/* Top Banner */}
      <div className="bg-[#111215] border border-white/[0.08] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h1 className="text-lg font-bold text-white font-heading">
              Auditoría de Grado y Progreso Curricular
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Licenciatura en Ingeniería en Tecnologías Multimedia • Registro Curricular 2024
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
              Estatus: Alumno Regular Activo
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-mono">
              Plan: 8 Semestres (164 Créditos)
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => alert('Generando informe curricular consolidado en formato PDF...')}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs transition flex items-center gap-2 shadow active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>Descargar Auditoría PDF</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#16181d] border border-white/[0.06] shadow space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Créditos Aprobados</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{totalCompletedCredits}</span>
            <span className="text-xs text-zinc-500 font-mono">/ {totalDegreeCredits} CR</span>
          </div>
          <div className="w-full bg-[#1c1e24] h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${percentage}%` }} />
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">{percentage}% Completado</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#16181d] border border-white/[0.06] shadow space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Promedio General (GPA)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">8.72</span>
            <span className="text-xs text-zinc-500 font-mono">/ 10.0</span>
          </div>
          <span className="text-[10px] text-zinc-400 block pt-1">
            Rendimiento sobresaliente (Percentil superior 15%)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#16181d] border border-white/[0.06] shadow space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Carga en Pre-matrícula</span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-violet-300">+{enrolledCredits}</span>
            <span className="text-xs text-zinc-500 font-mono">CR este ciclo</span>
          </div>
          <span className="text-[10px] text-zinc-400 block pt-1">
            Llegarás a {totalCompletedCredits + enrolledCredits} CR (
            {(((totalCompletedCredits + enrolledCredits) / totalDegreeCredits) * 100).toFixed(1)}%)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#16181d] border border-white/[0.06] shadow space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Graduación Estimada</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-300">2027-2</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block pt-1">
            En tiempo (0 semestres de rezago)
          </span>
        </div>
      </div>

      {/* Credit Categories Breakdown */}
      <div className="bg-[#111215] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Distribución de Créditos por Área de Conocimiento</h3>
            <p className="text-xs text-zinc-400">Requerimientos reglamentarios para obtención de grado académico</p>
          </div>
          <span className="text-xs font-mono text-zinc-400">Total: 164 Créditos</span>
        </div>

        <div className="space-y-4">
          {DEGREE_AUDIT_CATEGORIES.map((cat, idx) => {
            const compPct = Math.round((cat.completedCredits / cat.requiredCredits) * 100);
            const inProgPct = Math.round((cat.inProgressCredits / cat.requiredCredits) * 100);

            return (
              <div key={idx} className="p-3.5 rounded-xl bg-[#16181d] border border-white/[0.04] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-medium text-white">{cat.name}</span>
                  </div>
                  <div className="font-mono text-xs">
                    <span className="text-white font-semibold">{cat.completedCredits} CR</span>
                    {cat.inProgressCredits > 0 && (
                      <span className="text-emerald-400 ml-1">+{cat.inProgressCredits} CR cursando</span>
                    )}
                    <span className="text-zinc-500 ml-1">/ {cat.requiredCredits} CR ({compPct}%)</span>
                  </div>
                </div>

                {/* Multi-segment progress bar */}
                <div className="w-full bg-[#1c1e24] h-2.5 rounded-full overflow-hidden flex p-[1px]">
                  <div
                    className="h-full rounded-l-full transition-all duration-500"
                    style={{
                      width: `${compPct}%`,
                      backgroundColor: cat.color
                    }}
                  />
                  {inProgPct > 0 && (
                    <div
                      className="h-full bg-emerald-400/60 transition-all duration-500"
                      style={{ width: `${inProgPct}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Milestone Chains Checklist */}
      <div className="bg-[#111215] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-semibold text-white">
          Estatus de Cadenas de Dependencia Obligatorias
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#16181d] border border-emerald-500/30 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Cadena Matemática & Vectorial</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Cálculo Diferencial (MAT-101) y Álgebra Lineal (MAT-102) aprobados. Vía libre para Computación Gráfica.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#16181d] border border-emerald-500/30 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Cadena Algorítmica Troncal</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Prog. Básica I (9.4) y Prog. Básica II (8.8) aprobados. Requisitos satisfechos para POO y Estructuras.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#16181d] border border-cyan-500/30 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Pipeline de Gráficos por Computadora</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Computación Gráfica (MUL-201) en pre-matrícula activa. Habilitará Render 3D & Shaders para Semestre 4.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#16181d] border border-white/[0.05] flex items-start gap-3 opacity-80">
            <BookOpen className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-300">Tesis y Proyecto de Titulación</p>
              <p className="text-zinc-500 text-[11px] mt-0.5">
                Requiere 120 créditos acumulados. Programado para habilitación a partir de Semestre 7.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
