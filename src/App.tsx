import React, { useState, useMemo } from 'react';
import { INITIAL_COURSES, TOTAL_CREDITS, TOTAL_SEMESTRES } from './data/curriculumData';
import { Course } from './types/curriculum';
import { TopHeader } from './components/TopHeader';
import { LeftDock } from './components/LeftDock';
import { CanvasArea } from './components/CanvasArea';
import { InspectorSidebar } from './components/InspectorSidebar';
import { PreMatriculaModal } from './components/PreMatriculaModal';
import { CuellosBotellaModal } from './components/CuellosBotellaModal';
import { HistoryModal } from './components/HistoryModal';
import { CoursesCatalogModal } from './components/CoursesCatalogModal';
import { SemesterOnboardingModal } from './components/SemesterOnboardingModal';

export default function App() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [isSemesterOnboardingOpen, setIsSemesterOnboardingOpen] = useState(true);
  const [currentSemester, setCurrentSemester] = useState(TOTAL_SEMESTRES[0] ?? 1);
  const [hasSelectedCourse, setHasSelectedCourse] = useState(false);

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
  const [isPreMatriculaModalOpen, setIsPreMatriculaModalOpen] = useState<boolean>(false);
  const [isBottlenecksModalOpen, setIsBottlenecksModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const theme: 'dark' = 'dark';

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

  const handleConfirmCurrentSemester = (semester: number) => {
    setCurrentSemester(semester);
    setCourses(
      INITIAL_COURSES.map((course) => ({
        ...course,
        status: course.semester < semester ? 'Aprobado' : 'Disponible',
        grade: undefined
      }))
    );
    setEnrolledCourseIds([]);
    const firstCourseInSemester = INITIAL_COURSES.find((course) => course.semester === semester);
    if (firstCourseInSemester) setSelectedCourseId(firstCourseInSemester.id);
    setIsSemesterOnboardingOpen(false);
  };

  return (
    <div className="app-shell h-screen w-screen flex flex-col overflow-hidden dark">
      {/* Top Header Navigation */}
      <TopHeader />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col overflow-hidden relative" data-purpose="workspace-body">
        <LeftDock
          onOpenBottlenecks={() => setIsBottlenecksModalOpen(true)}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onOpenCoursesCatalog={() => setIsCatalogModalOpen(true)}
        />

        <div className="flex-1 flex overflow-hidden relative">
          <CanvasArea
            courses={coursesWithPrerequisiteStatus}
            selectedCourseId={selectedCourseId}
            currentSemester={currentSemester}
            showUnlockRoute={hasSelectedCourse}
            onSelectCourse={(id) => {
              setSelectedCourseId(id);
              setHasSelectedCourse(true);
              if (!isInspectorOpen) setIsInspectorOpen(true);
            }}
            enrolledCourseIds={enrolledCourseIds}
            theme={theme}
          />

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
      </div>

      {/* Modals & Dialogs */}
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
          setHasSelectedCourse(true);
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
          setHasSelectedCourse(true);
          setIsInspectorOpen(true);
        }}
      />

      {isSemesterOnboardingOpen && (
        <SemesterOnboardingModal
          courses={INITIAL_COURSES}
          semesters={TOTAL_SEMESTRES}
          onConfirm={handleConfirmCurrentSemester}
        />
      )}
    </div>
  );
}
