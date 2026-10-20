import React from 'react';
import { Settings, Eye, Sliders, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showDotGrid: boolean;
  setShowDotGrid: (val: boolean) => void;
  showLabels: boolean;
  setShowLabels: (val: boolean) => void;
  smoothCurves: boolean;
  setSmoothCurves: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  showDotGrid,
  setShowDotGrid,
  showLabels,
  setShowLabels,
  smoothCurves,
  setSmoothCurves
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111215] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Configuración del Motor DAG</h3>
              <p className="text-xs text-zinc-400">Preferencias visuales y de renderizado del grafo</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#16181d] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#16181d] border border-white/[0.05] cursor-pointer">
            <div>
              <span className="font-medium text-white block">Matriz de Puntos (Dot Grid)</span>
              <span className="text-[11px] text-zinc-400">Mostrar cuadrícula técnica de 24px de fondo</span>
            </div>
            <input
              type="checkbox"
              checked={showDotGrid}
              onChange={(e) => setShowDotGrid(e.target.checked)}
              className="rounded bg-[#111215] border-zinc-700 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#16181d] border border-white/[0.05] cursor-pointer">
            <div>
              <span className="font-medium text-white block">Etiquetas Flotantes de Conexión</span>
              <span className="text-[11px] text-zinc-400">Mostrar "Cuello de Botella", "Req = Aprobado" en los arcos</span>
            </div>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="rounded bg-[#111215] border-zinc-700 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#16181d] border border-white/[0.05] cursor-pointer">
            <div>
              <span className="font-medium text-white block">Curvatura Bézier Suave</span>
              <span className="text-[11px] text-zinc-400">Calcular curvas de interpolación cúbica de grado 3</span>
            </div>
            <input
              type="checkbox"
              checked={smoothCurves}
              onChange={(e) => setSmoothCurves(e.target.checked)}
              className="rounded bg-[#111215] border-zinc-700 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
            />
          </label>
        </div>

        <div className="p-4 bg-[#131418] border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs transition"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
