import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Flights from "./pages/Flights";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/flights" element={<Flights />} />
    </Routes>
  );
}

export default App;
