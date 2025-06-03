import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Wallets from "./pages/Wallets";
import Calculators from "./pages/Calculators";
import Assets from "./pages/Assets";
import Register from "./pages/Register";
import CompoundInterest from "./pages/CompoundInterest";
import SimpleInterest from "./pages/SimpleInterest";
import FirstMillion from "./pages/FirstMillion";
import AssetPercentage from "./pages/AssetPercentage";
import ChatBot from "./components/ChatBot";
import Grafico from "./components/Grafico";
import HeatMap from "./components/HeatMap";
import Update from "./components/Update";
import "./style.css";

function setToken(token) {
  sessionStorage.setItem("token", token);
}

function getToken() {
  return sessionStorage.getItem("token");
}

function removeToken() {
  sessionStorage.removeItem("token");
}

function logout() {
  removeToken();
  window.location.reload();
}

async function verifyToken(token, setIsAuthenticated) {
  if (!token || token === "null") {
    setIsAuthenticated(false);
    return;
  }
  try {
    const response = await fetch("http://localhost:3001/user/verify", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) removeToken();
    setIsAuthenticated(response.ok);
  } catch (err) {
    console.error("Error verifying token:", err);
    removeToken();
    setIsAuthenticated(false);
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = getToken();

  useEffect(() => {
    verifyToken(token, setIsAuthenticated);
  }, [token]);

  if (isAuthenticated === null) return <div>Verificando login...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
            <Route path="/wallets" element={<Navigate to="/"/>} />
            <Route path="/profile" element={<Navigate to="/"/>} />
            <Route path="*" element={<Navigate to="/"/>} />
            <Route path="/CompoundInterest" element={<CompoundInterest />} />
            <Route path="/SimpleInterest" element={<SimpleInterest />} />
            <Route path="/FirstMillion" element={<FirstMillion />} />
            <Route path="/AssetPercentage" element={<AssetPercentage />} />

          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Update token={token} onLogout={logout} />} />
            <Route path="/register" element={<Navigate to="/"/>} />
            <Route path="/login" element={<Navigate to="/profile"/>} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/CompoundInterest" element={<CompoundInterest />} />
            <Route path="/SimpleInterest" element={<SimpleInterest />} />
            <Route path="/FirstMillion" element={<FirstMillion />} />
            <Route path="/AssetPercentage" element={<AssetPercentage />} />

          </>
        )}
      </Routes>
      {isAuthenticated ? (
        <ChatBot token={token} onLogout={logout} ></ChatBot>
      ) : <></>}
    </BrowserRouter>
  );
}

export default App;