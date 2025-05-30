import { NavLink } from "react-router-dom"
import { CiLight } from "react-icons/ci"
import "../css/NavBar.css"

function Header() {
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
        <div className="navbar-right">
          <button className="icon-button">
            <CiLight size={26} />
          </button>
        </div>
      </header>
    </div>
  )
}

export default Header