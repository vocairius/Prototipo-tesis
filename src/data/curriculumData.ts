import { Course, GraphEdge, DegreeAuditCategory } from '../types/curriculum';

export const INITIAL_COURSES: Course[] = [
  // --- SEMESTER 1 ---
  {
    id: 'CC-101',
    code: 'CC-101',
    shortCode: 'P1',
    title: 'Prog. Básica I',
    semester: 1,
    credits: 4,
    type: 'Obligatorio',
    status: 'Aprobado',
    grade: '9.4',
    description: 'Fundamentos de algoritmia, sintaxis modular, control de flujo y estructuras de memoria básicas en C/C++.',
    prerequisites: [],
    unlocks: ['CC-102'],
    tag: 'OK',
    position: { x: 40, y: 130 },
    colorTheme: 'emerald',
    syllabus: ['Algoritmos y complejidad básica', 'Tipos primitivos y apuntadores', 'Estructuras de control', 'Funciones y modularidad'],
    professor: 'Dra. Elena Valenzuela',
    schedule: 'Lun / Mié 08:00 - 10:00'
  },
  {
    id: 'MAT-101',
    code: 'MAT-101',
    shortCode: 'CD',
    title: 'Cálculo Diferencial',
    semester: 1,
    credits: 4,
    type: 'Ciencias Básicas',
    status: 'Aprobado',
    grade: '8.5',
    description: 'Límites, continuidad, derivación de funciones reales de una variable y aplicaciones de optimización.',
    prerequisites: [],
    unlocks: ['MAT-102', 'MAT-201'],
    tag: 'OK',
    position: { x: 40, y: 20 },
    colorTheme: 'cyan',
    syllabus: ['Topología de la recta real', 'Cálculo de límites', 'Regla de la cadena y derivación implícita', 'Máximos y mínimos'],
    professor: 'Dr. Roberto Mendoza',
    schedule: 'Mar / Jue 10:00 - 12:00'
  },
  {
    id: 'DIS-101',
    code: 'DIS-101',
    shortCode: 'DV',
    title: 'Diseño Visual & Semiótica',
    semester: 1,
    credits: 3,
    type: 'Núcleo Multimedia',
    status: 'Aprobado',
    grade: '9.0',
    description: 'Composición gráfica, teoría del color, semiótica de la imagen y fundamentos de tipografía digital.',
    prerequisites: [],
    unlocks: ['MUL-201'],
    tag: 'OK',
    position: { x: 40, y: 520 },
    colorTheme: 'violet',
    syllabus: ['Gestalt y percepción visual', 'Teoría del color sustractivo y aditivo', 'Composición y retículas', 'Semiótica audiovisual'],
    professor: 'MSc. Claudia Morales',
    schedule: 'Vie 14:00 - 18:00'
  },

  // --- SEMESTER 2 ---
  {
    id: 'CC-102',
    code: 'CC-102',
    shortCode: 'P2',
    title: 'Prog. Básica II',
    semester: 2,
    credits: 4,
    type: 'Obligatorio',
    status: 'Aprobado',
    grade: '8.8',
    description: 'Punteros, estructuras de datos lineales en C++, concurrencia básica y gestión manual de recursos de memoria.',
    prerequisites: ['CC-101'],
    unlocks: ['CC-201', 'CC-202', 'MUL-201'],
    tag: 'OK',
    position: { x: 370, y: 130 },
    colorTheme: 'cyan',
    syllabus: ['Manejo dinámico de memoria y Heap vs Stack', 'Listas enlazadas, pilas y colas', 'Recursión y backtracking', 'Templates en C++'],
    professor: 'Dr. Fernando Salazar',
    schedule: 'Mar / Jue 08:00 - 10:00'
  },
  {
    id: 'MAT-102',
    code: 'MAT-102',
    shortCode: 'AL',
    title: 'Álgebra Lineal',
    semester: 2,
    credits: 3,
    type: 'Ciencias Básicas',
    status: 'Aprobado',
    grade: '7.9',
    description: 'Espacios vectoriales, matrices de transformación afín, autovalores, autovectores y descomposición SVD.',
    prerequisites: ['MAT-101'],
    unlocks: ['MUL-201', 'MUL-302', 'CC-202', 'MAT-202'],
    isBottleneck: true,
    bottleneckReason: 'Bloquea 4 asignaturas críticas en la trayectoria multimedia y algoritmos avanzados.',
    tag: 'CRÍTICO',
    position: { x: 40, y: 330 },
    colorTheme: 'amber',
    syllabus: ['Espacios y subespacios vectoriales', 'Matrices de transformación afín 2D y 3D', 'Determinantes e inversa de Gauss-Jordan', 'Autovalores y diagonalización'],
    professor: 'Dra. Mariana Rios',
    schedule: 'Mié / Vie 10:00 - 12:00'
  },
  {
    id: 'MAT-201',
    code: 'MAT-201',
    shortCode: 'CI',
    title: 'Cálculo Integral & Series',
    semester: 2,
    credits: 4,
    type: 'Ciencias Básicas',
    status: 'Aprobado',
    grade: '8.2',
    description: 'Teorema fundamental del cálculo, técnicas avanzadas de integración, series infinitas de Taylor y Fourier.',
    prerequisites: ['MAT-101'],
    unlocks: ['MAT-202'],
    tag: 'OK',
    position: { x: 370, y: 20 },
    colorTheme: 'cyan',
    syllabus: ['Métodos de integración', 'Integrales impropias', 'Series de potencias y Taylor', 'Aplicaciones geométricas de volumen'],
    professor: 'Dr. Roberto Mendoza',
    schedule: 'Lun / Mié 12:00 - 14:00'
  },

  // --- SEMESTER 3 ---
  {
    id: 'CC-201',
    code: 'CC-201',
    shortCode: 'PO',
    title: 'Prog. Orientada a Objetos',
    semester: 3,
    credits: 4,
    type: 'Núcleo Obligatorio',
    status: 'Sugerido',
    grade: 'Pendiente',
    description: 'Paradigmas de objetos, patrones GoF, abstracción, herencia múltiple y polimorfismo dinámico en Rust/C++.',
    prerequisites: ['CC-102'],
    unlocks: ['CC-301'],
    tag: 'Ruta',
    priority: 'Alta',
    position: { x: 690, y: 230 },
    colorTheme: 'emerald',
    syllabus: ['Principios SOLID y diseño desacoplado', 'Patrones de creación, estructurales y de comportamiento', 'Herencia vs Composición', 'RTTI y polimorfismo'],
    professor: 'Ing. Javier Gutierrez',
    schedule: 'Lun / Mié 14:00 - 16:00'
  },
  {
    id: 'CC-202',
    code: 'CC-202',
    shortCode: 'ED',
    title: 'Estructura de Datos',
    semester: 3,
    credits: 4,
    type: 'Obligatorio',
    status: 'Disponible',
    grade: 'Sin cursar',
    description: 'Árboles autobalanceados (AVL, Red-Black), grafos dirigidos, tablas hash concurrentes y análisis amortizado.',
    prerequisites: ['CC-102'],
    unlocks: ['CC-302'],
    tag: 'Postergable',
    priority: 'Media',
    position: { x: 690, y: 50 },
    colorTheme: 'zinc',
    syllabus: ['Árboles binarios y balanceo AVL', 'Estructuras de grafos (Adyacencia, Dijkstra, A*)', 'Tablas de dispersión hash con colisiones', 'Heaps binarios y colas de prioridad'],
    professor: 'Dr. Fernando Salazar',
    schedule: 'Mar / Jue 14:00 - 16:00'
  },
  {
    id: 'MUL-201',
    code: 'MUL-201',
    shortCode: 'CG',
    title: 'Computación Gráfica',
    semester: 3,
    credits: 4,
    type: 'Núcleo Multimedia',
    status: 'Inscrito',
    grade: 'Pendiente',
    description: 'Pipeline de rasterización moderna, shaders en GLSL/WebGL, cámaras virtuales y matrices de proyección espacial.',
    prerequisites: ['MAT-102', 'CC-102'],
    unlocks: ['MUL-302', 'MUL-303'],
    tag: 'Ruta',
    priority: 'Alta',
    position: { x: 690, y: 370 },
    colorTheme: 'violet',
    syllabus: ['Pipeline de render programable', 'Matrices MVP (Model-View-Projection)', 'Shaders de vértices y fragmentos en GLSL', 'Iluminación Blinn-Phong y texturizado'],
    professor: 'MSc. Gabriel Arrieta',
    schedule: 'Mar / Jue 16:00 - 18:00'
  },
  {
    id: 'HUM-101',
    code: 'HUM-101',
    shortCode: 'ET',
    title: 'Ética y Propiedad Intelectual',
    semester: 3,
    credits: 2,
    type: 'Humanidades',
    status: 'Inscrito',
    grade: 'Pendiente',
    description: 'Legislación sobre patentes de software, licencias open-source, ética de algoritmos e impacto social digital.',
    prerequisites: [],
    unlocks: [],
    tag: 'Ruta',
    priority: 'Media',
    position: { x: 690, y: 520 },
    colorTheme: 'zinc',
    syllabus: ['Licencias GNU, MIT, Apache y copyright digital', 'Privacidad y protección de datos GDPR', 'Dilemas éticos de IA', 'Responsabilidad profesional'],
    professor: 'Lic. Sofía Duarte',
    schedule: 'Vie 08:00 - 10:00'
  },

  // --- SEMESTER 4 ---
  {
    id: 'CC-301',
    code: 'CC-301',
    shortCode: 'AR',
    title: 'Arquitectura de Soft.',
    semester: 4,
    credits: 3,
    type: 'Obligatorio',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Diseño de sistemas distribuidos, microservicios, capas de dominio, arquitecturas limpias y consistencia eventual.',
    prerequisites: ['CC-201'],
    unlocks: ['CC-401'],
    tag: 'Bloqueado',
    position: { x: 1020, y: 230 },
    colorTheme: 'zinc',
    syllabus: ['Hexagonal Architecture & DDD', 'Sistemas de mensajería asíncronos', 'Resiliencia y patrones Circuit Breaker', 'CI/CD e infraestructura como código'],
    professor: 'Ing. Javier Gutierrez'
  },
  {
    id: 'MUL-302',
    code: 'MUL-302',
    shortCode: '3D',
    title: 'Render 3D & Shaders',
    semester: 4,
    credits: 3,
    type: 'Especialidad',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Raytracing acelerado por GPU, physically based rendering (PBR), shaders de cómputo y optimización espacial en tiempo real.',
    prerequisites: ['MUL-201'],
    unlocks: ['MUL-401'],
    tag: 'Bloqueado',
    position: { x: 1020, y: 370 },
    colorTheme: 'zinc',
    syllabus: ['Cálculo de BRDF y superficies metálicas/dieléctricas', 'Post-procesado (Bloom, HDR, Tone mapping)', 'Compute shaders para partículas masivas', 'Estructuras BVH para trazado de rayos'],
    professor: 'MSc. Gabriel Arrieta'
  },
  {
    id: 'CC-302',
    code: 'CC-302',
    shortCode: 'BD',
    title: 'Bases de Datos Avanzadas',
    semester: 4,
    credits: 4,
    type: 'Obligatorio',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Modelado relacional ACID, índices B-Tree, optimización de queries y almacenes NoSQL distribuidos.',
    prerequisites: ['CC-202'],
    unlocks: ['CC-402'],
    tag: 'Bloqueado',
    position: { x: 1020, y: 70 },
    colorTheme: 'zinc',
    syllabus: ['Normalización Boyce-Codd', 'Planes de ejecución y costos EXPLAIN', 'Transacciones y niveles de aislamiento', 'Grafos y bases de datos columnares'],
    professor: 'Dra. Viviana Torres'
  },
  {
    id: 'MAT-202',
    code: 'MAT-202',
    shortCode: 'PE',
    title: 'Probabilidad y Estadística',
    semester: 4,
    credits: 3,
    type: 'Ciencias Básicas',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Variables aleatorias discretas y continuas, distribuciones multivariadas, inferencia bayesiana y pruebas de hipótesis.',
    prerequisites: ['MAT-201', 'MAT-102'],
    unlocks: ['CC-403'],
    tag: 'Bloqueado',
    position: { x: 1020, y: 520 },
    colorTheme: 'zinc',
    syllabus: ['Teorema del límite central', 'Modelos estocásticos de Markov', 'Regresión lineal y multivariada', 'Máxima verosimilitud'],
    professor: 'Dr. Roberto Mendoza'
  },

  // --- SEMESTER 5 ---
  {
    id: 'MUL-303',
    code: 'MUL-303',
    shortCode: 'MV',
    title: 'Motores de Videojuegos',
    semester: 5,
    credits: 4,
    type: 'Núcleo Multimedia',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Arquitectura de game engines, Entity-Component-System (ECS), bucles de simulación física y gestión de assets.',
    prerequisites: ['MUL-201', 'CC-201'],
    unlocks: ['MUL-402'],
    tag: 'Bloqueado',
    position: { x: 1350, y: 230 },
    colorTheme: 'violet'
  },
  {
    id: 'CC-401',
    code: 'CC-401',
    shortCode: 'SO',
    title: 'Sistemas Operativos',
    semester: 5,
    credits: 4,
    type: 'Obligatorio',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Gestión de procesos, scheduling en kernel, memoria virtual paginada y drivers de dispositivos de hardware.',
    prerequisites: ['CC-301'],
    unlocks: ['CC-501'],
    tag: 'Bloqueado',
    position: { x: 1350, y: 70 },
    colorTheme: 'cyan'
  },

  // --- SEMESTER 6 ---
  {
    id: 'MUL-401',
    code: 'MUL-401',
    shortCode: 'VR',
    title: 'Realidad Virtual & Inmersiva',
    semester: 6,
    credits: 4,
    type: 'Especialidad',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Seguimiento 6DoF, audio binaural espacial, interacción hápica y optimización de latencia sub-20ms.',
    prerequisites: ['MUL-302'],
    unlocks: ['PRO-501'],
    tag: 'Bloqueado',
    position: { x: 1680, y: 370 },
    colorTheme: 'violet'
  },
  {
    id: 'CC-403',
    code: 'CC-403',
    shortCode: 'IA',
    title: 'Inteligencia Artificial',
    semester: 6,
    credits: 4,
    type: 'Obligatorio',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Búsqueda heurística, aprendizaje supervisado, redes neuronales convolucionales y modelos generativos multimodales.',
    prerequisites: ['MAT-202', 'CC-202'],
    unlocks: ['PRO-501'],
    tag: 'Bloqueado',
    position: { x: 1680, y: 150 },
    colorTheme: 'cyan'
  },

  // --- SEMESTER 7 ---
  {
    id: 'PRO-501',
    code: 'PRO-501',
    shortCode: 'T1',
    title: 'Proyecto de Grado I',
    semester: 7,
    credits: 4,
    type: 'Núcleo Obligatorio',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Formulación metodológica, estado del arte, arquitectura preliminar y prototipo funcional de tesis multimedia.',
    prerequisites: ['MUL-401', 'CC-403'],
    unlocks: ['PRO-502'],
    tag: 'Bloqueado',
    position: { x: 2010, y: 250 },
    colorTheme: 'amber'
  },

  // --- SEMESTER 8 ---
  {
    id: 'PRO-502',
    code: 'PRO-502',
    shortCode: 'T2',
    title: 'Proyecto de Grado II',
    semester: 8,
    credits: 6,
    type: 'Núcleo Obligatorio',
    status: 'Bloqueado',
    grade: 'Sin cursar',
    description: 'Validación empírica, pruebas de carga con usuarios reales, sustentación ante jurado y publicación técnica.',
    prerequisites: ['PRO-501'],
    unlocks: [],
    tag: 'Bloqueado',
    position: { x: 2340, y: 250 },
    colorTheme: 'emerald'
  }
];

