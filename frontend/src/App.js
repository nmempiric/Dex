// import "./App.css";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Swap from "./components/Swap";
import Token from "./components/Token";

function App(props) {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Swap Account={props.Account} Balance={props.Balance}/>}
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
