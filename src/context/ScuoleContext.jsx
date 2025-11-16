"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  extractTipoIstruzione,
  fetchScuole,
  flattenScuole,
} from "../lib/fetchData";

const ScuoleContext = createContext(null);

export function useScuole() {
  const ctx = useContext(ScuoleContext);
  if (!ctx) {
    throw new Error("useScuole deve essere usato dentro ScuoleProvider");
  }
  return ctx;
}

export function ScuoleProvider({
  children,
  initialData = null,
  initialError = null,
}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData && !initialError);
  const [error, setError] = useState(initialError);

  useEffect(() => {
    if (initialData || initialError) return;

    let ignore = false;

    async function load() {
      try {
        const payload = await fetchScuole();
        if (!ignore) {
          setData(payload);
          setError(null);
        }
      } catch (e) {
        if (!ignore) {
          setError(e.message || "Errore durante il caricamento dei dati");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [initialData, initialError]);

  const value = useMemo(() => {
    return {
      data,
      loading,
      error,
      tipi: extractTipoIstruzione(data),
      flattened: flattenScuole(data),
    };
  }, [data, loading, error]);

  return (
    <ScuoleContext.Provider value={value}>{children}</ScuoleContext.Provider>
  );
}