export const INITIAL_EDGES: GraphEdge[] = [
  // CC-101 -> CC-102
  {
    id: 'edge-101-102',
    from: 'CC-101',
    to: 'CC-102',
    type: 'approved',
    label: ''
  },
  // CC-102 -> CC-201 (POO)
  {
    id: 'edge-102-201',
    from: 'CC-102',
    to: 'CC-201',
    type: 'approved',
    label: 'Req = Aprobado (100%)'
  },
  // CC-102 -> CC-202 (ED)
  {
    id: 'edge-102-202',
    from: 'CC-102',
    to: 'CC-202',
    type: 'dashed',
    label: ''
  },
  // MAT-102 -> MUL-201 (Cuello de botella)
  {
    id: 'edge-mat102-mul201',
    from: 'MAT-102',
    to: 'MUL-201',
    type: 'warning',
    label: 'Cuello de Botella',
    isBottleneck: true
  },
  // CC-102 -> MUL-201
  {
    id: 'edge-102-mul201',
    from: 'CC-102',
    to: 'MUL-201',
    type: 'approved',
    label: ''
  },
  // CC-201 -> CC-301
  {
    id: 'edge-201-301',
    from: 'CC-201',
    to: 'CC-301',
    type: 'suggested',
    label: 'Status = Óptimo (2025-1)'
  },
  // MUL-201 -> MUL-302
  {
    id: 'edge-mul201-302',
    from: 'MUL-201',
    to: 'MUL-302',
    type: 'blocked',
    label: ''
  },
  // CC-202 -> CC-302
  {
    id: 'edge-202-302',
    from: 'CC-202',
    to: 'CC-302',
    type: 'blocked',
    label: ''
  }
];

export const DEGREE_AUDIT_CATEGORIES: DegreeAuditCategory[] = [
  {
    name: 'Ciencias Básicas (Matemáticas & Física)',
    requiredCredits: 24,
    completedCredits: 11,
    inProgressCredits: 0,
    color: '#06b6d4'
  },
  {
    name: 'Núcleo Obligatorio (Computación & Software)',
    requiredCredits: 64,
    completedCredits: 12,
    inProgressCredits: 8,
    color: '#10b981'
  },
  {
    name: 'Núcleo Multimedia & Gráficos',
    requiredCredits: 48,
    completedCredits: 3,
    inProgressCredits: 4,
    color: '#8b5cf6'
  },
  {
    name: 'Humanidades, Gestión & Ética',
    requiredCredits: 12,
    completedCredits: 0,
    inProgressCredits: 2,
    color: '#f59e0b'
  },
  {
    name: 'Electivas de Énfasis / Especialidad',
    requiredCredits: 16,
    completedCredits: 0,
    inProgressCredits: 0,
    color: '#ec4899'
  }
];
