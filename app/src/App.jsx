import { useState, useEffect } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import ChatBot from "./components/ChatBot"
import Grafico from "./components/Grafico"
import HeatMap from "./components/HeatMap"
import Update from "./components/Update"

function setToken(token) {
    sessionStorage.setItem('token', token)
}

function getToken() {
    return sessionStorage.getItem('token')
}

function removeToken() {
    sessionStorage.removeItem("token")
}

function logout() {
    removeToken()
    window.location.reload()
}

async function verifyToken(token, setIsAuthenticated) {
    if (!token || token === "null") {
        setIsAuthenticated(false)
        return
    }
    try {
        const response = await fetch("http://localhost:3001/user/verify", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        })
        if (!response.ok) removeToken()
        setIsAuthenticated(response.ok)
    } catch (err) {
        console.error("Error verifying token:", err)
        removeToken()
        setIsAuthenticated(false)
    }
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const token = getToken()

    useEffect(() => {
        verifyToken(token, setIsAuthenticated)
    }, [token])

    if (isAuthenticated === null) return <div>Verificando login...</div>
    if (!isAuthenticated) return (
        <div>
            <Login setToken={setToken} />
            <Register></Register>
        </div>
    )

    return (
        <div>
            <button onClick={logout}>LOGOUT</button>
            <Update token={token} onLogout={logout}></Update>
            <ChatBot token={token} onLogout={logout}></ChatBot>
            {/* <Grafico></Grafico>  */}
            {/* <HeatMap></HeatMap> */}
        </div>
    )
}

export default App