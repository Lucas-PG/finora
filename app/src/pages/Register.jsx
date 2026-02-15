import { useState } from "react";
import { validate } from "react-email-validator";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../components/ui/FloatingInput";
import { FaLock, FaUnlock, FaEnvelope, FaUser } from "react-icons/fa";
// import ReCAPTCHA from "react-google-recaptcha"; // CAPTCHA desativado
import NavBar from "../components/NavBar";
import "../css/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [captchaToken, setCaptchaToken] = useState(null); // CAPTCHA desativado
  const navigate = useNavigate();

  const postUser = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!validate(email)) {
      alert("E-mail inválido.");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const data = {
      name,
      email,
      password,
      confirmPassword,
    };

    const response = await fetch("http://localhost:3001/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      alert(result.data || "Erro ao registrar.");
      window.location.reload();
      return;
    }

    alert("Usuário registrado com sucesso!");
    navigate("/login");
  };

  return (
    <>
      <NavBar />
      <div className="register-container">
        <div className="register-content">
          <h1>CRIE UMA CONTA</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              postUser();
            }}
            className="register-form"
          >
            <FloatingInput
              type="text"
              label="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={FaUser}
            />
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
            <FloatingInput
              type="password"
              label="Confirme a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={{ Closed: FaLock, Open: FaUnlock }}
            />
            {/* <ReCAPTCHA
              sitekey="6LdnzVcrAAAAAKZwfRfIxRjypg7gbZ-gAvyaElLY"
              onChange={setCaptchaToken}
              className="captcha"
            /> */}
            <button type="submit" className="primary-btn register-btn">
              Registrar
            </button>
            <div className="divider">
              <div>ou</div>
            </div>
          </form>
          <p className="register-login-p">
            Já tem uma conta?
            <Link to="/login" className="register-link">
              {" "}
              Faça login{" "}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
