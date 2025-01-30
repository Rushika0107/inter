import "./App.css";
import Navbar from "./components/Navbar.tsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home.tsx";
import MovieList from "./Pages/MovieList.tsx";
import MovieDetails from "./Pages/MovieDetails.tsx";
import Toprated from "./Pages/Toprated.jsx";
import Actordetails from "./Pages/Actordetails.tsx";
import LoginPage from "./Pages/LoginPage.tsx";
import ProfilePage from "./Pages/ProfilePage.tsx";
import ActorProfilePage from "./Pages/ActorProfilePage.tsx";
import ConditionalRoute from "./components/ConditionalRoute.tsx";
import Tvdetails from "./Pages/Tvdetails.tsx";
import FavoriteActorsPage from "./Pages/FavoriteActorsPage.tsx";
import { useEffect, useState } from "react";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" }
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/actors" element={<ActorProfilePage />} />
        <Route path="/" element={<ConditionalRoute />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/actor/:id" element={<Actordetails />} />
        <Route path="tv/:id" element={<Tvdetails />} />
        <Route path="/favorites" element={<FavoriteActorsPage />} />
        <Route path="/top-rated" element={<Toprated />} />
      </Routes>
    </>
  );
};

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        } transition-all duration-500`}
      >
        <Navbar toggleTheme={toggleTheme} theme={theme} />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
