import React, { useState, useMemo } from 'react';
import { INITIAL_COURSES } from './data/curriculumData';
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

  // Currently inspected course (CC-201 by default, matching Image 1)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('CC-201');

  // Enrolled courses for upcoming term (matches exact 14 CR in Image 1: CC-201 (4), MUL-201 (4), HUM-101 (2), CC-202 (4) = 14 CR)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([
    'CC-201',
    'MUL-201',
    'HUM-101',
    'CC-202'
  ]);

  // Suggested by DAG algorithm
  const [suggestedCourseIds, setSuggestedCourseIds] = useState<string[]>([
    'CC-201',
    'MUL-201'
  ]);

  // Inspector Sidebar Open
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Modals state
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState<boolean>(false);
  const [isPreMatriculaModalOpen, setIsPreMatriculaModalOpen] = useState<boolean>(false);
  const [isBottlenecksModalOpen, setIsBottlenecksModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // DAG recalculation simulation
  const [isDagRunning, setIsDagRunning] = useState<boolean>(false);

  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Settings
  const [showDotGrid, setShowDotGrid] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [smoothCurves, setSmoothCurves] = useState<boolean>(true);

  // Computed metrics
  const totalCompletedCredits = useMemo(() => {
    return courses
      .filter((c) => c.status === 'Aprobado')
      .reduce((sum, c) => sum + c.credits, 0); // 42 CR
  }, [courses]);

  const totalDegreeCredits = 164;

  const enrolledCredits = useMemo(() => {
    return courses
      .filter((c) => enrolledCourseIds.includes(c.id))
      .reduce((sum, c) => sum + c.credits, 0); // 14 CR
  }, [courses, enrolledCourseIds]);

  const selectedCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0];
  }, [courses, selectedCourseId]);

  const enrolledCourses = useMemo(() => {
    return courses.filter((c) => enrolledCourseIds.includes(c.id));
  }, [courses, enrolledCourseIds]);

  const availableCoursesToEnroll = useMemo(() => {
    return courses.filter((c) => c.status !== 'Aprobado' && c.status !== 'Bloqueado');
  }, [courses]);

  // Toggle enroll course
  const handleToggleEnrollCourse = (courseId: string) => {
    setEnrolledCourseIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  // Run DAG Algorithm
  const handleRunDAG = () => {
    setIsDagRunning(true);
    setTimeout(() => {
      setIsDagRunning(false);
      // Topological optimization selects primary critical paths
      setSuggestedCourseIds(['CC-201', 'MUL-201', 'CC-202']);
      setSelectedCourseId('CC-201');
      setIsInspectorOpen(true);
    }, 850);
  };

  // Apply diagnostic settings
  const handleApplyDiagnostic = (settings: {
    semester: number;
    hasRetakes: boolean;
    intensityWorkload: 'light' | 'standard' | 'intense';
    trackFocus: 'multimedia' | 'software' | 'gamedev';
  }) => {
    setIsDagRunning(true);
    setTimeout(() => {
      setIsDagRunning(false);

      if (settings.intensityWorkload === 'light') {
        setEnrolledCourseIds(['CC-201', 'MUL-201', 'HUM-101']); // 10-12 CR
      } else if (settings.intensityWorkload === 'intense') {
        setEnrolledCourseIds(['CC-201', 'MUL-201', 'CC-202', 'HUM-101', 'MAT-202']); // 18 CR
      } else {
        setEnrolledCourseIds(['CC-201', 'MUL-201', 'HUM-101', 'CC-202']); // 14 CR
      }

      if (settings.trackFocus === 'multimedia') {
        setSelectedCourseId('MUL-201');
      } else {
        setSelectedCourseId('CC-201');
      }
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
        onRunDAG={handleRunDAG}
        isDagRunning={isDagRunning}
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
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={(id) => {
              setSelectedCourseId(id);
              if (!isInspectorOpen) setIsInspectorOpen(true);
            }}
            enrolledCourseIds={enrolledCourseIds}
            suggestedCourseIds={suggestedCourseIds}
            theme={theme}
            onToggleEnrollCourse={handleToggleEnrollCourse}
          />
        )}

        {activeView === 'malla' && (
          <MallaFlujoView
            courses={courses}
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
          allCourses={courses}
          enrolledCourseIds={enrolledCourseIds}
          onToggleEnrollCourse={handleToggleEnrollCourse}
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
        courses={courses}
        onSelectCourse={(id) => {
          setSelectedCourseId(id);
          setActiveView('canvas');
          setIsInspectorOpen(true);
        }}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        courses={courses}
      />

      <CoursesCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        courses={courses}
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
