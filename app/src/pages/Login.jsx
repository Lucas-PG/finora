import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../css/Login.css";
import { MdOutlineEmail, MdLockOutline, MdLockOpen } from "react-icons/md";
import NavBar from "../components/NavBar";

function IconInput({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  onClick = "",
}) {
  return (
    <div className="icon-input-wrapper-login">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <span className="input-icon-login">
        <Icon onClick={onClick} />
      </span>
    </div>
  );
}

IconInput.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.elementType.isRequired,
};

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(true);
  const navigate = useNavigate();

  async function userLogin(credentials) {
    const response = await fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = await userLogin({ email, password });
    if (userInfo.token) {
      setToken(userInfo.token);
      navigate("/");
    } else {
      alert("Credenciais inválidas. Tente novamente.");
      setToken(null);
    }
  };

  return (
    <>
      <NavBar />

      <div className="login-wrapper">
        <h1>BEM-VINDO</h1>
        <form onSubmit={handleSubmit}>
          <IconInput
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={MdOutlineEmail}
          />
          {!seePassword && (
            <IconInput
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={MdLockOutline}
              onClick={setSeePassword(true)}
            />
          )}
          {seePassword && (
            <IconInput
              type="text"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={MdLockOpen}
              onClick={setSeePassword(false)}
            />
          )}
          <button type="submit" className="login-btn">
            Entrar
          </button>

          <div className="divider">
            <span>ou</span>
          </div>
        </form>

        <p>
          Não possui conta?{" "}
          <Link to="/register" className="register-link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
