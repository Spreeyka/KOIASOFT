import { Providers } from "./Providers";
import { useStore } from "./store";

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
