import React, { useState, useMemo } from 'react';
import { INITIAL_COURSES, TOTAL_CREDITS } from './data/curriculumData';
import { Course } from './types/curriculum';
import { TopHeader } from './components/TopHeader';
import { LeftDock } from './components/LeftDock';
import { CanvasArea } from './components/CanvasArea';
import { InspectorSidebar } from './components/InspectorSidebar';
import { MallaFlujoView } from './components/MallaFlujoView';
import { AuditoriaGradoView } from './components/AuditoriaGradoView';
import { DiagnosticModal } from './components/DiagnosticModal';
import { PreMatriculaModal } from './components/PreMatriculaModal';
import { CuellosBotellaModal } from './components/CuellosBotellaModal';
import { HistoryModal } from './components/HistoryModal';
import { CoursesCatalogModal } from './components/CoursesCatalogModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [activeView, setActiveView] = useState<'canvas' | 'malla' | 'auditoria'>('canvas');

  // Abrir la malla con una materia que se pueda aprobar y consultar.
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    () =>
      INITIAL_COURSES.find(
        (course) => course.status !== 'Bloqueado' && course.prerequisites.length === 0
      )?.id ?? INITIAL_COURSES[0].id
  );

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  // Inspector Sidebar Open
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Modals state
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState<boolean>(false);
  const [isPreMatriculaModalOpen, setIsPreMatriculaModalOpen] = useState<boolean>(false);
  const [isBottlenecksModalOpen, setIsBottlenecksModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Settings
  const [showDotGrid, setShowDotGrid] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [smoothCurves, setSmoothCurves] = useState<boolean>(true);

  const approvedCourseIds = useMemo(
    () => new Set(courses.filter((course) => course.status === 'Aprobado').map((course) => course.id)),
    [courses]
  );

  const coursesWithPrerequisiteStatus = useMemo(
    () =>
      courses.map((course) => {
        if (course.status === 'Aprobado' || course.status === 'Bloqueado') return course;

        const prerequisitesSatisfied = course.prerequisites.every((id) => approvedCourseIds.has(id));
        const status: Course['status'] = prerequisitesSatisfied
          ? enrolledCourseIds.includes(course.id)
            ? 'Inscrito'
            : 'Disponible'
          : 'Bloqueado';
        return {
          ...course,
          status
        };
      }),
    [approvedCourseIds, courses, enrolledCourseIds]
  );

  // Computed metrics
  const totalCompletedCredits = useMemo(() => {
    return coursesWithPrerequisiteStatus
      .filter((c) => c.status === 'Aprobado')
      .reduce((sum, c) => sum + c.credits, 0);
  }, [coursesWithPrerequisiteStatus]);

  const totalDegreeCredits = TOTAL_CREDITS;

  const enrolledCredits = useMemo(() => {
    return coursesWithPrerequisiteStatus
      .filter((c) => enrolledCourseIds.includes(c.id))
      .reduce((sum, c) => sum + c.credits, 0);
  }, [coursesWithPrerequisiteStatus, enrolledCourseIds]);

  const selectedCourse = useMemo(() => {
    return coursesWithPrerequisiteStatus.find((c) => c.id === selectedCourseId) || coursesWithPrerequisiteStatus[0];
  }, [coursesWithPrerequisiteStatus, selectedCourseId]);

  const enrolledCourses = useMemo(() => {
    return coursesWithPrerequisiteStatus.filter((c) => enrolledCourseIds.includes(c.id));
  }, [coursesWithPrerequisiteStatus, enrolledCourseIds]);

  const availableCoursesToEnroll = useMemo(() => {
    return coursesWithPrerequisiteStatus.filter((c) => c.status === 'Disponible');
  }, [coursesWithPrerequisiteStatus]);

  const handleToggleEnrollCourse = (courseId: string) => {
    setEnrolledCourseIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      }
      const course = coursesWithPrerequisiteStatus.find((item) => item.id === courseId);
      return course?.status === 'Disponible' ? [...prev, courseId] : prev;
    });
  };

  const handleToggleCourseApproval = (courseId: string) => {
    const course = coursesWithPrerequisiteStatus.find((item) => item.id === courseId);
    if (
      !course ||
      (course.status !== 'Aprobado' && course.status !== 'Disponible' && course.status !== 'Inscrito')
    ) {
      return;
    }

    setCourses((previous) =>
      previous.map((item) =>
        item.id === courseId
          ? { ...item, status: item.status === 'Aprobado' ? 'Disponible' : 'Aprobado' }
          : item
      )
    );
    if (course.status === 'Aprobado') {
      const approvedAfterRevert = new Set(
        courses.filter((item) => item.id !== courseId && item.status === 'Aprobado').map((item) => item.id)
      );
      setEnrolledCourseIds((previous) =>
        previous.filter((id) => {
          const enrolledCourse = courses.find((item) => item.id === id);
          return enrolledCourse?.prerequisites.every((prerequisiteId) =>
            approvedAfterRevert.has(prerequisiteId)
          );
        })
      );
    } else {
      setEnrolledCourseIds((previous) => previous.filter((id) => id !== courseId));
    }
  };

  // Apply diagnostic settings
  const handleApplyDiagnostic = (settings: {
    semester: number;
    hasRetakes: boolean;
    intensityWorkload: 'light' | 'standard' | 'intense';
    trackFocus: 'multimedia' | 'software' | 'gamedev';
  }) => {
    setTimeout(() => {
      // La carga de créditos se toma del semestre solicitado, respetando el
      // límite de créditos según la intensidad elegida.
      const limite = settings.intensityWorkload === 'light' ? 12 : settings.intensityWorkload === 'intense' ? 18 : 14;
      const delSemestre = coursesWithPrerequisiteStatus.filter(
        (course) => course.semester === settings.semester && course.status === 'Disponible'
      );

      let acumulado = 0;
      const seleccionadas: string[] = [];
      for (const course of delSemestre) {
        if (acumulado + course.credits > limite) continue;
        seleccionadas.push(course.id);
        acumulado += course.credits;
      }

      setEnrolledCourseIds(seleccionadas);
      if (seleccionadas.length > 0) setSelectedCourseId(seleccionadas[0]);
      setActiveView('canvas');
    }, 700);
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Header Navigation */}
      <TopHeader
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenDiagnostic={() => setIsDiagnosticModalOpen(true)}
        enrolledCredits={enrolledCredits}
        onOpenPreMatricula={() => setIsPreMatriculaModalOpen(true)}
        onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
        isInspectorOpen={isInspectorOpen}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative" data-purpose="workspace-body">
        {/* Left Floating Dock */}
        <LeftDock
          courses={coursesWithPrerequisiteStatus}
          onSelectView={setActiveView}
          onOpenBottlenecks={() => setIsBottlenecksModalOpen(true)}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onOpenCoursesCatalog={() => setIsCatalogModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          unreadCount={2}
        />

        {/* Center Content View Switcher */}
        {activeView === 'canvas' && (
          <CanvasArea
            courses={coursesWithPrerequisiteStatus}
            selectedCourseId={selectedCourseId}
            onSelectCourse={(id) => {
              setSelectedCourseId(id);
              if (!isInspectorOpen) setIsInspectorOpen(true);
            }}
            enrolledCourseIds={enrolledCourseIds}
            theme={theme}
          />
        )}

        {activeView === 'malla' && (
          <MallaFlujoView
            courses={coursesWithPrerequisiteStatus}
            selectedCourseId={selectedCourseId}
            onSelectCourse={(id) => {
              setSelectedCourseId(id);
              if (!isInspectorOpen) setIsInspectorOpen(true);
            }}
            enrolledCourseIds={enrolledCourseIds}
            theme={theme}
          />
        )}

        {activeView === 'auditoria' && (
          <AuditoriaGradoView
            courses={coursesWithPrerequisiteStatus}
            enrolledCourseIds={enrolledCourseIds}
            totalCompletedCredits={totalCompletedCredits}
            totalDegreeCredits={totalDegreeCredits}
            enrolledCredits={enrolledCredits}
            theme={theme}
          />
        )}

        {/* Right Inspector Sidebar */}
        <InspectorSidebar
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          selectedCourse={selectedCourse}
          allCourses={coursesWithPrerequisiteStatus}
          enrolledCourseIds={enrolledCourseIds}
          onToggleEnrollCourse={handleToggleEnrollCourse}
          onToggleCourseApproval={handleToggleCourseApproval}
          totalCompletedCredits={totalCompletedCredits}
          totalDegreeCredits={totalDegreeCredits}
          enrolledCredits={enrolledCredits}
          onConfirmPreMatricula={() => setIsPreMatriculaModalOpen(true)}
          theme={theme}
        />
      </div>

      {/* Modals & Dialogs */}
      <DiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        onApplyDiagnostic={handleApplyDiagnostic}
        currentSemester={3}
      />

      <PreMatriculaModal
        isOpen={isPreMatriculaModalOpen}
        onClose={() => setIsPreMatriculaModalOpen(false)}
        enrolledCourses={enrolledCourses}
        onRemoveCourse={handleToggleEnrollCourse}
        onAddCourse={handleToggleEnrollCourse}
        availableCourses={availableCoursesToEnroll}
        totalCredits={enrolledCredits}
      />

      <CuellosBotellaModal
        isOpen={isBottlenecksModalOpen}
        onClose={() => setIsBottlenecksModalOpen(false)}
        courses={coursesWithPrerequisiteStatus}
        onSelectCourse={(id) => {
          setSelectedCourseId(id);
          setActiveView('canvas');
          setIsInspectorOpen(true);
        }}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        courses={coursesWithPrerequisiteStatus}
      />

      <CoursesCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        courses={coursesWithPrerequisiteStatus}
        onSelectCourse={(id) => {
          setSelectedCourseId(id);
          setActiveView('canvas');
          setIsInspectorOpen(true);
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        showDotGrid={showDotGrid}
        setShowDotGrid={setShowDotGrid}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        smoothCurves={smoothCurves}
        setSmoothCurves={setSmoothCurves}
      />
    </div>
  );
}
