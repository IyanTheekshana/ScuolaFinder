import MainComponent from "../components/MainComponent";
import { ScuoleProvider } from "../context/ScuoleContext";
import { fetchScuole } from "../lib/fetchData";

export default async function Home() {
  let initialData = null;
  let initialError = null;

  try {
    initialData = await fetchScuole();
  } catch (error) {
    initialError =
      error?.message || "Errore inatteso durante il caricamento dei dati";
  }

  return (
    <ScuoleProvider initialData={initialData} initialError={initialError}>
      <MainComponent />
    </ScuoleProvider>
  );
}
