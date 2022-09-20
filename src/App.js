import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./pages/Admin";
import LogIn from "./pages/LogIn";
import MiniInfo from "./pages/MiniInfo";
import Gallery from "./pages/Gallery";
import Search from "./pages/Search";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import getMinis from "./helperFunctions/firebaseGetAllMinis";
import { allThemes } from "./assets/allThemes";

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    getMinis().then((response) => {
      setData(response);
      setIsLoading(false);
    });
  }, []);

  useLayoutEffect(() => {
    console.log(localStorage.getItem("theme"));
    const localStorageTheme = localStorage.getItem("theme");
    if (localStorageTheme) setTheme(localStorageTheme);
  }, []);

  return (
    <div className="background-main" style={allThemes[theme]}>
      <Router basename="/mini-website">
        <Navbar isAuthed={isAuthed} theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery data={data} />} />
          <Route path="/admin" element={<PrivateRoute isAuthed={isAuthed} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="/login" element={<LogIn setIsAuthed={setIsAuthed} />} />
          <Route
            path="/miniInfo/:miniId"
            element={<MiniInfo data={data} loading={loading} />}
          />
          <Route
            path="/search"
            element={<Search data={data} loading={loading} />}
          />
        </Routes>
      </Router>

      <ToastContainer />
    </div>
  );
}

export default App;
