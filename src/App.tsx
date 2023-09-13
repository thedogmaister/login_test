import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import RoutesCustom from "./routes/routes";

function App() {
  return (
    <>
      <PrimeReactProvider>
        <RoutesCustom></RoutesCustom>
      </PrimeReactProvider>
    </>
  );
}

export default App;
