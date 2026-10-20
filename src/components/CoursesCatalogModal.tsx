import React, { useState } from 'react';
import { Course } from '../types/curriculum';
import { BookOpen, Search, ArrowRight, X } from 'lucide-react';

interface CoursesCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export const CoursesCatalogModal: React.FC<CoursesCatalogModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectCourse
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#111215] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Catálogo Curricular Multimedia</h3>
              <p className="text-xs text-zinc-400">Base de conocimiento de todas las asignaturas del plan</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#16181d] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, código o área de conocimiento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#16181d] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto text-xs">
          {filtered.map((course) => (
            <div
              key={course.id}
              onClick={() => {
                onSelectCourse(course.id);
                onClose();
              }}
              className="p-3 rounded-xl bg-[#16181d] border border-white/[0.04] hover:border-emerald-400/50 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-semibold">{course.code}</span>
                  <h4 className="font-medium text-white group-hover:text-emerald-300 transition">
                    {course.title}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                    Semestre {course.semester}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{course.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="font-mono text-zinc-300">{course.credits} CR</span>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
