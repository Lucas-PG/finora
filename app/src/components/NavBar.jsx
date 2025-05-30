import { NavLink } from "react-router-dom"
import { CiSearch, CiLight, CiUser } from "react-icons/ci"
import "../css/NavBar.css"

function Navbar() {
  return (
    <div className="navbar-container">
      <header className="navbar">
        <div className="navbar-left">
          <NavLink to="/">
            <img
              src="/img/finora-logo.png"
              alt="Logo"
              className="navbar-logo"
            />
          </NavLink>
        </div>

        <div className="navbar-center">
          <nav className="navbar-links">
            <NavLink
              to="/assets"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Ativos
            </NavLink>
            <NavLink
              to="/wallets"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Carteiras
            </NavLink>
            <NavLink
              to="/calculators"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Calculadoras
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Sobre
            </NavLink>
          </nav>
          <div className="navbar-search">
            <CiSearch className="search-icon" />
            <input type="text" placeholder="Buscar..." />
          </div>
        </div>
        <div className="navbar-right">
          <button className="icon-button">
            <CiLight size={26} />
          </button>
          <NavLink to="/login">
            <button className="icon-button">
              <CiUser size={26} />
            </button>
          </NavLink>
        </div>
      </header>
    </div>
  )
}

export default Navbar