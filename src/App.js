import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import LogIn from "./pages/LogIn";
import { ToastContainer } from "react-toastify";

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

      <ToastContainer />
    </>
  );
}

export default App;
