"use client";

import { useEffect, useState } from "react";
import Explorer from "./istruzione/Explorer";
import MainLayout from "./layout/MainLayout";
import { useScuole } from "../context/ScuoleContext";

export default function MainComponent() {
  const { tipi } = useScuole();
  const [activeTipo, setActiveTipo] = useState(null);
  const [dialog, setDialog] = useState({
    open: false,
    section: null,
    payload: null,
  });

  useEffect(() => {
    if (!activeTipo && Array.isArray(tipi) && tipi.length > 0) {
      setActiveTipo(tipi[0]);
    }
  }, [activeTipo, tipi]);

  const handleOpenDialog = (section, payload = null) =>
    setDialog({ open: true, section, payload });
  const handleCloseDialog = () =>
    setDialog({ open: false, section: null, payload: null });

  return (
    <MainLayout
      activeTipo={activeTipo}
      onSelectTipo={setActiveTipo}
      onSearchSelect={(scuola) => handleOpenDialog("scuole", scuola)}
    >
      <div className="max-w-7xl mx-auto mt-3 px-4 pb-10 sm:px-6 lg:px-8">
        <Explorer
          activeTipo={activeTipo}
          dialog={dialog}
          onOpenDialog={handleOpenDialog}
          onCloseDialog={handleCloseDialog}
        />
      </div>
    </MainLayout>
  );
}
