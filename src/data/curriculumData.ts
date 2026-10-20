import multimediaCourses from './cursos_multimedia.json';
import { Course, CourseType, DegreeAuditCategory } from '../types/curriculum';

/* ------------------------------------------------------------------
 * Datos base: el JSON de la base de datos es la única fuente de verdad.
 * ------------------------------------------------------------------ */

interface JsonCourse {
  id: string;
  nombre: string;
  nombre_normalizado: string;
  programas: { programa: string; semestre: number }[];
  creditos: number;
  repetido: boolean;
  prerrequisitos: string[];
  estado: string;
  nota: number | null;
}

const rawCourses = multimediaCourses as unknown as JsonCourse[];

/* ------------------------------------------------------------------
 * Clasificación por área de conocimiento.
 * ------------------------------------------------------------------ */

export const AREA_CIENCIAS_BASICAS = 'Ciencias Básicas (Matemáticas & Física)';
export const AREA_NUCLEO_OBLIGATORIO = 'Núcleo Obligatorio (Computación & Software)';
export const AREA_NUCLEO_MULTIMEDIA = 'Núcleo Multimedia & Gráficos';
export const AREA_HUMANIDADES = 'Humanidades, Gestión & Ética';
export const AREA_ELECTIVAS = 'Electivas de Énfasis / Especialidad';

/** Patrones léxicos por área, evaluados sobre el nombre normalizado. */
const AREA_POR_MATERIA: { area: string; patrones: RegExp[] }[] = [
  {
    area: AREA_CIENCIAS_BASICAS,
    patrones: [
      /matematica/,
      /matematicas/,
      /calculo/,
      /algebra/,
      /estadistica/,
      /probabilidad/,
      /fisica/,
      /discretas/
    ]
  },
  {
    area: AREA_NUCLEO_OBLIGATORIO,
    patrones: [
      /programacion/,
      /computacion/,
      /bases de datos/,
      /redes/,
      /desarrollo web/,
      /circuitos/,
      /electronica/,
      /introduccion a la ingenieria/
    ]
  },
  {
    area: AREA_NUCLEO_MULTIMEDIA,
    patrones: [
      /audio/,
      /video/,
      /animac/,
      /modelado/,
      /dibujo/,
      /grafica/,
      /multimedia/,
      /senales/,
      /imagenes/,
      /diseno/,
      /guion/,
      /taller/,
      /post produccion/
    ]
  },
  {
    area: AREA_HUMANIDADES,
    patrones: [
      /humanistica/,
      /ingles/,
      /comunicacion/,
      /gestion/,
      /etica/,
      /legislacion/,
      /proyecto/,
      /practica/,
      /bienestar/,
      /curso formativo/
    ]
  }
];

/** Quita tildes y signos para que los patrones léxicos apliquen siempre. */
export const normalizar = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();

/** Área de conocimiento a la que pertenece una materia, según su nombre. */
export const areaDeMateria = (titulo: string): string => {
  const normalizado = normalizar(titulo);

  for (const { area, patrones } of AREA_POR_MATERIA) {
    if (patrones.some((patron) => patron.test(normalizado))) return area;
  }

  return AREA_ELECTIVAS;
};

/** Etiqueta corta de cada área, usada como "Tipo" en la malla. */
const TIPO_POR_AREA: Record<string, CourseType> = {
  [AREA_CIENCIAS_BASICAS]: 'Ciencias Básicas',
  [AREA_NUCLEO_OBLIGATORIO]: 'Núcleo Obligatorio',
  [AREA_NUCLEO_MULTIMEDIA]: 'Núcleo Multimedia',
  [AREA_HUMANIDADES]: 'Humanidades',
  [AREA_ELECTIVAS]: 'Electiva'
};

const COLOR_POR_AREA: Record<string, string> = {
  [AREA_CIENCIAS_BASICAS]: '#06b6d4',
  [AREA_NUCLEO_OBLIGATORIO]: '#10b981',
  [AREA_NUCLEO_MULTIMEDIA]: '#8b5cf6',
  [AREA_HUMANIDADES]: '#f59e0b',
  [AREA_ELECTIVAS]: '#ec4899'
};

/* ------------------------------------------------------------------
 * Construcción de la malla a partir del JSON.
 * ------------------------------------------------------------------ */

const semestreDe = (course: JsonCourse): number => {
  const semestre = course.programas.find((p) => p.programa === 'multimedia')?.semestre;

  if (semestre === undefined) {
    throw new Error(
      `La materia ${course.id} no tiene semestre asignado al programa Multimedia.`
    );
  }

  return semestre;
};

const indicePorSemestre = new Map<number, number>();
const usadosShortCode = new Set<string>();

