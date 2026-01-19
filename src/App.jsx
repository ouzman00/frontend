import { useEffect, useState } from "react";
import "./App.css";
import Carte from "./component/Carte";

function App() {
  const API = import.meta.env.VITE_API_BASE_URL; // ✅
  const [hopitauxData, setHopitauxData] = useState(null);
  const [ecolesData, setEcolesData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!API) {
      setError("VITE_API_BASE_URL n'est pas défini (env).");
      return;
    }

    Promise.all([
      fetch(`${API}/api/hopitaux/`).then((res) => {
        if (!res.ok) throw new Error(`Hopitaux HTTP ${res.status}`);
        return res.json();
      }),
      fetch(`${API}/api/ecoles/`).then((res) => {
        if (!res.ok) throw new Error(`Ecoles HTTP ${res.status}`);
        return res.json();
      }),
    ])
      .then(([h, e]) => {
        setHopitauxData(h);
        setEcolesData(e);
      })
      .catch((err) => {
        console.error("Erreur fetch :", err);
        setError(err.message);
      });
  }, [API]);

  if (error) return <div>Erreur API: {error}</div>;
  if (!hopitauxData || !ecolesData) return <div>Chargement des données...</div>;

  return <Carte hopitauxData={hopitauxData} ecolesData={ecolesData} />;
}

export default App;
