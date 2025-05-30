import { useState } from "react"
import { validate } from "react-email-validator"
import { Link, useNavigate } from "react-router-dom"
import { MdOutlineEmail, MdLockOutline } from "react-icons/md"
import { MdPersonOutline } from "react-icons/md"
import TopHeader from "../components/Header"
import ReCAPTCHA from "react-google-recaptcha"
import "../css/Header.css"
import "../css/Register.css"

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
            <TopHeader />

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

    // return (
    //     <div className="register-wrapper">
    //         <h1>Se registre</h1>
    //         <div>
    //             <div>
    //                 <label htmlFor="name">Nome:</label>
    //                 <input type="text" name="name" id="nameInput" placeholder="Digite o seu nome..." onChange={e => setName(e.target.value)} required />
    //             </div>
    //             <div>
    //                 <label htmlFor="email">Email:</label>
    //                 <input type="email" name="email" id="emailInput" placeholder="email@gmail.com" onChange={e => setEmail(e.target.value)} required />
    //             </div>
    //             <div>
    //                 <label htmlFor="password">Password:</label>
    //                 <input type="password" name="password" id="passwordInput" placeholder="Digite a sua senha..." onChange={e => setPassword(e.target.value)} required />
    //             </div>
    //             <div>
    //                 <label htmlFor="confirmPassword">Confirm Password:</label>
    //                 <input type="password" name="confirmPassword" id="confirmPasswordInput" placeholder="Confirme a sua senha..." onChange={e => setConfirmPassword(e.target.value)} required />
    //             </div>
    //             <div>
    //                 <ReCAPTCHA sitekey="6LdYRkorAAAAADYL-JYYlkMGlbFETAs6wy0WHEad" onChange={setCaptchaToken}/>
    //             </div>
    //             <div>
    //                 <button onClick={postUser}>Register</button>
    //             </div>
    //         </div>
    //     </div>
    // )
}

export default Register