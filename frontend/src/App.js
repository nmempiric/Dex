// import "./App.css";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Swap from "./components/Swap";
import Token from "./components/Token";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={<Swap/>}
        />
        <Route
          path="/token"
          element={<Token/>}
        />
       
      </Routes>
    </>
  );
}

export default App;
