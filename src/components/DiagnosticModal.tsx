import React, { useState } from 'react';
import { Sliders, Zap, X, CheckCircle, AlertCircle } from 'lucide-react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiagnostic: (settings: {
    semester: number;
    hasRetakes: boolean;
    intensityWorkload: 'light' | 'standard' | 'intense';
    trackFocus: 'multimedia' | 'software' | 'gamedev';
  }) => void;
  currentSemester: number;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  onApplyDiagnostic,
  currentSemester = 3
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(currentSemester);
  const [hasRetakes, setHasRetakes] = useState<boolean>(false);
  const [workload, setWorkload] = useState<'light' | 'standard' | 'intense'>('standard');
  const [trackFocus, setTrackFocus] = useState<'multimedia' | 'software' | 'gamedev'>('multimedia');
  const [isSolving, setIsSolving] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSolving(true);
    setTimeout(() => {
      setIsSolving(false);
      onApplyDiagnostic({
        semester: selectedSemester,
        hasRetakes,
        intensityWorkload: workload,
        trackFocus
      });
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-200"
      data-purpose="diagnostic-dialog"
      id="diagnostic-modal"
    >
      <div
        className="w-full max-w-lg bg-[#111215] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="diagnostic-modal-content"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Diagnóstico de Trayectoria DAG</h3>
              <p className="text-xs text-zinc-400">Calibración previa del motor curricular</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#16181d] transition cursor-pointer"
            id="close-diagnostic-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Question 1: Semester Selector */}
          <div>
            <label className="block font-medium text-zinc-200 mb-2">
              1. ¿En qué semestre te encuentras o vas a cursar?
            </label>
            <div className="grid grid-cols-4 gap-2" id="semester-pills">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSelectedSemester(sem)}
                  className={`py-2 rounded-lg text-center font-mono transition text-xs cursor-pointer ${
                    selectedSemester === sem
                      ? 'bg-emerald-500 text-[#0b0c0e] font-bold border border-emerald-400 shadow-sm'
                      : 'bg-[#16181d] hover:bg-[#1c1e24] text-zinc-300 border border-white/[0.05]'
                  }`}
                >
                  {sem}° Sem
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Academic Status */}
          <div>
            <label className="block font-medium text-zinc-200 mb-2">
              2. ¿Has reprobado o retirado asignaturas anteriormente?
            </label>
            <div className="space-y-2">
              <label
                onClick={() => setHasRetakes(false)}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition ${
                  !hasRetakes
                    ? 'bg-[#16181d] border border-emerald-500/40 ring-1 ring-emerald-500/30'
                    : 'bg-[#16181d]/80 border border-white/[0.05] hover:bg-[#16181d]'
                }`}
              >
                <input
                  type="radio"
                  name="academic_status"
                  checked={!hasRetakes}
                  onChange={() => setHasRetakes(false)}
                  className="text-emerald-500 focus:ring-emerald-500 h-4 w-4 bg-[#111215] border-zinc-700"
                />
                <div className="ml-3">
                  <span className="block text-xs font-semibold text-white">
                    Al día (Sin asignaturas pendientes)
                  </span>
                  <span className="block text-[11px] text-zinc-400">
                    Ruta estándar sin rezago de prerrequisitos.
                  </span>
                </div>
              </label>

              <label
                onClick={() => setHasRetakes(true)}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition ${
                  hasRetakes
                    ? 'bg-[#16181d] border border-amber-500/40 ring-1 ring-amber-500/30'
                    : 'bg-[#16181d]/80 border border-white/[0.05] hover:bg-[#16181d]'
                }`}
              >
                <input
                  type="radio"
                  name="academic_status"
                  checked={hasRetakes}
                  onChange={() => setHasRetakes(true)}
                  className="text-emerald-500 focus:ring-emerald-500 h-4 w-4 bg-[#111215] border-zinc-700"
                />
                <div className="ml-3">
                  <span className="block text-xs font-semibold text-white">
                    Con pendientes o asignaturas retiradas
                  </span>
                  <span className="block text-[11px] text-zinc-400">
                    El algoritmo DAG priorizará cuellos de botella críticos y desbloqueos inmediatos.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Question 3: Workload capacity */}
          <div>
            <label className="block font-medium text-zinc-200 mb-2">
              3. Intensidad de carga crediticia sugerida
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWorkload('light')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                  workload === 'light'
                    ? 'bg-[#1c1e24] border-cyan-400 text-white'
                    : 'bg-[#16181d] border-white/[0.05] text-zinc-400'
                }`}
              >
                <span className="font-semibold block text-xs">Ligera (12 CR)</span>
                <span className="text-[10px] text-zinc-400">3 materias / Ritmo cómodo</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkload('standard')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                  workload === 'standard'
                    ? 'bg-[#1c1e24] border-emerald-400 text-white'
                    : 'bg-[#16181d] border-white/[0.05] text-zinc-400'
                }`}
              >
                <span className="font-semibold block text-xs">Óptima (14 CR)</span>
                <span className="text-[10px] text-emerald-400">Recomendada por DAG</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkload('intense')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                  workload === 'intense'
                    ? 'bg-[#1c1e24] border-violet-400 text-white'
                    : 'bg-[#16181d] border-white/[0.05] text-zinc-400'
                }`}
              >
                <span className="font-semibold block text-xs">Intensa (18 CR)</span>
                <span className="text-[10px] text-zinc-400">5 materias / Aceleración</span>
              </button>
            </div>
          </div>

          {/* Question 4: Specialization Focus */}
          <div>
            <label className="block font-medium text-zinc-200 mb-2">
              4. Área de Énfasis Curricular Preferente
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTrackFocus('multimedia')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                  trackFocus === 'multimedia'
                    ? 'bg-[#1c1e24] border-violet-400 text-white'
                    : 'bg-[#16181d] border-white/[0.05] text-zinc-400'
                }`}
              >
                <span className="font-semibold block text-xs">Gráficos & Render</span>
                <span className="text-[10px] text-violet-400">3D, GLSL, WebGL</span>
              </button>

              <button
                type="button"
                onClick={() => setTrackFocus('software')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                  trackFocus === 'software'
                    ? 'bg-[#1c1e24] border-cyan-400 text-white'
                    : 'bg-[#16181d] border-white/[0.05] text-zinc-400'
                }`}
              >
                <span className="font-semibold block text-xs">Sistemas & Backend</span>
                <span className="text-[10px] text-cyan-400">Arquitectura, DBs</span>
              </button>

              <button
                type="button"
                onClick={() => setTrackFocus('gamedev')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                  trackFocus === 'gamedev'
                    ? 'bg-[#1c1e24] border-emerald-400 text-white'
                    : 'bg-[#16181d] border-white/[0.05] text-zinc-400'
                }`}
              >
                <span className="font-semibold block text-xs">Videojuegos & VR</span>
                <span className="text-[10px] text-emerald-400">Engines, 6DoF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#131418] border-t border-white/[0.08] flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition cursor-pointer"
            id="cancel-diagnostic-btn"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSolving}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0b0c0e] font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            id="submit-diagnostic-btn"
          >
            {isSolving ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 text-[#0b0c0e]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Resolviendo DAG...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Generar Ruta Óptima (DAG)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
