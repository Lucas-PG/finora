import { useState, useEffect } from "react"

function Email({ token }) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState("")

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await fetch("http://localhost:3001/user/info", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!response.ok) throw new Error("Error getting user.")
                const data = await response.json()
                const user = data[0]
                setName(user.name)
                setEmail(user.email)
            } catch (err) {
                setStatus("Can not load user data.")
            }
        }
        getUserInfo()
    }, [token])

    const handleSendEmail = async () => {
        if (!message.trim()) { return }
        const response = await fetch("http://localhost:3001/email/send_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name, email, message }),
        })
        const result = await response.json()
        if (!response.ok) {
            setStatus("Error sending: " + result.data)
        } else {
            setStatus("Email sent.")
            setMessage("")
        }
    }

    return (
        <>
            <div>
                <h1>Enviar Sugestão</h1>
                <div>
                    <p><strong>Usuário:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>

                    <label htmlFor="message">Mensagem:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Digite sua mensagem aqui..."
                        rows={6}
                    />

                    <button onClick={handleSendEmail}>Enviar Email</button>
                    {status && <p>{status}</p>}
                </div>
            </div>
        </>
    )
}

export default Email