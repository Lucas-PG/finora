import { useState, useEffect } from "react"
import { marked } from "marked"
import { FiMessageCircle, FiMinus } from "react-icons/fi"
import "../css/ChatBot.css"

function ChatBot({ token, onLogout }) {
    const [prompt, setPrompt] = useState("")
    const [messages, setMessages] = useState([])
    const [chatbotDisabled, setChatbotDisabled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [opened, setOpened] = useState(false)

    useEffect(() => {
        const getUserMessages = async () => {
            try {
                const response = await fetch("http://localhost:3001/messages/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({})
                })

                if (response.status === 401 || response.status === 403) {
                    alert("Expired session, do login again.")
                    onLogout()
                    return
                }

                const data = await response.json()
                const formatted = []

                data.forEach(saved => {
                    formatted.push({ role: "user", content: saved.prompt })
                    formatted.push({ role: "assistant", content: saved.message })
                })

                setMessages(formatted)
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error)
            } finally {
                setLoading(false)
            }
        }

        getUserMessages()
    }, [token])

    const systemPrompt = `Você é um assistente virtual especializado em finanças pessoais, investimentos e educação financeira.
    Forneça informações claras e objetivas, no máximo 250 palavras, você não pode fazer outra coisa a não ser algo relacionado a finanças.`

    const getResponse = async () => {
        if (!prompt.trim()) return

        setChatbotDisabled(true)
        const updatedMessages = [...messages, { role: "user", content: prompt }]
        setMessages(updatedMessages)
        setPrompt("")

        const requestData = {
            model: "llama3",
            messages: [{ role: "system", content: systemPrompt }, ...updatedMessages]
        }

        try {
            const response = await fetch("http://localhost:11434/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            })

            const reader = response.body.getReader()
            const decoder = new TextDecoder("utf-8")
            let fullText = ""

            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                const lines = chunk.trim().split("\n")

                for (const line of lines) {
                    const json = JSON.parse(line)
                    fullText += json.message.content
                    setMessages([...updatedMessages, { role: "assistant", content: fullText }])
                }
            }

            await fetch("http://localhost:3001/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ prompt, message: fullText })
            })
        } catch (error) {
            console.error("Erro ao obter resposta:", error)
            setMessages([...updatedMessages, { role: "assistant", content: "Erro ao obter resposta do assistente." }])
        } finally {
            setChatbotDisabled(false)
        }
    }

    const renderMessage = (msg, idx) => {
        if (msg.role === "assistant") {
            return (
                <div className={`chat-message ${msg.role}`} key={idx}>
                    <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                </div>
            )
        }
        return <div className={`chat-message ${msg.role}`} key={idx}>{msg.content}</div>
    }

    if (loading) return <div className="chat-loading">Carregando histórico...</div>

    return (
        <div className="chat-wrapper">
            {!opened ? (
                <button className="chat-toggle-btn" onClick={() => setOpened(true)}>
                    <FiMessageCircle size={24} />
                </button>
            ) : (
                <div className="chat-container">
                    <div className="chat-header">
                        <span>Assistente</span>
                        <button className="minimize-btn" onClick={() => setOpened(false)}>
                            <FiMinus size={20} />
                        </button>
                    </div>

                    <div className="chat-box">
                        {messages.map((msg, i) => renderMessage(msg, i))}
                    </div>

                    <div className="chat-input">
                        <textarea
                            placeholder="Digite sua pergunta..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey && !chatbotDisabled) {
                                    e.preventDefault()
                                    getResponse()
                                }
                            }}
                            rows={1}
                            className="chat-textarea"
                        />
                        <button onClick={getResponse} disabled={chatbotDisabled}>
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatBot