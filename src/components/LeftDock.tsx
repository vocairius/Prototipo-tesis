import React, { useState } from 'react';
import { Network, Home, BookOpen, AlertTriangle, FileText, Bell, Settings, X, CheckCircle2 } from 'lucide-react';

interface LeftDockProps {
  onSelectView: (view: 'canvas' | 'malla' | 'auditoria') => void;
  onOpenBottlenecks: () => void;
  onOpenHistory: () => void;
  onOpenCoursesCatalog: () => void;
  onOpenSettings: () => void;
  unreadCount?: number;
}

export const LeftDock: React.FC<LeftDockProps> = ({
  onSelectView,
  onOpenBottlenecks,
  onOpenHistory,
  onOpenCoursesCatalog,
  onOpenSettings,
  unreadCount = 2
}) => {
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  return (
    <>
      <aside
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center p-2 rounded-full bg-[#111215]/90 backdrop-blur-md border border-white/[0.1] shadow-2xl space-y-3"
        data-purpose="floating-dock"
      >
        {/* Active Primary App Icon */}
        <button
          onClick={() => onSelectView('canvas')}
          className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition cursor-pointer"
          title="Red de Malla (Canvas DAG)"
        >
          <Network className="w-5 h-5" />
        </button>

        {/* Navigation item 1: Home Semestral */}
        <button
          onClick={() => onSelectView('canvas')}
          className="w-9 h-9 rounded-xl bg-[#16181d] text-zinc-300 hover:text-white hover:bg-[#1c1e24] flex items-center justify-center transition active:scale-95 cursor-pointer group relative"
          title="Home Semestral"
        >
          <Home className="w-4 h-4" />
          <span className="absolute left-12 px-2 py-1 rounded bg-[#16181d] text-white text-[11px] whitespace-nowrap shadow-lg border border-white/[0.08] opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
            Vista Semestral
          </span>
        </button>

        {/* Navigation item 2: Catálogo y Base de Conocimiento */}
        <button
          onClick={onOpenCoursesCatalog}
          className="w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-[#16181d] flex items-center justify-center transition active:scale-95 cursor-pointer group relative"
          title="Base de Conocimiento de Cursos"
        >
          <BookOpen className="w-4 h-4" />
          <span className="absolute left-12 px-2 py-1 rounded bg-[#16181d] text-white text-[11px] whitespace-nowrap shadow-lg border border-white/[0.08] opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
            Catálogo de Cursos
          </span>
        </button>

        {/* Navigation item 3: Cuellos de Botella */}
        <button
          onClick={onOpenBottlenecks}
          className="w-9 h-9 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-[#16181d] flex items-center justify-center transition active:scale-95 cursor-pointer group relative"
          title="Análisis de Cuellos de Botella"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="absolute left-12 px-2 py-1 rounded bg-[#16181d] text-white text-[11px] whitespace-nowrap shadow-lg border border-white/[0.08] opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
            Cuellos de Botella
          </span>
        </button>

        {/* Navigation item 4: Historial Académico */}
        <button
          onClick={onOpenHistory}
          className="w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-[#16181d] flex items-center justify-center transition active:scale-95 cursor-pointer group relative"
          title="Historial Académico"
        >
          <FileText className="w-4 h-4" />
          <span className="absolute left-12 px-2 py-1 rounded bg-[#16181d] text-white text-[11px] whitespace-nowrap shadow-lg border border-white/[0.08] opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
            Historial Académico
          </span>
        </button>

        {/* Separator line */}
        <div className="w-5 h-[1px] bg-zinc-800 my-1" />

        {/* Alerts / Bell */}
        <button
          onClick={() => setShowNotificationPopover(!showNotificationPopover)}
          className="w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-[#16181d] flex items-center justify-center relative transition active:scale-95 cursor-pointer"
          title="Notificaciones DAG"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2 animate-pulse" />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-[#16181d] flex items-center justify-center transition active:scale-95 cursor-pointer group relative"
          title="Configuración de Grafo"
        >
          <Settings className="w-4 h-4" />
          <span className="absolute left-12 px-2 py-1 rounded bg-[#16181d] text-white text-[11px] whitespace-nowrap shadow-lg border border-white/[0.08] opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
            Ajustes del Grafo
          </span>
        </button>

        {/* Gradient Ring User Avatar */}
        <div className="pt-1 relative">
          <div
            onClick={() => setShowProfileCard(!showProfileCard)}
            className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 cursor-pointer hover:scale-105 active:scale-95 transition"
            title="Perfil de Estudiante: Alejandro Loyola"
          >
            <div className="w-full h-full rounded-full bg-[#111215] flex items-center justify-center text-[10px] font-bold text-white font-mono">
              AL
            </div>
          </div>
        </div>
      </aside>

      {/* Notifications Popover */}
      {showNotificationPopover && (
        <div className="absolute left-18 top-1/2 -translate-y-12 z-50 w-80 bg-[#16181d] border border-white/[0.1] rounded-2xl shadow-2xl p-4 text-xs animate-in fade-in slide-in-from-left-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-3">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-violet-400" />
              Notificaciones Curriculares
            </span>
            <button
              onClick={() => setShowNotificationPopover(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#1c1e24] border border-emerald-500/30">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Prerrequisito Aprobado</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Álgebra Lineal (MAT-102) calificada con 7.9/10. Desbloqueó Computación Gráfica.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#1c1e24] border border-amber-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-300">Aviso de Cuello de Botella</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Se recomienda inscribir POO (CC-201) este ciclo para no retrasar Arquitectura en Semestre 4.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Quick Card */}
      {showProfileCard && (
        <div className="absolute left-18 bottom-12 z-50 w-72 bg-[#16181d] border border-white/[0.1] rounded-2xl shadow-2xl p-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-[#111215] rounded-full flex items-center justify-center font-bold text-white font-mono text-xs">
                  AL
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white">Alejandro Loyola</h4>
                <p className="text-[10px] text-zinc-400 font-mono">ID: 2023-MM-0842</p>
              </div>
            </div>
            <button onClick={() => setShowProfileCard(false)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Programa:</span>
              <span className="text-white font-medium">Ing. Multimedia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Nivel Proyectado:</span>
              <span className="text-emerald-400 font-mono font-medium">3° Semestre</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Promedio Ponderado:</span>
              <span className="text-cyan-400 font-mono font-bold">8.72 / 10.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Créditos Acumulados:</span>
              <span className="text-white font-mono">42 / 164 CR (25.6%)</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
