import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Verify from "./components/Verify";
import Home from "./pages/Home";
import Brain from "./pages/Brain";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/brain" element={<Home />} />
        <Route path="/brain/:link" element={<Brain />} />
      </Routes>
    </Router>
  );
}

export default App;
