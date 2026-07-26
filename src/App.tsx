import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { Toaster } from "./components/ui/sonner";
import { getAllMinis } from "./services/minisApi";
import { isAuthenticated } from "./services/auth";
import type { Mini } from "./types/mini";

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [data, setData] = useState<Mini[]>([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllMinis().then((response) => {
      setData(response);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    isAuthenticated().then(setIsAuthed);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Router basename="/mini-website">
        <Navbar isAuthed={isAuthed} data={data} />
        <Routes>
          <Route path="/" element={<Home data={data} loading={loading} />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/about" element={<About data={data} loading={loading} />} />
          <Route path="/gallery" element={<Gallery data={data} loading={loading} />} />
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

      <Toaster />
    </div>
  );
}

export default App;
