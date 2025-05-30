import { useState, useEffect, useRef } from "react"
import { FaUser } from "react-icons/fa"
import Navbar from "../components/NavBar.jsx"

function Update({ token, onLogout }) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [photoUrl, setPhotoUrl] = useState(null)
    const [filename, setFilename] = useState(null)

    const fileInputRef = useRef(null)
    
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
            if (data.photo) { setFilename(data.photo) } 
            else { setFilename(null) }
        }
        getInformations()
    }, [token])
    
    useEffect(() => {
        if (!filename) { 
            setPhotoUrl(null)
            return
        }
        const fetchPhoto = async () => {
            const response = await fetch(`http://localhost:3001/user/photo/${filename}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!response.ok) {
                setPhotoUrl(null)
                return
            }
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            setPhotoUrl(url)
        }
        fetchPhoto()
        return () => { if (photoUrl) URL.revokeObjectURL(photoUrl) }
    }, [filename, token])

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

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0]
        if (!file) { return }
        const formData = new FormData()
        formData.append("photo", file)
        const response = await fetch("http://localhost:3001/user/upload_photo", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        })
        if (!response.ok) {
            alert("Fail while uploading image.")
        } else {
            const result = await response.json()
            setFilename(result.filename)
        }
    }

    const handleImage = () => {
        fileInputRef.current?.click()
    }

    return (
        <>
            <Navbar />
            <div className="register-wrapper">
                <h1>Suas Informações</h1>
                <div> 
                    <div>
                        {photoUrl ? ( 
                            <div> <img onClick={handleImage} src={photoUrl} alt="Foto de Perfil" width="150" style={{ borderRadius: "50%", objectFit: "cover", cursor: "pointer"}} /> </div> ) : (
                            <div onClick={handleImage} style={{ width: 150, height: 150, fontSize: 100, color: "#888", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ccc", borderRadius: "50%", cursor: "pointer" }}> <FaUser /> </div>
                        )}
                        <input type="file" accept="image/*" onChange={handlePhotoChange} ref={fileInputRef} style={{display: "none"}} />
                    </div>
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
        </>
    )
}

export default Update