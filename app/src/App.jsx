import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Wallets from "./pages/Wallets";
import Calculators from "./pages/Calculators";
import Assets from "./pages/Assets";
import Register from "./pages/Register";
import CompoundInterest from "./pages/calculators/CompoundInterest";
import SimpleInterest from "./pages/calculators/SimpleInterest";
import FirstMillion from "./pages/calculators/FirstMillion";
import AssetPercentage from "./pages/calculators/AssetPercentage";
import ChatBot from "./components/ChatBot";
import Grafico from "./components/Grafico";
import HeatMap from "./components/HeatMap";
import Update from "./components/Update";
import "./style.css";

function App() {
  const { isAuthenticated, setToken, token, logout } = useContext(AuthContext);

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
            <Route path="/wallets" element={<Navigate to="/" />} />
            <Route path="/profile" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/compound-interest" element={<CompoundInterest />} />
            <Route path="/simple-interest" element={<SimpleInterest />} />
            <Route path="/first-million" element={<FirstMillion />} />
            <Route path="/asset-percentage" element={<AssetPercentage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={<Update token={token} onLogout={logout} />}
            />
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="/login" element={<Navigate to="/profile" />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/compound-interest" element={<CompoundInterest />} />
            <Route path="/simple-interest" element={<SimpleInterest />} />
            <Route path="/first-million" element={<FirstMillion />} />
            <Route path="/asset-percentage" element={<AssetPercentage />} />
          </>
        )}
      </Routes>
      {isAuthenticated && <ChatBot token={token} onLogout={logout} />}
    </BrowserRouter>
  );
}

export default App;
