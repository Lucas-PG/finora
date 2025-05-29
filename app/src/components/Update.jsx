import { useState, useEffect } from "react"

function Update({ token, onLogout }) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        const getInformations = async () => {
            const response = await fetch("http://localhost:3001/user/info", {
                method: "GET",
                headers: {"Authorization": `Bearer ${token}`}
            })
            let data = await response.json()
            data = data[0]
            setName(data.name)
            setEmail(data.email)
        }

        getInformations()
    }, [token])

    const updatePassword = async () => {
        if (password === "" || confirmPassword.trim() === "") {
            alert("Empty password.")
            return
        }
        if (password !== confirmPassword) {
            alert("Password is not equal to Confirm Password.")
            return
        }
        let data = {password: password, confirmPassword: confirmPassword}
        const response = await fetch("http://localhost:3001/user/updatePassword", {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            const responseMsg = await response.text()
            alert(responseMsg)
        } else {
            alert("Password updated. Please do login again.")
            onLogout()
            window.location.reload()
        }
    }

    return (
        <div className="register-wrapper">
            <h1>Suas Informações</h1>
            <div>
                <div>
                    <p htmlFor="name">Nome: {name}</p>
                </div>
                <div>
                    <p htmlFor="email">Email: {email}</p>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="passwordInput" placeholder="Digite a sua senha..." onChange={e => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" name="confirmPassword" id="confirmPasswordInput" placeholder="Confirme a sua senha..." onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <div>
                    <button onClick={updatePassword}>Update Password</button>
                </div>
            </div>
        </div>
    )
}

export default Update