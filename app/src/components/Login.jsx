import { useState } from "react"
import { validate } from "react-email-validator"
import PropTypes from "prop-types"
import ReCAPTCHA from "react-google-recaptcha";

function Login({ setToken }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [captchaToken, setCaptchaToken] = useState(null)

    async function userLogin(credentials) {
        if (!validate(credentials.email)) {
            return {}
        }
        const response = await fetch("http://localhost:3001/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        })
        return await response.json()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userInfo = await userLogin({email, password, captchaToken})
        if (userInfo.token) { 
            setToken(userInfo.token)
        } 
        else {
            alert("Invalid Credentials or Missing Captcha. Try again.")
            setToken(null)
        }
        window.location.reload()
    }

    return(
        <div className="login-wrapper">
            <h1>Faça o Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Senha:</label>
                    <input type="password" name="password" onChange={e => setPassword(e.target.value)} required />
                </div>
                <div>
                    <ReCAPTCHA sitekey="6LdYRkorAAAAADYL-JYYlkMGlbFETAs6wy0WHEad" onChange={setCaptchaToken}/>
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
  )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default Login