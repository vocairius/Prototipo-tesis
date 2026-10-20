export type CourseType =
  | 'Obligatorio'
  | 'Núcleo Obligatorio'
  | 'Núcleo Multimedia'
  | 'Ciencias Básicas'
  | 'Especialidad'
  | 'Humanidades'
  | 'Electiva';

export type CourseStatus = 'Aprobado' | 'Sugerido' | 'Inscrito' | 'Disponible' | 'Bloqueado';

export interface Course {
  id: string;
  code: string;
  shortCode: string;
  title: string;
  semester: number;
  credits: number;
  type: CourseType;
  status: CourseStatus;
  grade?: number | string;
  description: string;
  prerequisites: string[]; // Course IDs
  unlocks: string[]; // Course IDs
  isBottleneck?: boolean;
  bottleneckReason?: string;
  tag?: string; // 'OK' | 'CRÍTICO' | 'Ruta' | 'Postergable' | 'Bloqueado'
  priority?: 'Alta' | 'Media' | 'Baja';
  position: { x: number; y: number };
  colorTheme?: 'emerald' | 'cyan' | 'amber' | 'violet' | 'rose' | 'zinc';
  syllabus?: string[];
  schedule?: string;
  professor?: string;
  repeatable?: boolean;
  program?: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  type: 'approved' | 'suggested' | 'warning' | 'blocked' | 'dashed';
  label?: string;
  isBottleneck?: boolean;
}

export interface DegreeAuditCategory {
  name: string;
  requiredCredits: number;
  completedCredits: number;
  inProgressCredits: number;
  color: string;
}

export interface DiagnosticSettings {
  targetSemester: number;
  hasRetakes: boolean;
  intensityWorkload: 'light' | 'standard' | 'intense'; // 12, 14, 18 CR
  trackFocus: 'multimedia' | 'software' | 'gamedev';
}
