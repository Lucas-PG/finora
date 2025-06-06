import { useState } from "react";
import { validate } from "react-email-validator";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../components/ui/FloatingInput";
import { FaLock, FaUnlock, FaEnvelope } from "react-icons/fa";
import PropTypes from "prop-types";
import ReCAPTCHA from "react-google-recaptcha";
import NavBar from "../components/NavBar";
import "../css/Login.css";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [seePassword, setSeePassword] = useState(true);
  const navigate = useNavigate();

  async function userLogin(credentials) {
    if (!validate(credentials.email)) {
      return {};
    }
    const response = await fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = await userLogin({ email, password, captchaToken });
    if (userInfo.token) {
      setToken(userInfo.token);
      navigate("/");
    } else {
      alert("Invalid Credentials or Missing Captcha. Try again.");
      setToken(null);
    }
    window.location.reload();
  };

  return (
    <>
      <NavBar />
      <div className="login-container">
        <div className="login-content">
          <h1>BEM-VINDO</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <FloatingInput
              type="email"
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={FaEnvelope}
            />
            <FloatingInput
              type="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={{ Closed: FaLock, Open: FaUnlock }}
            />
            <ReCAPTCHA
              sitekey="6LdnzVcrAAAAAKZwfRfIxRjypg7gbZ-gAvyaElLY"
              onChange={setCaptchaToken}
              className="captcha"
            />
            <button type="submit" className="primary-btn login-btn">
              Entrar
            </button>
            <div className="divider">
              <div>ou</div>
            </div>
          </form>
          <p className="login-register-p">
            Não possui conta?
            <Link to="/register" className="register-link">
              {" "}
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;

