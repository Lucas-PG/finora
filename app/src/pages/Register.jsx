import { useState, useRef, useEffect } from "react";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { validate } from "react-email-validator";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi2";
import { MdPersonOutline } from "react-icons/md";
import "../css/Register.css";
import NavBar from "../components/NavBar.jsx";

function IconInput({ type, placeholder, value, onChange, icon: Icon }) {
  return (
    <div className="icon-input-wrapper-register">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <span className="input-icon-register">
        <Icon />
      </span>
    </div>
  );
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpf, setCPF] = useState("");
  const [clickPos, setClickPos] = useState(null);
  const [randomCaptcha, setRandomCaptcha] = useState("");
  const navigate = useNavigate();

  const captchaImageUrl = randomCaptcha ? `/captcha/${randomCaptcha}` : null;
  const imageRef = useRef();

  const postUser = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !cpf ||
      clickPos === null
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    const valid = await validateCaptcha();
    if (!valid) {
      alert("Captcha inválido.");
      return;
    }

    if (!validate(email)) {
      alert("Email inválido.");
      return;
    }

    if (!cpfValidator.isValid(cpf)) {
      alert("CPF inválido.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const data = { name, email, password, confirmPassword, cpf };
    const response = await fetch("http://localhost:3001/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseMsg = await response.text();
      alert(responseMsg);
      return;
    }

    alert("Cadastro realizado com sucesso!");
    navigate("/login");
  };

  const validateCaptcha = async () => {
    const data = { captcha: randomCaptcha, x: clickPos.x, y: clickPos.y };
    const response = await fetch("http://localhost:3001/captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json.valid;
  };

  const handleCaptchaClick = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    setClickPos({ x: clickX, y: clickY });
  };

  const getRandomCaptcha = async () => {
    const response = await fetch("http://localhost:3001/captcha", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    setRandomCaptcha(json.captcha);
  };

  useEffect(() => {
    getRandomCaptcha();
  }, []);

  return (
    <>
      <NavBar />

      <div className="register-wrapper">
        <h1>CRIE UMA CONTA</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            postUser();
          }}
        >
          <IconInput
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={MdPersonOutline}
          />
          <IconInput
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={MdOutlineEmail}
          />
          <IconInput
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={MdLockOutline}
          />
          <IconInput
            type="password"
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={MdLockOutline}
          />
          {/* <IconInput */}
          {/*   type="text" */}
          {/*   placeholder="CPF" */}
          {/*   value={cpf} */}
          {/*   onChange={(e) => setCPF(e.target.value)} */}
          {/*   icon={HiOutlineIdentification} */}
          {/* /> */}

          {/* <div */}
          {/*   style={{ */}
          {/*     position: "relative", */}
          {/*     display: "inline-block", */}
          {/*     marginTop: "1rem", */}
          {/*   }} */}
          {/* > */}
          {/*   <p>Para passar no Captcha, clique na face do animal.</p> */}
          {/*   <img */}
          {/*     ref={imageRef} */}
          {/*     src={captchaImageUrl} */}
          {/*     alt="captcha" */}
          {/*     onClick={handleCaptchaClick} */}
          {/*     style={{ cursor: "crosshair", maxWidth: "100%" }} */}
          {/*   /> */}
          {/*   {clickPos && ( */}
          {/*     <div */}
          {/*       style={{ */}
          {/*         position: "absolute", */}
          {/*         top: clickPos.y - 9, */}
          {/*         left: clickPos.x - 9, */}
          {/*         width: 20, */}
          {/*         height: 20, */}
          {/*         backgroundColor: "yellow", */}
          {/*         borderRadius: "50%", */}
          {/*         pointerEvents: "none", */}
          {/*       }} */}
          {/*     /> */}
          {/*   )} */}
          {/* </div> */}

          <button type="submit" className="register-btn">
            Registrar
          </button>

          <div className="divider">
            <span>ou</span>
          </div>

          <p>
            Já tem uma conta?{" "}
            <Link to="/login" className="login-link">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;
