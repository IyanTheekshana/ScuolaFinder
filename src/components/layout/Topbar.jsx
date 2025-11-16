"use client";
import { ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { useScuole } from "../../context/ScuoleContext";

export default function Topbar({
  onToggleSidebar,
  sidebarCollapsed,
  onSearchSelect,
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const { flattened: list } = useScuole();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return list
      .filter((s) => {
        const blob = [
          s.Nome,
          s.Comune,
          s.Indirizzo,
          s.CAP,
          s.Email,
          s.__path?.indirizzo,
          s.__path?.settore,
          s.__path?.tipo,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return blob.includes(term);
      })
      .slice(0, 12);
  }, [q, list]);

  const handleResultSelect = (result) => {
    onSearchSelect?.(result);
    setOpen(false);
    setQ("");
  };

  return (
    <header className="fixed left-[var(--sidebar-width)] right-0 top-0 h-16 bg-white border-b border-slate-200 flex items-center gap-3 sm:gap-4 px-3 sm:px-6 shadow-sm z-20 transition-[left] duration-300">
      {onToggleSidebar && (
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          aria-label={sidebarCollapsed ? "Espandi sidebar" : "Collassa sidebar"}
          aria-pressed={!sidebarCollapsed}
          onClick={onToggleSidebar}
        >
          {sidebarCollapsed ? (
            <ChevronsRight size={18} />
          ) : (
            <ChevronsLeft size={18} />
          )}
        </button>
      )}
      <div className="relative w-full max-w-2xl flex-1">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          placeholder="Cerca per scuola, comune o indirizzo di studio..."
          className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-inner focus:ring-2 focus:ring-slate-200 outline-none placeholder:text-slate-400"
        />
        {open && q && results.length > 0 && (
          <div className="absolute mt-2 w-full">
            <Card>
              <CardContent className="p-0 max-h-96 overflow-auto">
                <ul>
                  {results.map((r, idx) => (
                    <li key={idx} className="border-b last:border-0">
                      <button
                        type="button"
                        onClick={() => handleResultSelect(r)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
                      >
                        <div className="text-sm font-medium">{r.Nome}</div>
                        <div className="text-xs text-gray-500">
                          {r.Comune} - {r.Indirizzo} - {r.__path?.indirizzo}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </header>
  );
}
