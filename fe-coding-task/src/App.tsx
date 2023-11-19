import { Providers } from "./Providers";

//  Ładny background, a sam formularz na białym tle z zaokrąglonymi rogami
//  Zustand do zarządzania stanem, RHF do wyświetlenie błędu, jak brakuje danych

//  Parametry powinny być zachowane między sesjami przeglądarki (chatGPT zapytaj albo zustand)
//  Possibility to add and edit single comment for the presented statistics.
//  We would like you also to add the possibility to save statistics for further use with the
//  The comment may be stored in Local Storage, so it can be later used when viewing the statistics.

function App() {
  return (
    <>
      <Providers />
    </>
  );
}

export default App;
