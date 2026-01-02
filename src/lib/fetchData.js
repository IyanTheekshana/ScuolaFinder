export const DATA_URL = process.env.NEXT_PUBLIC_DATA_URL || process.env.DATA_URL;

export async function fetchScuole() {
  if (!DATA_URL) {
    throw new Error(
      "DATA_URL non impostata. Aggiungi NEXT_PUBLIC_DATA_URL o DATA_URL nel tuo file .env.local"
    );
  }
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Impossibile caricare i dati dalla sorgente Firebase");
  }
  return res.json();
}

// Utilities to traverse the hierarchical data
export function extractTipoIstruzione(data) {
  if (!Array.isArray(data)) return [];
  return data.map((t, idx) => ({
    id: t.Id || `tipo-${idx}`,
    titolo: t.Titolo || "Senza titolo",
    descrizione: t.Descrizione || "",
    raw: t,
  }));
}

export function getSettoriByTipo(tipoObj) {
  return Array.isArray(tipoObj?.Settori) ? tipoObj.Settori : [];
}

export function getIndirizziBySettore(settoreObj) {
  return Array.isArray(settoreObj?.Indirizzi) ? settoreObj.Indirizzi : [];
}

export function getScuoleByIndirizzo(indirizzoObj) {
  return Array.isArray(indirizzoObj?.Scuole) ? indirizzoObj.Scuole : [];
}

// Flatten all schools with breadcrumb path for global search
export function flattenScuole(data) {
  const out = [];
  if (!Array.isArray(data)) return out;
  data.forEach((tipo) => {
    (tipo.Settori || []).forEach((settore) => {
      (settore.Indirizzi || []).forEach((indirizzo) => {
        (indirizzo.Scuole || []).forEach((scuola) => {
          out.push({
            ...scuola,
            __path: {
              tipo: tipo.Titolo,
              settore: settore.Titolo,
              indirizzo: indirizzo.Titolo,
            },
          });
        });
      });
    });
  });
  return out;
}
