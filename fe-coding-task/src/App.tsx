import { Providers } from "./Providers";
import { useStore } from "./store";

// Naprawa, żeby linki poprawnie działały
// Wpisane rzeczy do inputa w local Storage (Zustand persist)
// Podpięcie RHF do wyświetlenie błędu, jak brakuje danych wpisanych w jakiś input

// Refaktoring

function App() {
  const store = useStore((state) => state);
  console.log("store", store);

  return (
    <>
      <Providers />
    </>
  );
}

export default App;
