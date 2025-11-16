"use client";

import { Atom, Briefcase, GraduationCap, Wrench } from "lucide-react";
import { useScuole } from "../../context/ScuoleContext";

const iconMap = {
  "ISTRUZIONE LICEALE": GraduationCap,
  "ISTRUZIONE TECNICA": Atom,
  "ISTRUZIONE PROFESSIONALE": Briefcase,
  "ISTRUZIONE E FORMAZIONE PROFESSIONALE": Wrench,
};

export default function Sidebar({
  onSelectTipo,
  activeTipoId,
  collapsed = false,
}) {
  const { tipi, loading, error } = useScuole();

  return (
    <aside
      className={
        "fixed left-0 top-0 h-screen w-[var(--sidebar-width)] bg-white text-slate-900 p-5 flex flex-col z-30 border-r border-slate-200 shadow-xl shadow-slate-900/5 transition-[width] duration-300" +
        (collapsed ? " px-3" : "")
      }
      aria-expanded={!collapsed}
    >
      <div
        className={
          "mb-8 font-semibold tracking-tight transition-all " +
          (collapsed ? "text-base text-center" : "text-2xl")
        }
      >
        {collapsed ? "SF" : "Scuola Finder"}
      </div>
      {loading && !collapsed && (
        <div className="text-gray-500 text-sm">Caricamento...</div>
      )}
      {error && !collapsed && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <nav
        className={
          "flex flex-col gap-2 overflow-auto" +
          (collapsed ? " items-center" : " pr-2")
        }
      >
        {tipi.map((t) => {
          const Icon = iconMap[t.titolo] || GraduationCap;
          const active = activeTipoId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTipo && onSelectTipo(t)}
              className={
                "group flex items-center gap-3 text-left rounded-2xl px-3 py-2.5 text-sm font-medium transition border " +
                (collapsed ? " justify-center" : " justify-start") +
                (active
                  ? " border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-sky-50 text-slate-900 shadow"
                  : " border-transparent text-slate-600 hover:bg-slate-100")
              }
              title={t.titolo}
            >
              <div size={17}>
                <Icon
                  size={17}
                  className={
                    "transition-colors " +
                    (active ? "text-indigo-500" : "text-slate-500")
                  }
                />
              </div>
              {!collapsed && <span className="truncate">{t.titolo}</span>}
            </button>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="mt-auto text-[11px] text-gray-500 pt-4 border-t border-slate-200">
          Iyan Theekshana - ver 1.0.0
        </div>
      )}
    </aside>
  );
}
