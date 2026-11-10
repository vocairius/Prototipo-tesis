import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Course } from '../types/curriculum';
import {
  BookOpen,
  Briefcase,
  Calculator,
  Camera,
  Code2,
  Database,
  FlaskConical,
  GraduationCap,
  Languages,
  Lock,
  MonitorPlay,
  Music2,
  Network,
  Palette,
  PenTool,
  Users,
  type LucideIcon,
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react';

const getCourseIcon = (title: string): LucideIcon => {
  if (/(matem|algebra|c[aá]lculo|estad[ií]stica|probabilidad|f[ií]sica)/i.test(title)) return Calculator;
  if (/(base de datos|datos)/i.test(title)) return Database;
  if (/(programaci[oó]n|computaci[oó]n|desarrollo|circuitos|electr[oó]nica)/i.test(title)) return Code2;
  if (/(ingl[eé]s|idioma)/i.test(title)) return Languages;
  if (/(dise[nñ]o|dibujo|animaci[oó]n|imagen|ilustraci[oó]n)/i.test(title)) return Palette;
  if (/(fotograf[ií]a|c[aá]mara)/i.test(title)) return Camera;
  if (/(video|multimedia|gr[aá]fica|interactiva)/i.test(title)) return MonitorPlay;
  if (/(audio|sonido|m[uú]sica)/i.test(title)) return Music2;
  if (/(proyecto|gesti[oó]n|pr[aá]ctica|empresa)/i.test(title)) return Briefcase;
  if (/(human[ií]stica|bienestar|comunicaci[oó]n)/i.test(title)) return Users;
  if (/(ciencia|qu[ií]mica)/i.test(title)) return FlaskConical;
  if (/(redes|se[nñ]ales)/i.test(title)) return Network;
  if (/(guion|escritura|literatura)/i.test(title)) return PenTool;
  if (/(ingenier[ií]a|formaci[oó]n)/i.test(title)) return GraduationCap;
  return BookOpen;
};

interface CanvasAreaProps {
  courses: Course[];
  selectedCourseId: string;
  currentSemester: number;
  showUnlockRoute: boolean;
  simulationMode: boolean;
  recommendedCourseIds: string[];
  failedCourseIds: string[];
  onSelectCourse: (courseId: string) => void;
  enrolledCourseIds: string[];
  theme: 'dark' | 'light';
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  courses,
  selectedCourseId,
  currentSemester,
  showUnlockRoute,
  simulationMode,
  recommendedCourseIds,
  failedCourseIds,
  onSelectCourse,
  enrolledCourseIds,
  theme
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

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
      const newX = (e.clientX - pan.x) / zoom - dragOffset.x + graphOffsetX - GRAPH_INSET_X;
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
    setSelectedSemester(null);
    onSelectCourse(courseId);
    setDraggingNodeId(courseId);
    const pos = positions[courseId] || { x: 0, y: 0 };
    setDragOffset({
      x: (e.clientX - pan.x) / zoom - pos.x + graphOffsetX - GRAPH_INSET_X,
      y: (e.clientY - pan.y) / zoom - pos.y
    });
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(1)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(1)));
  const handleRecenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node dimension constants
  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 150;
  const GRAPH_INSET_X = 180;

  const selectedCourse = courses.find((course) => course.id === selectedCourseId);
  const unlockRouteCourseIds = useMemo(() => {
    if (!showUnlockRoute) return new Set<string>();

    const coursesById = new Map(courses.map((course) => [course.id, course]));
    const route = new Set<string>();
    const pending = [...(coursesById.get(selectedCourseId)?.unlocks ?? [])];

    while (pending.length > 0) {
      const courseId = pending.pop();
      if (!courseId || route.has(courseId)) continue;
      route.add(courseId);
      pending.push(...(coursesById.get(courseId)?.unlocks ?? []));
    }

    return route;
  }, [courses, selectedCourseId, showUnlockRoute]);

  const simulationUnlockCourseIds = useMemo(() => {
    if (!simulationMode) return new Set<string>();

    const coursesById = new Map(courses.map((course) => [course.id, course]));
    const unlocked = new Set<string>();
    const pending = [...recommendedCourseIds];

    while (pending.length > 0) {
      const courseId = pending.pop();
      if (!courseId || unlocked.has(courseId)) continue;
      unlocked.add(courseId);
      pending.push(...(coursesById.get(courseId)?.unlocks ?? []));
    }

    return unlocked;
  }, [courses, recommendedCourseIds, simulationMode]);

  const visibleCourses = useMemo(
    () =>
      simulationMode
        ? courses.filter(
            (course) =>
              course.semester === currentSemester ||
              failedCourseIds.includes(course.id) ||
              (course.semester > currentSemester && simulationUnlockCourseIds.has(course.id))
          )
        : courses,
    [courses, currentSemester, failedCourseIds, simulationMode, simulationUnlockCourseIds]
  );
  const visibleCourseIds = useMemo(
    () => new Set(visibleCourses.map((course) => course.id)),
    [visibleCourses]
  );
  const graphOffsetX = useMemo(
    () =>
      visibleCourses.length > 0
        ? Math.min(...visibleCourses.map((course) => positions[course.id]?.x ?? course.position.x))
        : 0,
    [positions, visibleCourses]
  );
  const semesterColumns = useMemo(
    () =>
      [...new Set(courses.map((course) => course.semester))]
        .sort((a, b) => a - b)
        .map((semester) => {
          const semesterCourses = courses.filter((course) => course.semester === semester);
          return {
            semester,
            courseCount: semesterCourses.length,
            x: Math.min(
              ...semesterCourses.map(
                (course) => positions[course.id]?.x ?? course.position.x
              )
            )
          };
        }),
    [courses, positions]
  );

  useEffect(() => {
    if (!simulationMode || !containerRef.current) return;

    const focusCourses = courses.filter(
      (course) => course.semester === currentSemester || failedCourseIds.includes(course.id)
    );
    if (focusCourses.length === 0) return;

    const focusPositions = focusCourses.map((course) => course.position);
    const minX = Math.min(...focusPositions.map((position) => position.x - graphOffsetX + GRAPH_INSET_X));
    const maxX = Math.max(
      ...focusPositions.map((position) => position.x - graphOffsetX + GRAPH_INSET_X + NODE_WIDTH)
    );
    const minY = Math.min(...focusPositions.map((position) => position.y));
    const maxY = Math.max(...focusPositions.map((position) => position.y + NODE_HEIGHT));
    const viewport = containerRef.current;
    const focusWidth = maxX - minX;
    const focusHeight = maxY - minY;
    const fittedZoom = Math.max(
      0.4,
      Math.min(1, (viewport.clientWidth - 80) / focusWidth, (viewport.clientHeight - 100) / focusHeight)
    );
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoom(fittedZoom);
    setPan({
      x: Math.round(viewport.clientWidth / 2 - centerX * fittedZoom),
      y: Math.round(viewport.clientHeight / 2 - centerY * fittedZoom)
    });
  }, [courses, currentSemester, failedCourseIds, graphOffsetX, simulationMode]);

  // Keep the focused semester and its unlock route framed in the virtual canvas.
  const { canvasWidth, canvasHeight } = useMemo(() => {
    const visiblePositions = visibleCourses.map(
      (course) => positions[course.id] ?? course.position
    );
    const xs = visiblePositions.map((pos) => pos.x - graphOffsetX);
    const ys = visiblePositions.map((pos) => pos.y);

    const maxX = xs.length > 0 ? Math.max(...xs) : 0;
    const maxY = ys.length > 0 ? Math.max(...ys) : 0;

    return {
      canvasWidth: Math.max(1400, maxX + GRAPH_INSET_X + NODE_WIDTH + 160),
      canvasHeight: Math.max(850, maxY + NODE_HEIGHT + 120)
    };
  }, [graphOffsetX, positions, visibleCourses]);

  // Compute Edge Paths dynamically based on current node positions
  const edges = useMemo(() => {
    // Las aristas se derivan de los prerrequisitos reales del dataset, de
    // modo que el DAG siempre refleja la malla vigente.
    const list = courses.flatMap((course) =>
      course.prerequisites
        .filter(
          (prerequisiteId) =>
            visibleCourseIds.has(prerequisiteId) &&
            visibleCourseIds.has(course.id) &&
            (!simulationMode ||
              (courses.find((item) => item.id === prerequisiteId)?.semester ?? 0) >= currentSemester)
        )
        .map((prerequisiteId) => {
          return {
            from: prerequisiteId,
            to: course.id,
            isUnlockRoute:
              (prerequisiteId === selectedCourseId || unlockRouteCourseIds.has(prerequisiteId)) &&
              (course.id === selectedCourseId || unlockRouteCourseIds.has(course.id))
          };
        })
    );

    return list.map((edge) => {
      const fromPos = positions[edge.from] || { x: 0, y: 0 };
      const toPos = positions[edge.to] || { x: 0, y: 0 };

      // Outgoing port is right-middle of source
      const x1 = fromPos.x - graphOffsetX + GRAPH_INSET_X + NODE_WIDTH;
      const y1 = fromPos.y + NODE_HEIGHT / 2;

      // Incoming port is left-middle of target
      const x2 = toPos.x - graphOffsetX + GRAPH_INSET_X;
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
  }, [
    courses,
    currentSemester,
    graphOffsetX,
    selectedCourseId,
    simulationMode,
    simulationUnlockCourseIds,
    unlockRouteCourseIds,
    visibleCourseIds
  ]);

  // Highlight check
  const isNodeConnectedToSelected = (courseId: string) => {
    if (!selectedCourse) return false;
    if (selectedCourse.id === courseId) return true;
    return unlockRouteCourseIds.has(courseId);
  };

  return (
    <main
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`flex-1 h-full relative overflow-hidden select-none cursor-grab active:cursor-grabbing ${
        theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-[#f3f3f3]'
      }`}
      data-purpose="node-graph-canvas"
      id="graph-viewport"
    >
      <div
        className="absolute top-4 left-4 z-20 flex max-w-[125px] flex-col gap-1 rounded-xl border border-white/[0.1] bg-[#111215]/90 px-3 py-2 text-xs shadow-xl backdrop-blur"
        aria-live="polite"
      >
        <span className="font-semibold text-white">
          {simulationMode ? 'Simulación' : 'Exploración'} · Semestre {currentSemester}
        </span>
        <span className="text-zinc-400">
          {simulationMode
            ? `${recommendedCourseIds.length} materias disponibles para matricular`
            : unlockRouteCourseIds.size > 0
              ? `Ruta de desbloqueo: ${unlockRouteCourseIds.size} materias`
              : showUnlockRoute
                ? 'Esta materia no desbloquea otras'
                : 'Haz clic en una materia para ver su ruta'}
        </span>
      </div>

      {/* Zoomable & Pannable Virtual Graph Area */}
      <div
        className="w-full h-full transform-gpu transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        <div
          className="relative py-12 px-20"
          style={{
            width: canvasWidth,
            height: canvasHeight
          }}
        >
          {semesterColumns.map(({ semester, courseCount, x }) => {
            const isSelected = selectedSemester === semester;
            const headerClass = isSelected
              ? 'border-[#c4ee53]/60 bg-[#c4ee53]/15 text-[#c4ee53]'
              : 'border-white/[0.08] bg-[#111215]/80 text-zinc-300';
            const headerStyle = {
              top: '8px',
              left: `${x - graphOffsetX + GRAPH_INSET_X}px`,
              width: `${NODE_WIDTH}px`
            };

            return simulationMode ? (
              <div
                key={`semester-${semester}`}
                className={`absolute z-10 flex h-8 items-center rounded-lg border px-3 text-xs font-semibold pointer-events-none ${headerClass}`}
                style={headerStyle}
              >
                Semestre {semester}
                <span className="ml-auto text-[10px] font-mono text-zinc-400">
                  {courseCount} materias
                </span>
              </div>
            ) : (
              <button
                key={`semester-${semester}`}
                type="button"
                aria-label={`Seleccionar todas las materias del semestre ${semester}`}
                aria-pressed={isSelected}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() =>
                  setSelectedSemester((previous) => (previous === semester ? null : semester))
                }
                className={`absolute z-10 flex h-8 items-center rounded-lg border px-3 text-xs font-semibold transition hover:border-[#c4ee53]/60 hover:text-[#c4ee53] ${headerClass}`}
                style={headerStyle}
              >
                Semestre {semester}
                <span className="ml-auto text-[10px] font-mono opacity-75">
                  {isSelected ? 'Seleccionadas' : `${courseCount} materias`}
                </span>
              </button>
            );
          })}

          {/* SVG Vector Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" xmlns="http://www.w3.org/2000/svg">
            {/* Render dynamic Bezier edges */}
            {edges.map((e, idx) => {
              return (
                <g key={`edge-${idx}`}>
                  <path
                    d={e.pathData}
                    fill="none"
                    stroke={e.isUnlockRoute ? '#4e6cef' : '#626267'}
                    strokeWidth={e.isUnlockRoute ? 2.5 : 1.5}
                    strokeDasharray={e.isUnlockRoute ? undefined : '3 5'}
                    strokeOpacity={e.isUnlockRoute ? 0.95 : 0.12}
                    className="transition-all duration-200"
                  />
                  {/* Endpoint connection dot */}
                  <circle
                    cx={e.x2}
                    cy={e.y2}
                    r={e.isUnlockRoute ? 4 : 3}
                    fill={e.isUnlockRoute ? '#4e6cef' : '#555b66'}
                    opacity={e.isUnlockRoute ? 1 : 0.2}
                    className="transition-all"
                  />
                </g>
              );
            })}
          </svg>

          {/* Condition Tag Pills along SVG lines */}
          {/* Pill: Req = Aprobado (100%) */}
          {selectedCourse &&
            selectedCourse.prerequisites
              .filter((id) => courses.find((c) => c.id === id)?.status === 'Aprobado')
              .slice(0, 1)
              .map((prerequisiteId) => {
                const prerequisite = courses.find((c) => c.id === prerequisiteId);
                const toPos = positions[selectedCourse.id];
                if (!prerequisite || !toPos) return null;
                return (
                  <div
                    key={`pill-aprobado-${prerequisiteId}`}
                    className="absolute z-10 px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 shadow pointer-events-none transition-all"
                    style={{
                      top: `${toPos.y + 85}px`,
                      left: `${toPos.x - graphOffsetX + GRAPH_INSET_X - 78}px`
                    }}
                  >
                    Req = Aprobado (100%)
                  </div>
                );
              })}

          {/* Pill: Cuello de Botella */}
          {visibleCourses
            .filter((course) => course.isBottleneck && positions[course.id])
            .slice(0, 1)
            .map((course) => {
              const pos = positions[course.id];
              if (!visibleCourseIds.has(course.id)) return null;
              return (
                <div
                  key={`pill-cuello-${course.id}`}
                  className="absolute z-10 px-2.5 py-0.5 rounded bg-amber-950/90 border border-amber-500/50 text-[10px] font-mono text-amber-300 shadow flex items-center gap-1 pointer-events-none transition-all"
                  style={{
                    top: `${pos.y + 65}px`,
                    left: `${pos.x - graphOffsetX + GRAPH_INSET_X + 210}px`
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Cuello de Botella</span>
                </div>
              );
            })}

          {/* ==================== GRAPH NODES ==================== */}
          {visibleCourses
            .filter((c) => positions[c.id])
            .map((course) => {
              const pos = positions[course.id];
              const isSelected = selectedCourseId === course.id;
              const isHovered = hoveredCourseId === course.id;
              const isEnrolled = enrolledCourseIds.includes(course.id);
              const isFailedCourse = failedCourseIds.includes(course.id);
              const isUpcomingUnlock =
                simulationMode &&
                course.semester > currentSemester &&
                simulationUnlockCourseIds.has(course.id);
              const isInUnlockRoute = unlockRouteCourseIds.has(course.id);
              const isRecommended = recommendedCourseIds.includes(course.id);

              // Styling per course state
              let borderClass = 'border-white/[0.08]';
              let glowClass = '';
              let badgeColor = 'bg-zinc-800 text-zinc-400 border-zinc-700';

              if (isSelected || isHovered) {
                borderClass = 'border-[#c4ee53]';
                glowClass = 'glow-active';
                badgeColor = 'bg-[#c4ee53]/20 text-[#c4ee53] border-[#c4ee53]/40';
              } else if (selectedSemester === course.semester) {
                borderClass = 'border-[#c4ee53]/70';
                glowClass = 'glow-active';
              } else if (isFailedCourse) {
                borderClass = 'border-amber-400/60';
                badgeColor = 'bg-amber-400/15 text-amber-200 border-amber-400/30';
              } else if (isInUnlockRoute) {
                borderClass = 'border-[#4e6cef]';
                badgeColor = 'bg-[#4e6cef]/20 text-[#aebcff] border-[#4e6cef]/40';
              } else if (isRecommended) {
                badgeColor = 'bg-[#c4ee53]/20 text-[#c4ee53] border-[#c4ee53]/40';
              } else if (isUpcomingUnlock) {
                badgeColor = 'bg-[#4e6cef]/20 text-[#aebcff] border-[#4e6cef]/40';
              } else if (course.isBottleneck) {
                badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
              } else if (isEnrolled || course.status === 'Inscrito') {
                badgeColor = 'bg-[#4e6cef]/20 text-[#aebcff] border-[#4e6cef]/40';
              } else if (course.status === 'Aprobado') {
                badgeColor = 'bg-[#c4ee53]/15 text-[#c4ee53] border-[#c4ee53]/30';
              }

              // Keep the icon tile neutral until a course is selected or previewed.
              let shortBadgeBg = 'bg-zinc-800 text-zinc-300 border-zinc-700';
              if (isSelected || isHovered) {
                shortBadgeBg = 'bg-[#c4ee53]/15 border-[#c4ee53]/30 text-[#c4ee53]';
              }

              return (
                <div
                  key={course.id}
                  id={`node-${course.id.toLowerCase()}`}
                  onMouseDown={(e) => handleNodeMouseDown(e, course.id)}
                  onMouseEnter={() => setHoveredCourseId(course.id)}
                  onMouseLeave={() => setHoveredCourseId(null)}
                  style={{
                    top: `${pos.y}px`,
                    left: `${pos.x - graphOffsetX + GRAPH_INSET_X}px`,
                    width: `${NODE_WIDTH}px`
                  }}
                  className={`graph-card absolute min-h-[150px] rounded-2xl p-4 shadow-xl cursor-pointer transition duration-200 transform group ${
                    theme === 'dark' ? 'bg-[#16181d]' : 'bg-white shadow-sm'
                  } ${borderClass} ${glowClass} ${
                    isSelected
                      ? 'ring-2 ring-[#4e6cef] ring-offset-2 ring-offset-[#1e1e1e] z-30'
                      : isHovered
                      ? 'graph-card-hover-preview z-40'
                      : selectedSemester === course.semester
                      ? 'opacity-100 z-20 ring-1 ring-[#c4ee53]/40'
                      : simulationMode
                      ? isRecommended || isFailedCourse
                        ? 'opacity-80 z-20'
                        : isUpcomingUnlock
                          ? 'opacity-55 z-10'
                          : 'opacity-[0.16] z-10'
                      : isNodeConnectedToSelected(course.id)
                      ? 'opacity-100 z-20'
                      : course.semester !== currentSemester
                      ? 'opacity-30 z-10'
                      : 'z-10'
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
                          ? 'bg-[#c4ee53]'
                          : isEnrolled
                          ? 'bg-[#4e6cef]'
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
                          ? 'bg-[#c4ee53]'
                          : isEnrolled
                          ? 'bg-[#4e6cef]'
                          : 'bg-zinc-600'
                      }`}
                    />
                  )}

                  {/* Node Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center ${shortBadgeBg}`}
                      >
                        {React.createElement(getCourseIcon(course.title), { className: 'w-4 h-4' })}
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider font-semibold block ${
                            course.colorTheme === 'amber'
                              ? 'text-amber-400'
                              : course.colorTheme === 'cyan'
                              ? 'text-[#4e6cef]'
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
                    {isHovered && !isSelected ? (
                      <span className="graph-hover-badge text-[9px] px-1.5 py-0.5 rounded border border-[#c4ee53]/50 bg-[#c4ee53]/15 text-[#c4ee53] font-mono">
                        PRESELECCIÓN
                      </span>
                    ) : course.status === 'Bloqueado' && !isFailedCourse ? (
                      <Lock className="w-3.5 h-3.5 text-zinc-500 mt-0.5" />
                    ) : (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${badgeColor}`}>
                        {failedCourseIds.includes(course.id)
                          ? 'REPETIR'
                          : isRecommended
                            ? course.status === 'Inscrito'
                              ? 'INSCRITA'
                              : isEnrolled
                              ? 'PREMATRICULADA'
                              : 'MATRICULAR'
                            : isUpcomingUnlock
                              ? 'SIGUIENTE'
                            : course.tag || (course.status === 'Aprobado' ? 'OK' : 'DISP')}
                      </span>
                    )}
                  </div>

                  {/* Node Footer */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                    {course.status === 'Aprobado' ? (
                      <>
                        <span>
                          {course.grade !== undefined ? (
                            <>
                              Nota: <strong className="text-white font-mono">{course.grade}/10</strong>
                            </>
                          ) : (
                            <strong className="text-white">Completada</strong>
                          )}
                        </span>
                        <span className="text-emerald-400 font-mono font-medium">Aprobado</span>
                      </>
                    ) : course.isBottleneck ? (
                      <>
                        <span>
                          Desbloquea:{' '}
                          <strong className="text-amber-300 font-mono">{course.unlocks.length} cursos</strong>
                        </span>
                        <span className="text-amber-300 font-mono font-medium">Punto clave</span>
                      </>
                    ) : isEnrolled || course.status === 'Inscrito' ? (
                      <>
                        <span className="text-zinc-400 truncate max-w-[120px]">
                          Req: <span className="text-zinc-200 font-mono">{course.prerequisites.join(', ')}</span>
                        </span>
                        <span className="text-emerald-400 font-mono font-medium">
                          {course.status === 'Inscrito' ? 'Inscrito' : 'Pre-matriculado'} ({course.credits} CR)
                        </span>
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
                          {course.prerequisites.length > 0 ? (
                            <>
                              Prerreq: <strong className="text-zinc-300 font-mono">{course.prerequisites[0]}</strong>
                            </>
                          ) : (
                            'Sin prerrequisitos'
                          )}
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
