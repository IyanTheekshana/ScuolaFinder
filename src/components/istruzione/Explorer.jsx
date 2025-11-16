"use client";
import { ChevronDown, ChevronRight, Info, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useScuole } from "../../context/ScuoleContext";
import {
  getIndirizziBySettore,
  getScuoleByIndirizzo,
  getSettoriByTipo,
} from "../../lib/fetchData";

export default function Explorer({
  activeTipo,
  dialog: controlledDialog,
  onOpenDialog,
  onCloseDialog,
}) {
  const { data, loading, error } = useScuole();
  const [selectedSettore, setSelectedSettore] = useState(null);
  const [selectedIndirizzo, setSelectedIndirizzo] = useState(null);
  const [selectedArticolazione, setSelectedArticolazione] = useState(null);
  const [selectedOpzione, setSelectedOpzione] = useState(null);
  const [expandedSettoreKey, setExpandedSettoreKey] = useState(null);
  const [expandedIndirizzoKey, setExpandedIndirizzoKey] = useState(null);
  const [internalDialog, setInternalDialog] = useState({
    open: false,
    section: null,
    payload: null,
  });
  const dialog = controlledDialog ?? internalDialog;

  useEffect(() => {
    setSelectedSettore(null);
    setSelectedIndirizzo(null);
    setSelectedArticolazione(null);
    setSelectedOpzione(null);
    setExpandedSettoreKey(null);
    setExpandedIndirizzoKey(null);
  }, [activeTipo?.id]);

  useEffect(() => {
    setSelectedIndirizzo(null);
    setSelectedArticolazione(null);
    setSelectedOpzione(null);
    setExpandedIndirizzoKey(null);
  }, [selectedSettore?.Id]);

  const currentTipo = useMemo(() => {
    if (!data || !activeTipo) return null;
    return (data || []).find((t) => t.Id === activeTipo.id) || null;
  }, [data, activeTipo]);

  const settori = getSettoriByTipo(currentTipo);
  const indirizziList = getIndirizziBySettore(selectedSettore) || [];
  const indirizzoScuole = getScuoleByIndirizzo(selectedIndirizzo) || [];
  const articolazioneScuole = Array.isArray(selectedArticolazione?.Scuole)
    ? selectedArticolazione.Scuole
    : [];
  const opzioneScuole = Array.isArray(selectedOpzione?.Scuole)
    ? selectedOpzione.Scuole
    : [];
  const scuoleList =
    opzioneScuole.length > 0
      ? opzioneScuole
      : articolazioneScuole.length > 0
      ? articolazioneScuole
      : indirizzoScuole;

  const openDialog = (section, payload = null) => {
    if (onOpenDialog) {
      onOpenDialog(section, payload);
    } else {
      setInternalDialog({ open: true, section, payload });
    }
  };
  const closeDialog = () => {
    if (onCloseDialog) {
      onCloseDialog();
    } else {
      setInternalDialog({ open: false, section: null, payload: null });
    }
  };
  const toggleSettoreExpanded = (key) =>
    setExpandedSettoreKey((prev) => (prev === key ? null : key));
  const toggleIndirizzoExpanded = (key) =>
    setExpandedIndirizzoKey((prev) => (prev === key ? null : key));
  const handleSelectIndirizzo = (indirizzo) => {
    setSelectedIndirizzo(indirizzo);
    setSelectedArticolazione(null);
    setSelectedOpzione(null);
  };
  const handleSelectArticolazione = (indirizzo, articolazione) => {
    setSelectedIndirizzo(indirizzo);
    setSelectedArticolazione(articolazione);
    setSelectedOpzione(null);
  };
  const handleSelectOpzione = (indirizzo, articolazione, opzione) => {
    setSelectedIndirizzo(indirizzo);
    setSelectedArticolazione(articolazione);
    setSelectedOpzione(opzione);
  };

  const dialogTitleMap = {
    settori: "Dettaglio Settore",
    indirizzi: "Dettaglio Indirizzo",
    articolazioni: "Dettaglio Articolazione",
    opzioni: "Dettaglio Opzione",
    scuole: "Dettaglio Scuola",
  };

  const renderDialogContent = () => {
    if (!dialog.open) return null;
    const { section, payload } = dialog;
    switch (section) {
      case "settori": {
        if (!payload) {
          return (
            <p className="text-sm text-gray-500">
              Seleziona l'icona accanto a un settore per vedere i dettagli.
            </p>
          );
        }
        return (
          <div className="space-y-2">
            <div className="font-semibold text-lg">{payload.Titolo}</div>
            {payload.Descrizione ? (
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: payload.Descrizione }}
              />
            ) : (
              <p className="text-sm text-gray-500">
                Nessuna descrizione disponibile per questo settore.
              </p>
            )}
            {payload.Descrizioni ? (
              <ul>
                {payload.Descrizioni.map((d) => {
                  <li key={d.index}>{d}</li>;
                })}
              </ul>
            ) : (
              <p></p>
            )}
          </div>
        );
      }
      case "indirizzi": {
        if (!payload) {
          return (
            <p className="text-sm text-gray-500">
              Seleziona l'icona accanto a un indirizzo per vedere i dettagli.
            </p>
          );
        }
        return (
          <div className="space-y-2">
            <div className="font-semibold text-lg">{payload.Titolo}</div>
            {payload.Certificazione && (
              <div className="text-sm text-gray-600">
                Certificazione: {payload.Certificazione}
              </div>
            )}
            {payload.Descrizione ? (
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: payload.Descrizione }}
              />
            ) : (
              <p className="text-sm text-gray-500">
                Nessuna descrizione disponibile per questo indirizzo.
              </p>
            )}
          </div>
        );
      }
      case "articolazioni": {
        if (!payload) {
          return (
            <p className="text-sm text-gray-500">
              Seleziona l'icona accanto a un'articolazione per vedere i
              dettagli.
            </p>
          );
        }
        return (
          <div className="space-y-2">
            <div className="font-semibold text-lg">{payload.Titolo}</div>
            {payload.Certificazione && (
              <div className="text-sm text-gray-600">
                Certificazione: {payload.Certificazione}
              </div>
            )}
            {payload.Durata && (
              <div className="text-sm text-gray-600">
                Durata: {payload.Durata} anni
              </div>
            )}
            {payload.Descrizione ? (
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: payload.Descrizione }}
              />
            ) : payload.Descrizioni?.length ? (
              <ul className="text-sm text-gray-600 list-disc space-y-1 pl-5">
                {payload.Descrizioni.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                Nessuna descrizione disponibile per questa articolazione.
              </p>
            )}
          </div>
        );
      }
      case "opzioni": {
        if (!payload) {
          return (
            <p className="text-sm text-gray-500">
              Seleziona l'icona accanto a un'opzione per vedere i dettagli.
            </p>
          );
        }
        return (
          <div className="space-y-2">
            <div className="font-semibold text-lg">{payload.Titolo}</div>
            {payload.Certificazione && (
              <div className="text-sm text-gray-600">
                Certificazione: {payload.Certificazione}
              </div>
            )}
            {payload.Durata && (
              <div className="text-sm text-gray-600">
                Durata: {payload.Durata} anni
              </div>
            )}
            {payload.Descrizione ? (
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: payload.Descrizione }}
              />
            ) : payload.Descrizioni?.length ? (
              <ul className="text-sm text-gray-600 list-disc space-y-1 pl-5">
                {payload.Descrizioni.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                Nessuna descrizione disponibile per questa opzione.
              </p>
            )}
          </div>
        );
      }
      case "scuole": {
        if (!payload) {
          return (
            <p className="text-sm text-gray-500">
              Seleziona l'icona accanto a una scuola per vedere i dettagli.
            </p>
          );
        }
        return (
          <div className="space-y-2">
            <div className="font-semibold text-lg">{payload.Nome}</div>
            <div className="text-sm text-gray-600">
              {payload.Indirizzo} - {payload.Comune} ({payload.CAP})
            </div>
            <div className="text-sm text-gray-600">
              Email: {payload.Email || "Non disponibile"}
            </div>
            <div className="text-sm text-gray-600">
              Telefono: {payload.Telefono || "Non disponibile"}
            </div>
            {payload.Sito && (
              <a
                href={
                  payload.Sito.startsWith("http")
                    ? payload.Sito
                    : `https://${payload.Sito}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline"
              >
                Visita il sito
              </a>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  if (!activeTipo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Benvenuto</CardTitle>
          <CardDescription>
            Seleziona un <strong>Tipo di Istruzione</strong> dalla barra a
            sinistra per esplorare settori, indirizzi e scuole.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Puoi anche usare la barra di ricerca in alto per trovare rapidamente
            una scuola.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading)
    return (
      <div className="text-sm text-slate-500 animate-pulse">
        Caricamento dati...
      </div>
    );
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <>
      <div className="mb-6 space-y-2 text-slate-900">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Percorsi formativi
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Esplora tipologie, indirizzi e scuole
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl">
          Filtra settori, articola indirizzi e trova rapidamente istituti
          scolastici allineati ai tuoi interessi.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
        {/* Settori */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col max-h-[80vh]">
          <CardHeader className="shrink-0">
            <CardTitle>Settori</CardTitle>
            <CardDescription>Scegli un settore</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 flex-1 overflow-y-auto pr-2">
            {settori.map((s, idx) => {
              const settoreKey = s.Id || `settore-${idx}`;
              const isExpanded = expandedSettoreKey === settoreKey;
              const settoreIndirizzi = getIndirizziBySettore(s) || [];
              return (
                <div key={settoreKey} className="flex items-start gap-2">
                  <button
                    onClick={() => setSelectedSettore(s)}
                    className={
                      "flex-1 text-left rounded-2xl border px-4 py-4 transition duration-200 " +
                      (selectedSettore?.Id === s.Id
                        ? "border-indigo-400 bg-gradient-to-br from-indigo-50 via-white to-sky-50 text-slate-900 shadow"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm")
                    }
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold min-w-0 flex-1">
                        {s.Titolo}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label={`Dettaglio ${s.Titolo}`}
                          className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-indigo-500 shrink-0"
                          onClick={(event) => {
                            event.stopPropagation();
                            openDialog("settori", s);
                          }}
                        >
                          <Info size={16} />
                        </button>
                      </div>
                    </div>
                    {s.Descrizione && (
                      <div
                        className="text-xs text-slate-500 mt-1 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: s.Descrizione }}
                      />
                    )}
                    {isExpanded && (
                      <div className="mt-4 space-y-2">
                        {settoreIndirizzi.length > 0 ? (
                          settoreIndirizzi.map((indirizzo) => {
                            const detailFallback =
                              indirizzo.Certificazione ||
                              (Array.isArray(indirizzo.Descrizioni) &&
                                indirizzo.Descrizioni[0]) ||
                              "";
                            return (
                              <button
                                key={indirizzo.Id || indirizzo.Titolo}
                                type="button"
                                className={
                                  "w-full text-left rounded-2xl border px-3 py-3 transition " +
                                  (selectedIndirizzo?.Id === indirizzo.Id
                                    ? "border-indigo-400 bg-gradient-to-r from-white via-indigo-50 to-sky-50 shadow"
                                    : "border-slate-200 bg-white hover:border-slate-300")
                                }
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedSettore(s);
                                  handleSelectIndirizzo(indirizzo);
                                }}
                              >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div className="text-sm font-semibold min-w-0 flex-1">
                                    {indirizzo.Titolo}
                                  </div>
                                  <button
                                    type="button"
                                    aria-label={`Dettaglio ${indirizzo.Titolo}`}
                                    className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-indigo-500 shrink-0"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.preventDefault();
                                      openDialog("indirizzi", indirizzo);
                                    }}
                                  >
                                    <Info size={14} />
                                  </button>
                                </div>
                                {indirizzo.Descrizione ? (
                                  <div
                                    className="text-xs text-slate-500 mt-1 line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                      __html: indirizzo.Descrizione,
                                    }}
                                  />
                                ) : detailFallback ? (
                                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    {detailFallback}
                                  </div>
                                ) : (
                                  <div className="text-xs text-slate-400 mt-1">
                                    Nessun dettaglio disponibile
                                  </div>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="text-xs text-slate-500">
                            Nessun indirizzo disponibile per questo settore.
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
            {settori.length === 0 && (
              <div className="text-sm text-gray-500">
                Nessun settore disponibile.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Indirizzi */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col max-h-[80vh]">
          <CardHeader className="shrink-0">
            <CardTitle>Indirizzi</CardTitle>
            <CardDescription>
              Articolazioni e opzioni dell'indirizzo selezionato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 flex-1 overflow-y-auto pr-2">
            {indirizziList.map((ind, idx) => {
              const indirizzoKey = ind.Id || `indirizzo-${idx}`;
              const isExpanded = expandedIndirizzoKey === indirizzoKey;
              const articolazioni = Array.isArray(ind.Articolazioni)
                ? ind.Articolazioni
                : [];
              return (
                <div key={indirizzoKey} className="flex items-start gap-2">
                  <button
                    onClick={() => handleSelectIndirizzo(ind)}
                    className={
                      "flex-1 text-left rounded-2xl border px-4 py-4 transition " +
                      (selectedIndirizzo?.Id === ind.Id
                        ? "border-sky-400 bg-gradient-to-br from-sky-50 via-white to-indigo-50 shadow"
                        : "border-slate-200 bg-white hover:border-slate-300")
                    }
                  >
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold min-w-0 flex-1">
                        {ind.Titolo}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label={`Dettaglio ${ind.Titolo}`}
                          className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-sky-500 shrink-0"
                          onClick={(event) => {
                            event.stopPropagation();
                            openDialog("indirizzi", ind);
                          }}
                        >
                          <Info size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={
                            isExpanded
                              ? `Comprimi ${ind.Titolo}`
                              : `Espandi ${ind.Titolo}`
                          }
                          className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-sky-500 shrink-0"
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            toggleIndirizzoExpanded(indirizzoKey);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    {ind.Certificazione && (
                      <div className="text-xs text-slate-500 mt-1">
                        {ind.Certificazione}
                      </div>
                    )}
                    {isExpanded && (
                      <div className="mt-3 space-y-2">
                        {articolazioni.length > 0 ? (
                          articolazioni.map((art) => {
                            const artFallback =
                              art.Certificazione ||
                              art.Descrizione ||
                              (Array.isArray(art.Descrizioni) &&
                                art.Descrizioni[0]) ||
                              "";
                            const isArtSelected =
                              selectedArticolazione?.Id === art.Id;
                            const opzioni = Array.isArray(art.Opzioni)
                              ? art.Opzioni
                              : [];
                            const opzioneMatchesSelection =
                              selectedOpzione &&
                              opzioni.some(
                                (option) => option.Id === selectedOpzione.Id
                              );
                            const isArtActive =
                              isArtSelected || opzioneMatchesSelection;
                            return (
                              <div
                                key={art.Id || art.Titolo}
                                className={
                                  "rounded-2xl bg-white p-3 border transition " +
                                  (isArtActive
                                    ? "border-sky-400 bg-gradient-to-r from-white via-sky-50 to-indigo-50 shadow"
                                    : "border-slate-200")
                                }
                              >
                                <button
                                  type="button"
                                  className={
                                    "flex w-full flex-wrap items-start justify-between text-left gap-2 " +
                                    (isArtActive
                                      ? "font-semibold text-slate-900"
                                      : "font-medium text-slate-700")
                                  }
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleSelectArticolazione(ind, art);
                                  }}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="text-sm font-semibold">
                                      {art.Titolo}
                                    </div>
                                    {artFallback && (
                                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                                        {artFallback}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    aria-label={`Dettaglio ${art.Titolo}`}
                                    className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-sky-500 shrink-0"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.preventDefault();
                                      openDialog("articolazioni", art);
                                    }}
                                  >
                                    <Info size={14} />
                                  </button>
                                </button>
                                {opzioni.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {opzioni.map((opzione) => {
                                      const opFallback =
                                        opzione.Certificazione ||
                                        opzione.Descrizione ||
                                        (Array.isArray(opzione.Descrizioni) &&
                                          opzione.Descrizioni[0]) ||
                                        "";
                                      const isOpSelected =
                                        selectedOpzione?.Id === opzione.Id;
                                      return (
                                        <button
                                          key={opzione.Id || opzione.Titolo}
                                          type="button"
                                          className={
                                            "flex w-full flex-wrap items-start justify-between gap-2 rounded-2xl border bg-slate-50 p-3 text-left text-xs " +
                                            (isOpSelected
                                              ? "border-sky-400 bg-gradient-to-r from-slate-50 via-white to-sky-50 shadow"
                                              : "border-slate-200")
                                          }
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleSelectOpzione(
                                              ind,
                                              art,
                                              opzione
                                            );
                                          }}
                                        >
                                          <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-sm text-slate-900">
                                              {opzione.Titolo}
                                            </div>
                                            {opFallback && (
                                              <div className="text-slate-500 mt-0.5 line-clamp-2">
                                                {opFallback}
                                              </div>
                                            )}
                                          </div>
                                          <button
                                            type="button"
                                            aria-label={`Dettaglio ${opzione.Titolo}`}
                                            className="ml-2 p-1 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-sky-500 shrink-0"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              event.preventDefault();
                                              openDialog("opzioni", opzione);
                                            }}
                                          >
                                            <Info size={12} />
                                          </button>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-slate-500">
                            Nessuna articolazione disponibile per questo
                            indirizzo.
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
            {indirizziList.length === 0 && (
              <div className="text-sm text-gray-500">
                Seleziona un settore per vedere gli indirizzi.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scuole */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col max-h-[80vh]">
          <CardHeader className="shrink-0">
            <CardTitle>Scuole</CardTitle>
            <CardDescription>
              Elenco scuole per l'elemento selezionato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 overflow-y-auto pr-2">
            {scuoleList.map((sc, idx) => (
              <div
                key={sc.IdScuola || idx}
                className="p-4 border border-slate-200 rounded-2xl bg-white relative shadow-sm"
              >
                <button
                  type="button"
                  aria-label={`Dettaglio ${sc.Nome}`}
                  className="absolute top-3 right-3 p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-indigo-500"
                  onClick={() => openDialog("scuole", sc)}
                >
                  <Info size={16} />
                </button>
                <div className="font-semibold text-slate-900 pr-8">
                  {sc.Nome}
                </div>
                <div className="text-xs text-slate-600">
                  {sc.Indirizzo} - {sc.Comune} ({sc.CAP})
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {sc.Sito ? (
                    <a
                      className="underline decoration-dashed decoration-indigo-300 text-indigo-500"
                      href={
                        sc.Sito.startsWith("http")
                          ? sc.Sito
                          : `https://${sc.Sito}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Sito
                    </a>
                  ) : (
                    "N/D"
                  )}
                  {" - "}
                  <span className="font-medium text-slate-600">
                    {sc.Email || "N/D"}
                  </span>
                  {" - "}
                  <span className="font-medium text-slate-600">
                    {sc.Telefono || "N/D"}
                  </span>
                </div>
              </div>
            ))}
            {(selectedIndirizzo || selectedArticolazione || selectedOpzione) &&
              scuoleList.length === 0 && (
                <div className="text-sm text-slate-500">
                  Nessuna scuola trovata per questo elemento.
                </div>
              )}
            {!selectedIndirizzo &&
              !selectedArticolazione &&
              !selectedOpzione && (
                <div className="text-sm text-slate-500">
                  Seleziona un indirizzo, un'articolazione o un'opzione per
                  vedere le scuole.
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {dialog.open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{dialogTitleMap[dialog.section]}</CardTitle>
                <button
                  type="button"
                  aria-label="Chiudi dettagli"
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={closeDialog}
                >
                  <X size={18} />
                </button>
              </div>
            </CardHeader>
            <CardContent>{renderDialogContent()}</CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
