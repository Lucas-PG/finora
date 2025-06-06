import { useState } from "react";
import PropTypes from "prop-types";
import "../../css/FloatingInput.css";

function FloatingInput({ type, label, value, onChange, icon }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const Icon = isPassword ? (showPassword ? icon.Open : icon.Closed) : icon;

  return (
    <div className="input-group-login">
      <input
        required
        type={inputType}
        value={value}
        onChange={onChange}
        className={`floating-input ${value ? "filled" : ""}`}
      />
      <label className="floating-label">{label}</label>
      <Icon
        className={`floating-input-icon ${isPassword ? "pointer" : ""}`}
        onClick={() => isPassword && setShowPassword(!showPassword)}
      />
    </div>
  );
}

export default FloatingInput;
