import { NavLink } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LuMoon, LuSun, LuSearch } from "react-icons/lu";
import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Avatar, Autocomplete, TextField } from "@mui/material";
import { useAssetsData } from "../data/assetsData";
import "../css/NavBar.css";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, userName } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { autocompleteOptions } = useAssetsData();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const searchInputRef = useRef(null);

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
    setIsSearching((prev) => {
      const newState = !prev;
      setTimeout(() => {
        if (newState && searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
      return newState;
    });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/logout");
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
                  to="/market"
                  className={({ isActive }) =>
                    isActive ? "nav-item nav-item-active" : "nav-item"
                  }
                >
                  MERCADO
                </NavLink>
                {isAuthenticated && (
                  <NavLink
                    to="/wallets"
                    className={({ isActive }) =>
                      isActive ? "nav-item nav-item-active" : "nav-item"
                    }
                  >
                    CARTEIRAS
                  </NavLink>
                )}
                <NavLink
                  to="/calculators"
                  className={({ isActive }) =>
                    isActive ? "nav-item nav-item-active" : "nav-item"
                  }
                >
                  CALCULADORAS
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "nav-item nav-item-active" : "nav-item"
                  }
                >
                  SOBRE
                </NavLink>
              </nav>
            </div>
          )}

        <div className="navbar-right">
          {!isAuthPage && (
            <div className="navbar-search-container">
              <div className="navbar-search">
                <LuSearch
                  size={20}
                  className={`navbar-search-icon ${isSearching ? "navbar-search-icon-active" : ""}`}
                  onClick={toggleSearch}
                />
                <Autocomplete
                  freeSolo
                  disableClearable
                  disablePortal
                  forcePopupIcon={false}
                  className={
                    isSearching
                      ? "navbar-autocomplete-active"
                      : "navbar-autocomplete-inactive"
                  }
                  options={autocompleteOptions}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.title
                  }
                  slotProps={{
                    paper: {
                      sx: {
                        backgroundColor: "var(--primary)",
                        color: "var(--foreground)",
                      },
                      className: "navbar-autocomplete-paper",
                    },
                  }}
                  isOptionEqualToValue={(option, value) =>
                    typeof option === "string" || typeof value === "string"
                      ? option === value
                      : option.title === value.title
                  }
                  onChange={(event, newValue) => {
                    if (newValue?.link) {
                      navigate(newValue.link);
                      setIsSearching(false);
                      setSearchValue("");
                    }
                  }}
                  inputValue={searchValue}
                  onInputChange={(e, value) => setSearchValue(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={searchInputRef}
                      variant="outlined"
                      placeholder="Pesquise ativos..."
                      InputProps={{
                        ...params.InputProps,
                        className: `navbar-search-input ${!isSearching ? "navbar-search-input-inactive" : ""}`,
                      }}
                    />
                  )}
                />
              </div>
            </div>
          )}
          <button className="icon-button" onClick={toggleTheme}>
            {theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
          </button>
          {!isAuthPage && !isAuthenticated && (
            <NavLink to="/login">
              <button className="home-login-btn primary-btn">Entrar</button>
            </NavLink>
          )}
          {!isAuthPage && isAuthenticated && (
            <>
              <Avatar className="user-avatar" onClick={handleMenuClick}>
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                className="user-avatar-menu-container"
              >
                <div className=""></div>
                <MenuItem onClick={handleClose} className="user-avatar-menu">
                  Configurações
                </MenuItem>
                <MenuItem onClick={handleLogout} className="user-avatar-menu">
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default Navbar;
