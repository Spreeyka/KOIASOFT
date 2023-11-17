import "./App.css";
import { SimpleBarChart } from "./Chart";

// - routing podpiąć
// - Parametry z formularza powinny być w adresie URL
// - parametry powinny być zachowane między sesjami przeglądarki

// - Możliwość zapisywania statystyk do dalszego wykorzystania
// - Możliwość dodawania pojedynczych komentarzy do prezentowanych statystyk
// - Możliwość edytowania pojedynczych komentarzy do prezentowanych statystyk
// - Komentarz może być przechowywany w pamięci lokalnej (Local storage)

function App() {
  const priceValuesByDate = priceValues.map((value, index) => ({ date: quartersRange[index], price: value }));

  return (
    <>
      <main>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(typeOfDwellings, null, 2)}</pre>
        <pre>{JSON.stringify(quartersAvailableByYear, null, 2)}</pre>
        <pre>{JSON.stringify(yearsAvailable, null, 2)}</pre> */}

        <SimpleBarChart priceValuesByDate={priceValuesByDate}></SimpleBarChart>
      </main>
    </>
  );
}

export default App;
