import { useState } from "react";
import Navbar from "../../components/NavBar";
import HeroSection from "../../components/HeroSection";
import { FaPercent } from "react-icons/fa";
import "../../css/calculators/AssetPercentage.css";

function AssetPercentage() {
  const [mode, setMode] = useState("percentual");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState("");

  const title = "Porcentagem de Ativos";
  const subtitle = "Calcule proporções, aumentos e reduções com facilidade.";

  const calculate = () => {
    const a = parseFloat(value1);
    const b = parseFloat(value2);

    if (isNaN(a) || isNaN(b)) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    let res = 0;
    switch (mode) {
      case "percentual":
        res = (a / 100) * b;
        break;
      case "proporcao":
        res = (a / b) * 100;
        break;
      case "aumento":
        res = ((b - a) / a) * 100;
        break;
      case "reducao":
        res = ((a - b) / a) * 100;
        break;
      default:
        break;
    }

    setResult(res.toFixed(2));
  };

  const clear = () => {
    setValue1("");
    setValue2("");
    setResult("");
  };

  const getPlaceholders = () => {
    switch (mode) {
      case "percentual":
        return ["Quanto é", "De (valor)", "Resultado"];
      case "proporcao":
        return ["O valor", "é qual porcentagem de", "Resultado"];
      case "aumento":
        return [
          "Um valor de",
          "Que AUMENTOU para",
          "Qual foi o aumento percentual?",
        ];
      case "reducao":
        return [
          "Um valor de",
          "Que DIMINUIU para",
          "Qual foi a diminuição percentual?",
        ];
      default:
        return ["", "", ""];
    }
  };

  const placeholders = getPlaceholders();

  return (
    <>
      <Navbar />
      <HeroSection title={title} subtitle={subtitle} />

      <div className="percentage-bottom-section">
        <div className="percentage-box-calculator">
          <h3 className="percentage-calculator-title">
            <div className="calculator-icon-around">
              <FaPercent size={20} className="calculator-icon" />
            </div>
            <span>Calculadora de Porcentagem</span>
          </h3>

          <div className="graph-mode-toggle">
            {[
              ["percentual", "Cálculo de Porcentagem"],
              ["proporcao", "Proporção"],
              ["aumento", "Aumento Percentual"],
              ["reducao", "Redução Percentual"],
            ].map(([value, label]) => (
              <label key={value} className="graph-radio">
                <input
                  type="radio"
                  name="mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => {
                    setMode(value);
                    clear();
                  }}
                />
                <span className="graph-label">{label}</span>
              </label>
            ))}
          </div>

          <input
            className="percentage-input"
            placeholder={placeholders[0]}
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />

          <input
            className="percentage-input"
            placeholder={placeholders[1]}
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />

          <input
            className="percentage-input"
            placeholder={placeholders[2]}
            type="number"
            value={result}
            readOnly
          />

          <button className="percentage-button" onClick={calculate}>
            <span className="percentage-button-content">CALCULAR</span>
          </button>

          <button className="percentage-button asset-clear" onClick={clear}>
            <span className="percentage-button-content">LIMPAR</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AssetPercentage;
