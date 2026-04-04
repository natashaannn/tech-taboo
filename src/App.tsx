import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CardGenerator } from "@/pages/CardGenerator";
import Manufacturer from "@/pages/Manufacturer";
import { Packaging } from "@/pages/Packaging";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardGenerator />} />
        <Route path="/manufacturer" element={<Manufacturer />} />
        <Route path="/packaging" element={<Packaging />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
