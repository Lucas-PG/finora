import { useState } from "react"
import { validate } from "react-email-validator"
import { Link, useNavigate } from "react-router-dom"
import { MdOutlineEmail, MdLockOutline } from "react-icons/md"
import { MdPersonOutline } from "react-icons/md"
import ReCAPTCHA from "react-google-recaptcha"
import "../css/NavBar.css"
import "../css/Register.css"
import Navbar from "../components/NavBar"

function IconInput({ type, placeholder, value, onChange, icon: Icon }) {
    return (
        <div className="icon-input-wrapper-register">
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
            <span className="input-icon-register"> <Icon /></span>
        </div>
    )
}

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [captchaToken, setCaptchaToken] = useState(null)
    const navigate = useNavigate()

    const postUser = async () => {
        if (name.trim() === "" || email.trim() === "" || password === "" || confirmPassword.trim() === "") {
            alert("Empty field.")
            return
        }
        if (!captchaToken) {
            alert("Invalid Captcha.")
            return
        }
        if (!validate(email)) {
            alert("Invalid email.")
            return
        }
        if (password !== confirmPassword) {
            alert("Password is not equal to Confirm Password.")
            return
        }
        let data = {name: name, email: email, password: password, confirmPassword: confirmPassword, captchaToken: captchaToken}
        const response = await fetch("http://localhost:3001/user/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            const responseMsg = await response.text()
            alert(responseMsg)
            window.location.reload()
            return
        }
        alert("User Registered!")
        navigate("/login")
    }

    return (
        <>
            <Navbar />

            <div className="register-wrapper">
                <h1>CRIE UMA CONTA</h1>
                <form
                onSubmit={(e) => {
                    e.preventDefault()
                    postUser()
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
                <ReCAPTCHA sitekey="6LdYRkorAAAAADYL-JYYlkMGlbFETAs6wy0WHEad" onChange={setCaptchaToken}/>
                <button type="submit">Registrar</button>

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
    )
}

export default Register