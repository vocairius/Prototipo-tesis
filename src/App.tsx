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
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [failedCourseIds, setFailedCourseIds] = useState<string[]>([]);
  const [isMatriculaAccepted, setIsMatriculaAccepted] = useState(false);
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
        if (course.status === 'Aprobado' || (!isSimulationActive && course.status === 'Bloqueado')) {
          return course;
        }

        const prerequisitesSatisfied = course.prerequisites.every((id) => approvedCourseIds.has(id));
        const isEnrolled = enrolledCourseIds.includes(course.id);
        const status: Course['status'] = prerequisitesSatisfied
          ? isEnrolled
            ? isMatriculaAccepted
              ? 'Inscrito'
              : 'Sugerido'
            : 'Disponible'
          : 'Bloqueado';
        return {
          ...course,
          status
        };
      }),
    [approvedCourseIds, courses, enrolledCourseIds, isMatriculaAccepted, isSimulationActive]
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

  const recommendedCourseIds = useMemo(
    () =>
      isSimulationActive
        ? coursesWithPrerequisiteStatus
            .filter(
              (course) =>
                (course.status === 'Disponible' ||
                  course.status === 'Sugerido' ||
                  course.status === 'Inscrito') &&
                (course.semester === currentSemester || failedCourseIds.includes(course.id))
            )
            .map((course) => course.id)
        : [],
    [coursesWithPrerequisiteStatus, currentSemester, failedCourseIds, isSimulationActive]
  );

  const handleToggleCourseApproval = (courseId: string) => {
    const course = coursesWithPrerequisiteStatus.find((item) => item.id === courseId);
    if (
      !course ||
      (course.status !== 'Aprobado' &&
        course.status !== 'Disponible' &&
        course.status !== 'Inscrito' &&
        course.status !== 'Sugerido')
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
    setFailedCourseIds((previous) => previous.filter((id) => id !== courseId));
    setIsMatriculaAccepted(false);
  };

  const handleExploreCurriculum = () => {
    setIsSimulationActive(false);
    setIsSemesterOnboardingOpen(false);
  };

  const handleConfirmSimulation = (semester: number, failedIds: string[]) => {
    const failedIdsSet = new Set(failedIds);
    const approvedPreviousIds = new Set(
      INITIAL_COURSES.filter((course) => course.semester < semester && !failedIdsSet.has(course.id)).map(
        (course) => course.id
      )
    );
    const nextEnrolledCourseIds = INITIAL_COURSES.filter(
      (course) =>
        (course.semester === semester || failedIdsSet.has(course.id)) &&
        course.prerequisites.every((prerequisiteId) => approvedPreviousIds.has(prerequisiteId))
    ).map((course) => course.id);
    setCurrentSemester(semester);
    setIsSimulationActive(true);
    setFailedCourseIds(failedIds);
    setCourses(
      INITIAL_COURSES.map((course) => ({
        ...course,
        status: failedIdsSet.has(course.id)
          ? 'Disponible'
          : course.semester < semester
            ? 'Aprobado'
            : 'Disponible',
        grade: undefined
      }))
    );
    setEnrolledCourseIds(nextEnrolledCourseIds);
    setIsMatriculaAccepted(false);
    const firstCourseInSemester =
      INITIAL_COURSES.find((course) => course.semester === semester) ??
      INITIAL_COURSES.find((course) => failedIdsSet.has(course.id));
    if (firstCourseInSemester) setSelectedCourseId(firstCourseInSemester.id);
    setHasSelectedCourse(false);
    setIsInspectorOpen(true);
    setIsSemesterOnboardingOpen(false);
  };

  const handleAcceptMatricula = () => {
    setIsMatriculaAccepted(true);
  };

  const handleToggleEnrollCourse = (courseId: string) => {
    setEnrolledCourseIds((previous) => previous.filter((id) => id !== courseId));
    setIsMatriculaAccepted(false);
  };

  return (
    <div className="app-shell h-screen w-screen flex flex-col overflow-hidden dark">
      {/* Top Header Navigation */}
      <TopHeader
        completedCredits={totalCompletedCredits}
        totalCredits={totalDegreeCredits}
        enrolledCount={enrolledCourses.length}
        enrolledCredits={enrolledCredits}
        isMatriculaAccepted={isMatriculaAccepted}
        onReviewMatricula={() => setIsPreMatriculaModalOpen(true)}
      />

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
            simulationMode={isSimulationActive}
            recommendedCourseIds={recommendedCourseIds}
            failedCourseIds={failedCourseIds}
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
            onToggleCourseApproval={handleToggleCourseApproval}
            enrolledCredits={enrolledCredits}
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
        totalCredits={enrolledCredits}
        currentSemester={currentSemester}
        blockedCourses={coursesWithPrerequisiteStatus.filter(
          (course) => course.semester === currentSemester && course.status === 'Bloqueado'
        )}
        allCourses={coursesWithPrerequisiteStatus}
        isConfirmed={isMatriculaAccepted}
        onConfirm={handleAcceptMatricula}
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
          onExplore={handleExploreCurriculum}
          onConfirm={handleConfirmSimulation}
        />
      )}
    </div>
  );
}
