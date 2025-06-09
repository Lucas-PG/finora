import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function getToken() {
  return sessionStorage.getItem("token");
}

function removeToken() {
  sessionStorage.removeItem("token");
}

function setToken(token) {
  sessionStorage.setItem("token", token);
}

function getName() {
  return sessionStorage.getItem("name");
}

function setName(name) {
  sessionStorage.setItem("name", name);
}

function removeName() {
  sessionStorage.removeItem("name");
}

function logout() {
  removeToken();
  removeName();
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
    console.error("Erro ao verificar token:", err);
    removeToken();
    setIsAuthenticated(false);
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = getToken();

  useEffect(() => {
    verifyToken(token, setIsAuthenticated);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        token,
        setToken,
        logout,
        userName: getName(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
