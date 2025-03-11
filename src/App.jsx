import CoreConcepts from "./components/CoreConcepts";
import Examples from "./components/Examples";
import Header from "./components/Header/Header";
import Zones from "./components/Zones";

function App() {
  return (
    <>
      <Header></Header>
      <main>
        <Zones></Zones>
        <CoreConcepts></CoreConcepts>
        <Examples></Examples>
      </main>
    </>
  );
}

export default App;
