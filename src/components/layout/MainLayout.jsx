"use client";

import { useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const EXPANDED_WIDTH = "256px";
const COLLAPSED_WIDTH = "72px";

export default function MainLayout({
  children,
  activeTipo,
  onSelectTipo,
  onSearchSelect,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const sidebarWidth = useMemo(
    () => (sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH),
    [sidebarCollapsed]
  );

  return (
    <div
      className="min-h-screen bg-white text-slate-900 transition-colors"
      style={{ "--sidebar-width": sidebarWidth }}
    >
      <Sidebar
        onSelectTipo={onSelectTipo}
        activeTipoId={activeTipo?.id}
        collapsed={sidebarCollapsed}
      />
      <Topbar
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        sidebarCollapsed={sidebarCollapsed}
        onSearchSelect={onSearchSelect}
      />
      <main className="pt-16 pl-[var(--sidebar-width)] pr-4 pb-6 transition-[padding-left] duration-300">
        {children}
      </main>
    </div>
  );
}
