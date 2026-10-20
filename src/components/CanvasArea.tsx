import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Course } from '../types/curriculum';
import { Minus, Plus, RotateCcw, Lock } from 'lucide-react';

interface CanvasAreaProps {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  enrolledCourseIds: string[];
  suggestedCourseIds: string[];
  theme: 'dark' | 'light';
  onToggleEnrollCourse: (courseId: string) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  enrolledCourseIds,
  suggestedCourseIds,
  theme
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Node positions map so users can drag nodes if desired
  const [positions, setPositions] = useState<{ [id: string]: { x: number; y: number } }>(() => {
    const initial: { [id: string]: { x: number; y: number } } = {};
    courses.forEach((c) => {
      initial[c.id] = { ...c.position };
    });
    return initial;
  });

  // Track dragged node
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update positions if courses change
  useEffect(() => {
    setPositions((prev) => {
      const updated = { ...prev };
      courses.forEach((c) => {
        if (!updated[c.id]) {
          updated[c.id] = { ...c.position };
        }
      });
      return updated;
    });
  }, [courses]);

  // Handle Canvas Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking canvas background (not a node)
    if ((e.target as HTMLElement).closest('.graph-card')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    } else if (draggingNodeId) {
      const newX = (e.clientX - pan.x) / zoom - dragOffset.x;
      const newY = (e.clientY - pan.y) / zoom - dragOffset.y;
      setPositions((prev) => ({
        ...prev,
        [draggingNodeId]: { x: Math.max(0, Math.round(newX)), y: Math.max(0, Math.round(newY)) }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    onSelectCourse(courseId);
    setDraggingNodeId(courseId);
    const pos = positions[courseId] || { x: 0, y: 0 };
    setDragOffset({
      x: (e.clientX - pan.x) / zoom - pos.x,
      y: (e.clientY - pan.y) / zoom - pos.y
    });
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(1)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(1)));
  const handleRecenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node dimension constants
  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 100;

  // Compute Edge Paths dynamically based on current node positions
  const edges = useMemo(() => {
    const list = [
      { from: 'CC-101', to: 'CC-102', type: 'approved', dash: true },
      { from: 'CC-102', to: 'CC-201', type: 'approved-gradient', label: 'Req = Aprobado (100%)', badgePos: { x: 0.5, y: 0.35 } },
      { from: 'CC-102', to: 'CC-202', type: 'dashed-neutral' },
      { from: 'MAT-102', to: 'MUL-201', type: 'warning-gradient', label: 'Cuello de Botella', isBottleneck: true, badgePos: { x: 0.45, y: 0.1 } },
      { from: 'CC-201', to: 'MUL-201', type: 'faint-green' },
      { from: 'CC-201', to: 'CC-301', type: 'solid-green', label: 'Status = Óptimo (2025-1)', badgePos: { x: 0.5, y: -0.2 } },
      { from: 'MUL-201', to: 'MUL-302', type: 'dashed-rose' }
    ];

    return list.map((edge) => {
      const fromPos = positions[edge.from] || { x: 0, y: 0 };
      const toPos = positions[edge.to] || { x: 0, y: 0 };

      // Outgoing port is right-middle of source
      const x1 = fromPos.x + NODE_WIDTH;
      const y1 = fromPos.y + NODE_HEIGHT / 2;

      // Incoming port is left-middle of target
      const x2 = toPos.x;
      const y2 = toPos.y + NODE_HEIGHT / 2;

      // Curvature control points
      const dx = Math.max(40, (x2 - x1) * 0.5);
      const cp1x = x1 + dx;
      const cp1y = y1;
      const cp2x = x2 - dx;
      const cp2y = y2;

      const pathData = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;

      // Calculate approximate mid point for label
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      return {
        ...edge,
        x1,
        y1,
        x2,
        y2,
        pathData,
        midX,
        midY
      };
    });
  }, [positions]);

  // Highlight check
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const isNodeConnectedToSelected = (courseId: string) => {
    if (!selectedCourse) return false;
    if (selectedCourse.id === courseId) return true;
    if (selectedCourse.prerequisites.includes(courseId)) return true;
    if (selectedCourse.unlocks.includes(courseId)) return true;
    return false;
  };

  return (
    <main
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`flex-1 h-full relative overflow-hidden select-none cursor-grab active:cursor-grabbing ${
        theme === 'dark' ? 'bg-[#0b0c0e] bg-dot-grid' : 'bg-[#f8f9ff] bg-dot-grid-light'
      }`}
      data-purpose="node-graph-canvas"
      id="graph-viewport"
    >
      {/* Zoomable & Pannable Virtual Graph Area */}
      <div
        className="w-full h-full transform-gpu transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        <div className="min-w-[1400px] min-h-[850px] relative py-12 px-20">
          {/* SVG Vector Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradApproved" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="lineGradWarning" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.85" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Render dynamic Bezier edges */}
            {edges.map((e, idx) => {
              const isSourceSelected = selectedCourseId === e.from;
              const isTargetSelected = selectedCourseId === e.to;
              const isEdgeHighlighted = isSourceSelected || isTargetSelected;

              let strokeColor = '#10b981';
              let strokeWidth = 2;
              let dashArray = '';
              let strokeOpacity = isEdgeHighlighted ? 1 : 0.8;

              if (e.type === 'approved-gradient') {
                strokeColor = 'url(#lineGradApproved)';
                strokeWidth = 2.5;
              } else if (e.type === 'warning-gradient') {
                strokeColor = 'url(#lineGradWarning)';
                strokeWidth = 2.5;
              } else if (e.type === 'dashed-neutral') {
                strokeColor = '#2e323e';
                strokeWidth = 1.5;
                dashArray = '3 3';
              } else if (e.type === 'dashed-rose') {
                strokeColor = '#f43f5e';
                strokeWidth = 1.8;
                dashArray = '4 4';
              } else if (e.type === 'faint-green') {
                strokeColor = '#10b981';
                strokeWidth = 2;
                strokeOpacity = 0.35;
              } else if (e.dash) {
                dashArray = '4 3';
              }

              return (
                <g key={`edge-${idx}`}>
                  <path
                    d={e.pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isEdgeHighlighted ? strokeWidth + 1 : strokeWidth}
                    strokeDasharray={dashArray}
                    strokeOpacity={strokeOpacity}
                    className="transition-all duration-200"
                  />
                  {/* Endpoint connection dot */}
                  <circle
                    cx={e.x2}
                    cy={e.y2}
                    r={isEdgeHighlighted ? 4.5 : 3.5}
                    fill={e.type === 'dashed-rose' ? '#f43f5e' : '#06b6d4'}
                    className="transition-all"
                  />
                </g>
              );
            })}
          </svg>

          {/* Condition Tag Pills along SVG lines */}
          {/* Pill: Req = Aprobado (100%) */}
          {positions['CC-201'] && (
            <div
              className="absolute z-10 px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 shadow pointer-events-none transition-all"
              style={{
                top: `${(positions['CC-102']?.y || 130) + 85}px`,
                left: `${(positions['CC-201']?.x || 690) - 78}px`
              }}
            >
              Req = Aprobado (100%)
            </div>
          )}

          {/* Pill: Cuello de Botella */}
          {positions['MAT-102'] && (
            <div
              className="absolute z-10 px-2.5 py-0.5 rounded bg-amber-950/90 border border-amber-500/50 text-[10px] font-mono text-amber-300 shadow flex items-center gap-1 pointer-events-none transition-all"
              style={{
                top: `${(positions['MAT-102']?.y || 330) + 65}px`,
                left: `${(positions['MAT-102']?.x || 40) + 410}px`
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Cuello de Botella</span>
            </div>
          )}

          {/* Pill: Status = Óptimo (2025-1) */}
          {positions['CC-301'] && (
            <div
              className="absolute z-10 px-2 py-0.5 rounded bg-[#131418] border border-white/[0.1] text-[10px] font-mono text-zinc-300 shadow pointer-events-none transition-all"
              style={{
                top: `${(positions['CC-201']?.y || 230) + 30}px`,
                left: `${(positions['CC-201']?.x || 690) + 275}px`
              }}
            >
              Status = Óptimo (2025-1)
            </div>
          )}

          {/* ==================== GRAPH NODES ==================== */}
          {courses
            .filter((c) => positions[c.id])
            .map((course) => {
              const pos = positions[course.id];
              const isSelected = selectedCourseId === course.id;
              const isEnrolled = enrolledCourseIds.includes(course.id);
              const isSuggested = suggestedCourseIds.includes(course.id);
              const isConnected = isNodeConnectedToSelected(course.id);

              // Styling per course state
              let borderClass = 'border-white/[0.08]';
              let glowClass = '';
              let badgeColor = 'bg-zinc-800 text-zinc-400 border-zinc-700';

              if (course.isBottleneck) {
                borderClass = 'border-amber-500/50 hover:border-amber-400';
                glowClass = 'glow-warning';
                badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
              } else if (isSuggested || isEnrolled || course.status === 'Sugerido') {
                borderClass = 'border-2 border-emerald-400';
                glowClass = 'glow-active';
                badgeColor = 'bg-emerald-400 text-[#0b0c0e] font-bold font-mono';
              } else if (course.status === 'Aprobado') {
                borderClass = 'border-emerald-500/50 hover:border-emerald-400';
                badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
              } else if (course.status === 'Bloqueado') {
                borderClass = 'border-zinc-800/80';
              }

              // Color theme for shortCode badge (P1, P2, PO, etc.)
              let shortBadgeBg = 'bg-zinc-800 text-zinc-300 border-zinc-700';
              if (course.colorTheme === 'emerald') {
                shortBadgeBg = 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
              } else if (course.colorTheme === 'cyan') {
                shortBadgeBg = 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400';
              } else if (course.colorTheme === 'amber') {
                shortBadgeBg = 'bg-amber-500/20 border-amber-500/40 text-amber-400';
              } else if (course.colorTheme === 'violet') {
                shortBadgeBg = 'bg-violet-500/20 border-violet-500/40 text-violet-400';
              }

              return (
                <div
                  key={course.id}
                  id={`node-${course.id.toLowerCase()}`}
                  onMouseDown={(e) => handleNodeMouseDown(e, course.id)}
                  style={{
                    top: `${pos.y}px`,
                    left: `${pos.x}px`,
                    width: `${NODE_WIDTH}px`
                  }}
                  className={`graph-card absolute rounded-2xl p-4 shadow-xl cursor-pointer transition duration-150 transform hover:-translate-y-0.5 group ${
                    theme === 'dark' ? 'bg-[#16181d]' : 'bg-white shadow-sm'
                  } ${borderClass} ${glowClass} ${
                    isSelected
                      ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0b0c0e] z-30'
                      : isConnected
                      ? 'opacity-100 z-20'
                      : 'opacity-90 hover:opacity-100 z-10'
                  }`}
                  data-code={course.code}
                  data-credits={course.credits}
                  data-title={course.title}
                  data-status={course.status}
                  data-grade={course.grade}
                  data-purpose="graph-node"
                >
                  {/* Left Connection Port */}
                  {course.semester > 1 && (
                    <span
                      className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 ${
                        theme === 'dark' ? 'border-[#111215]' : 'border-white'
                      } ${
                        course.status === 'Aprobado'
                          ? 'bg-emerald-500'
                          : isEnrolled || isSuggested
                          ? 'bg-emerald-400'
                          : 'bg-zinc-600'
                      }`}
                    />
                  )}

                  {/* Right Connection Port */}
                  {course.semester < 8 && (
                    <span
                      className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 group-hover:scale-125 transition ${
                        theme === 'dark' ? 'border-[#111215]' : 'border-white'
                      } ${
                        course.isBottleneck
                          ? 'bg-amber-400'
                          : course.status === 'Aprobado'
                          ? 'bg-emerald-500'
                          : isEnrolled || isSuggested
                          ? 'bg-emerald-400'
                          : 'bg-zinc-600'
                      }`}
                    />
                  )}

                  {/* Node Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center font-mono text-xs font-bold ${shortBadgeBg}`}
                      >
                        {course.shortCode}
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider font-semibold block ${
                            course.colorTheme === 'amber'
                              ? 'text-amber-400'
                              : course.colorTheme === 'cyan'
                              ? 'text-cyan-400'
                              : course.colorTheme === 'violet'
                              ? 'text-violet-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          Semestre {course.semester} • {course.credits} CR
                        </span>
                        <h4
                          className={`text-xs font-semibold leading-tight ${
                            theme === 'dark' ? 'text-white' : 'text-zinc-900'
                          }`}
                        >
                          {course.title}
                        </h4>
                      </div>
                    </div>

                    {/* Tag / Badge */}
                    {course.status === 'Bloqueado' ? (
                      <Lock className="w-3.5 h-3.5 text-zinc-500 mt-0.5" />
                    ) : (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${badgeColor}`}>
                        {course.tag || (course.status === 'Aprobado' ? 'OK' : 'DISP')}
                      </span>
                    )}
                  </div>

                  {/* Node Footer */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                    {course.status === 'Aprobado' ? (
                      <>
                        <span>
                          Nota: <strong className="text-white font-mono">{course.grade}/10</strong>
                        </span>
                        <span className="text-emerald-400 font-mono font-medium">Aprobado</span>
                      </>
                    ) : course.isBottleneck ? (
                      <>
                        <span>
                          Desbloquea: <strong className="text-amber-300 font-mono">4 Cursos</strong>
                        </span>
                        <span className="text-emerald-400 font-mono font-medium">Aprobado</span>
                      </>
                    ) : isEnrolled || course.status === 'Inscrito' ? (
                      <>
                        <span className="text-zinc-400 truncate max-w-[120px]">
                          Req: <span className="text-zinc-200 font-mono">{course.prerequisites.join(', ')}</span>
                        </span>
                        <span className="text-emerald-400 font-mono font-medium">Inscrito ({course.credits} CR)</span>
                      </>
                    ) : isSuggested || course.status === 'Sugerido' ? (
                      <>
                        <span className="flex items-center gap-1 text-emerald-300 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Seleccionado
                        </span>
                        <span className="text-white font-mono font-medium">Prioridad Alta</span>
                      </>
                    ) : course.status === 'Bloqueado' ? (
                      <>
                        <span className="truncate max-w-[140px]">
                          Req: <strong className="text-zinc-400 font-mono">{course.prerequisites.join(', ')}</strong>
                        </span>
                        <span className="text-zinc-500 font-mono">Bloqueado</span>
                      </>
                    ) : (
                      <>
                        <span>
                          Prerreq: <strong className="text-zinc-300 font-mono">{course.prerequisites[0]}</strong>
                        </span>
                        <span className="text-zinc-400 font-mono">Desbloqueado</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Floating Canvas Controls (Bottom-left) */}
      <div
        className="absolute bottom-6 left-20 z-20 flex items-center bg-[#111215]/90 backdrop-blur border border-white/[0.1] rounded-xl px-2 py-1.5 shadow-xl space-x-2 text-xs"
        data-purpose="canvas-zoom-controls"
      >
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-lg hover:bg-[#16181d] flex items-center justify-center text-zinc-400 hover:text-white transition active:scale-95 cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono text-[11px] text-zinc-300 px-1 min-w-[36px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-lg hover:bg-[#16181d] flex items-center justify-center text-zinc-400 hover:text-white transition active:scale-95 cursor-pointer"
          title="Zoom in"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

        <button
          onClick={handleRecenter}
          className="px-2 py-1 rounded-md text-[11px] text-zinc-400 hover:text-white hover:bg-[#16181d] transition flex items-center gap-1 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Recenter</span>
        </button>
      </div>
    </main>
  );
};
