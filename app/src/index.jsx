import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import "./style.css";
import App from "./App";
import { ThemeProvider } from "./components/ThemeContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);

