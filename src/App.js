import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import LogIn from "./pages/LogIn";

function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  return (
    <>
      <Router>
        <Navbar isAuthed={isAuthed} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<LogIn setIsAuthed={setIsAuthed} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
