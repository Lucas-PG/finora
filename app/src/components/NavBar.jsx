import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { CiSearch, CiLight, CiDark, CiUser, CiSettings } from "react-icons/ci";
import "../css/NavBar.css";
import { useTheme } from "./ThemeContext";
import { useLocation } from "react-router-dom";

function playClickSound() {
  const audio = new Audio("/sounds/click.mp3");
  audio.play();
}

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoSrc =
    theme === "light" ? "/img/logo-black.png" : "/img/finora-logo.png";

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const toggleSearch = () => {
    setIsSearching((prev) => !prev);
  };

  return (
    <div
      className={`navbar-container ${isScrolled ? "navbar-active" : "navbar-inactive"}`}
    >
      <header className="navbar">
        <div className="navbar-left">
          <NavLink to="/">
            <img src={logoSrc} alt="Logo" className="navbar-logo" />
          </NavLink>
        </div>

        {location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <div className="navbar-center">
              <nav className="navbar-links">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-item nav-item-active" : "nav-item"
                  }
                >
                  INÍCIO
                </NavLink>
                <NavLink
                  to="/assets"
                  className={({ isActive }) =>
                    isActive ? "nav-item nav-item-active" : "nav-item"
                  }
                  // onClick={playClickSound}
                >
                  MERCADO
                </NavLink>
                <NavLink
                  to="/wallets"
                  className={({ isActive }) =>
                    isActive ? "nav-item nav-item-active" : "nav-item"
                  }
                  // onClick={playClickSound}
                >
                  CARTEIRAS
                </NavLink>
                <NavLink
                  to="/calculators"
                  className={({ isActive }) =>
                    isActive ? "nav-item nav-item-active" : "nav-item"
                  }
                  // onClick={playClickSound}
                >
                  CALCULADORAS
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "nav-item nav-item-active" : "nav-item"
                  }
                  // onClick={playClickSound}
                >
                  SOBRE
                </NavLink>
              </nav>
            </div>
          )}

        <div className="navbar-right">
          {!isAuthPage && (
            <div className="navbar-search-container">
              <button type="button" className="navbar-search">
                <CiSearch
                  size={26}
                  className={`navbar-search-icon ${isSearching ? "navbar-search-icon-active" : ""}`}
                  onClick={toggleSearch}
                />
                <input
                  type="text"
                  placeholder="Pesquise..."
                  className={`navbar-search-input ${isSearching ? "" : "navbar-search-input-inactive"}`}
                />
              </button>
            </div>
          )}
          <button className="icon-button" onClick={toggleTheme}>
            {theme === "dark" ? <CiLight size={26} /> : <CiDark size={26} />}
          </button>
          {!isAuthPage && (
            <NavLink to="/login">
              <button className="home-login-btn">Entrar</button>
            </NavLink>
          )}
        </div>
      </header>
    </div>
  );
}

export default Navbar;

