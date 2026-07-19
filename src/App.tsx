import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useLayoutEffect, type CSSProperties } from "react";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Admin from "./pages/Admin";
import LogIn from "./pages/LogIn";
import MiniInfo from "./pages/MiniInfo";
import Gallery from "./pages/Gallery";
import Search from "./pages/Search";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { getAllMinis } from "./services/minisApi";
import { isAuthenticated } from "./services/auth";
import { allThemes } from "./assets/allThemes";
import type { Mini, Theme } from "./types/mini";

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [data, setData] = useState<Mini[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    getAllMinis().then((response) => {
      setData(response);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    isAuthenticated().then(setIsAuthed);
  }, []);

  useLayoutEffect(() => {
    const localStorageTheme = localStorage.getItem("theme");
    if (localStorageTheme === "light" || localStorageTheme === "dark") {
      setTheme(localStorageTheme);
    }
  }, []);

  return (
    <div
      className="background-main"
      style={allThemes[theme] as CSSProperties}
    >
      <Router basename="/mini-website">
        <Navbar isAuthed={isAuthed} theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
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
