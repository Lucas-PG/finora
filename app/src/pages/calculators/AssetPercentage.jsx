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

          <select
            className="percentage-select"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              clear();
            }}
          >
            <option value="percentual">Cálculo de Porcentagem</option>
            <option value="proporcao">Proporção</option>
            <option value="aumento">Aumento Percentual</option>
            <option value="reducao">Redução Percentual</option>
          </select>

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

          <div className="percentage-result">
            {result && (
              <>
                <span>{placeholders[2]}: </span>
                <strong>{result}</strong>
              </>
            )}
          </div>

          <button className="percentage-button primary-btn" onClick={calculate}>
            CALCULAR
          </button>

          <button className="percentage-button secondary-btn" onClick={clear}>
            LIMPAR
          </button>
        </div>
      </div>
    </>
  );
}

export default AssetPercentage;