export const INITIAL_COURSES: Course[] = rawCourses.map((course) => {
  const semestre = semestreDe(course);
  const indice = indicePorSemestre.get(semestre) ?? 0;
  indicePorSemestre.set(semestre, indice + 1);

  const titulo = course.nombre.trim().replace(/\s+/g, ' ');
  const area = areaDeMateria(titulo);

  // Código legible y único por semestre: MUL-301, MUL-302, ...
  const code = `MUL-${semestre}${String(indice + 1).padStart(2, '0')}`;

  // Siglas de dos letras para el badge del nodo, sin colisiones.
  const palabras = course.nombre_normalizado
    .split(/\s+/)
    .filter(
      (word) =>
        word && !['de', 'del', 'la', 'las', 'el', 'los', 'y', 'en', 'para', 'i', 'ii', 'iii', 'iv'].includes(word)
    );
  let shortCode = palabras
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  if (!shortCode) shortCode = code.slice(-2);
  while (usadosShortCode.has(shortCode)) {
    shortCode = `${shortCode.slice(0, 1)}${(shortCode.charCodeAt(1) % 26) + 1}`;
  }
  usadosShortCode.add(shortCode);

  const estado = course.estado.toLocaleLowerCase('es');
  const status: Course['status'] =
    estado === 'aprobado' ? 'Aprobado' : estado === 'reprobado' ? 'Bloqueado' : 'Disponible';

  return {
    id: course.id,
    code,
    shortCode,
    title: titulo,
    semester: semestre,
    credits: course.creditos,
    type: course.repetido ? 'Electiva' : TIPO_POR_AREA[area] ?? 'Obligatorio',
    status,
    grade: course.nota ?? undefined,
    description: `${titulo} — asignatura de ${area} del Semestre ${semestre} del plan de Ingeniería en Tecnologías Multimedia.`,
    prerequisites: course.prerrequisitos,
    unlocks: [],
    repeatable: course.repetido,
    program: 'Multimedia',
    position: {
      x: 40 + (semestre - 1) * 350,
      y: 50 + indice * 145
    },
    colorTheme: course.repetido ? 'violet' : area === AREA_NUCLEO_MULTIMEDIA ? 'violet' : 'cyan'
  } satisfies Course;
});

const coursesById = new Map(INITIAL_COURSES.map((course) => [course.id, course]));

// Retroalimenta la lista de asignaturas que desbloquea cada materia.
for (const course of INITIAL_COURSES) {
  for (const prerequisiteId of course.prerequisites) {
    const prerequisite = coursesById.get(prerequisiteId);
    if (!prerequisite) {
      throw new Error(
        `La materia ${course.id} referencia un prerrequisito inexistente: ${prerequisiteId}.`
      );
    }
    prerequisite.unlocks.push(course.id);
  }
}

// Una materia es cuello de botella cuando desbloquea dos o más ramas del plan.
for (const course of INITIAL_COURSES) {
  if (course.unlocks.length >= 2) {
    course.isBottleneck = true;
    course.bottleneckReason = `Desbloquea ${course.unlocks.length} asignaturas (${course.unlocks
      .map((id) => coursesById.get(id)?.title ?? id)
      .join(', ')}).`;
    course.tag = 'CRÍTICO';
    course.priority = course.unlocks.length >= 3 ? 'Alta' : 'Media';
  }
}

/* ------------------------------------------------------------------
 * Constantes del plan vigente, derivadas del propio dataset.
 * ------------------------------------------------------------------ */

/** Total de créditos del plan (suma de la base de datos). */
export const TOTAL_CREDITS = INITIAL_COURSES.reduce((sum, course) => sum + course.credits, 0);

/** Semestres que componen el plan, ordenados. */
export const TOTAL_SEMESTRES = [...indicePorSemestre.keys()].sort((a, b) => a - b);

/** Total de asignaturas del plan. */
export const TOTAL_COURSES = INITIAL_COURSES.length;

/* ------------------------------------------------------------------
 * Distribución de créditos por área de conocimiento.
 * ------------------------------------------------------------------ */

export const DEGREE_AUDIT_CATEGORIES: DegreeAuditCategory[] = (() => {
  const creditosPorArea = new Map<string, { requerido: number; completado: number }>();

  for (const course of INITIAL_COURSES) {
    const area = areaDeMateria(course.title);
    const entry = creditosPorArea.get(area) ?? { requerido: 0, completado: 0 };
    entry.requerido += course.credits;
    if (course.status === 'Aprobado') entry.completado += course.credits;
    creditosPorArea.set(area, entry);
  }

  return [...creditosPorArea.entries()].map(([name, { requerido, completado }]) => ({
    name,
    requiredCredits: requerido,
    completedCredits: completado,
    inProgressCredits: 0,
    color: COLOR_POR_AREA[name] ?? '#71717a'
  }));
})();
