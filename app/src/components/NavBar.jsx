import { NavLink } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LuMoon, LuSun, LuSearch } from "react-icons/lu";
import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Avatar,
  Autocomplete,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useAssetsData } from "../data/assetsData";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import "../css/NavBar.css";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, userName } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { autocompleteOptions } = useAssetsData();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const searchInputRef = useRef(null);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
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
    handleClose();
    toggleMobileMenu();
  };

  const navItems = [
    { to: "/", label: "INÍCIO" },
    { to: "/market", label: "MERCADO" },
    ...(isAuthenticated ? [{ to: "/wallets", label: "CARTEIRAS" }] : []),
    { to: "/calculators", label: "CALCULADORAS" },
    { to: "/about", label: "SOBRE" },
  ];

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

        {!isAuthPage && !isMobile && (
          <>
            <div className="navbar-center">
              <nav className="navbar-links">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? "nav-item nav-item-active" : "nav-item"
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="navbar-right">
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
              <button className="icon-button" onClick={toggleTheme}>
                {theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
              </button>
              {!isAuthenticated && (
                <NavLink to="/login">
                  <button className="home-login-btn primary-btn">Entrar</button>
                </NavLink>
              )}
              {isAuthenticated && (
                <>
                  <Avatar className="user-avatar" onClick={handleMenuClick}>
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    className="user-avatar-menu-container"
                  >
                    <div></div>
                    <MenuItem
                      onClick={handleLogout}
                      className="user-avatar-menu"
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </>
        )}

        {!isAuthPage && isMobile && (
          <div className="navbar-right-mobile">
            <button
              className="icon-button mobile-theme-toggle"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
            </button>
            <button
              className="icon-button mobile-menu-toggle"
              onClick={toggleMobileMenu}
            >
              <div className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
              </div>
            </button>
          </div>
        )}

        {!isAuthPage && (
          <Drawer
            anchor="right"
            open={isMobileMenuOpen}
            onClose={toggleMobileMenu}
            PaperProps={{ className: "navbar-drawer" }}
          >
            <div className="navbar-drawer-header">
              <img src={logoSrc} alt="Logo" className="navbar-drawer-logo" />
              {/* Removed drawer-close-btn */}
            </div>
            <List className="navbar-drawer-list">
              {navItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.to}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) =>
                      isActive ? "nav-item nav-item-active" : "nav-item"
                    }
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <div className="navbar-drawer-actions">
              <div className="navbar-search-container drawer-search-container">
                <div className="navbar-search">
                  <LuSearch
                    size={20}
                    className="navbar-search-icon navbar-search-icon-active"
                  />
                  <Autocomplete
                    freeSolo
                    disableClearable
                    disablePortal
                    forcePopupIcon={false}
                    className="navbar-autocomplete-active"
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
                        setSearchValue("");
                        toggleMobileMenu();
                      }
                    }}
                    inputValue={searchValue}
                    onInputChange={(e, value) => setSearchValue(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Pesquise ativos..."
                        InputProps={{
                          ...params.InputProps,
                          className: "navbar-search-input",
                        }}
                      />
                    )}
                  />
                </div>
              </div>
              {/* Removed drawer-theme-btn */}
              {!isAuthenticated && (
                <NavLink to="/login" onClick={toggleMobileMenu}>
                  <button className="home-login-btn primary-btn drawer-login-btn">
                    Entrar
                  </button>
                </NavLink>
              )}
              {isAuthenticated && (
                <>
                  <button className="user-avatar-btn" onClick={handleMenuClick}>
                    <Avatar className="user-avatar">
                      {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </Avatar>
                    <span className="user-avatar-label">Perfil</span>
                  </button>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    className="user-avatar-menu-container"
                  >
                    <div></div>
                    <MenuItem
                      onClick={handleLogout}
                      className="user-avatar-menu"
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </Drawer>
        )}
      </header>
    </div>
  );
}

export default Navbar;
