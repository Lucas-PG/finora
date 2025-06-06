import { useState } from "react";
import Navbar from "../../components/NavBar";
import Arrow from "../../components/Arrow";
import HeroSection from "../../components/HeroSection";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../../css/SimpleInterest.css";

function SimpleInterest() {
  const [initialValue, setInitialValue] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [period, setPeriod] = useState("");
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [finalAmount, setFinalAmount] = useState(null);
  const [graphMode, setGraphMode] = useState("linha");
  const [chartData, setChartData] = useState([]);

  const calculateSimpleInterest = () => {
    const P = parseFloat(initialValue);
    const r = parseFloat(interestRate) / 100;
    const t = parseInt(period);
    const PMT = parseFloat(monthlyInvestment);

    if (isNaN(P) || isNaN(r) || isNaN(t) || isNaN(PMT)) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    let total = P;
    const data = [];

    for (let i = 1; i <= t; i++) {
      const interest = P * r * i;
      const monthlyTotal = PMT * 12 * i;
      total = P + interest + monthlyTotal;
      data.push({ ano: `${i}º`, montante: parseFloat(total.toFixed(2)) });
    }

    setChartData(data);
    setFinalAmount(total.toFixed(2));
  };

  const renderChart = () => {
    if (graphMode === "resumo") {
      return finalAmount !== null ? (
        <div className="simple-resume">
          <p className="simple-result-description">
            Montante acumulado ao final de {period} anos:{" "}
            <strong>R$ {finalAmount}</strong>
          </p>
          <ul className="simple-resume-list">
            <li>
              Valor inicial:{" "}
              <strong>R$ {parseFloat(initialValue).toFixed(2)}</strong>
            </li>
            <li>
              Taxa de juros anual:{" "}
              <strong>{parseFloat(interestRate).toFixed(2)}%</strong>
            </li>
            <li>
              Duração: <strong>{period} anos</strong>
            </li>
            <li>
              Investimento mensal:{" "}
              <strong>R$ {parseFloat(monthlyInvestment).toFixed(2)}</strong>
            </li>
            <li>
              No juro simples, o crescimento é linear. Ideal para prazos curtos.
            </li>
          </ul>
        </div>
      ) : (
        <p className="simple-result-description">
          Preencha os campos e clique em Calcular.
        </p>
      );
    }

    if (chartData.length === 0) return null;

    switch (graphMode) {
      case "linha":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ano" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="montante"
                stroke="#0066FF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "barra":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ano" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="montante" fill="#0066FF" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ano" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="montante"
                stroke="#fff"
                fill="#0066FF"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const title = "Juros Simples";
  const subtitle =
    "Uma forma de rendimento linear e previsível. Veja como ele evolui ao longo do tempo.";

  return (
    <>
      <Navbar />
      <HeroSection title={title} subtitle={subtitle} />
      <div className="simple-bottom-section">
        <div className="simple-box-calculator">
          <h3 className="simple-calculator-title">
            Calculadora de Juros Simples
          </h3>
          <input
            className="simple-input-initial"
            placeholder="Valor Inicial"
            value={initialValue}
            onChange={(e) => setInitialValue(e.target.value)}
            type="number"
          />
          <input
            className="simple-input-rate"
            placeholder="Taxa de Juros (%)"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            type="number"
          />
          <input
            className="simple-input-period"
            placeholder="Período (anos)"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            type="number"
          />
          <input
            className="simple-input-monthly"
            placeholder="Investimento Mensal"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(e.target.value)}
            type="number"
          />
          <button className="simple-button" onClick={calculateSimpleInterest}>
            <span className="simple-button-content">Calcular</span>
          </button>
        </div>

        <Arrow />

        <div className="simple-box-graph">
          <h3 className="simple-result-title">Resultados</h3>

          <div className="graph-mode-toggle">
            <label className="graph-radio">
              <input
                type="radio"
                name="graphMode"
                value="linha"
                checked={graphMode === "linha"}
                onChange={() => setGraphMode("linha")}
              />
              <span className="graph-label">Linha</span>
            </label>

            <label className="graph-radio">
              <input
                type="radio"
                name="graphMode"
                value="barra"
                checked={graphMode === "barra"}
                onChange={() => setGraphMode("barra")}
              />
              <span className="graph-label">Barra</span>
            </label>

            <label className="graph-radio">
              <input
                type="radio"
                name="graphMode"
                value="area"
                checked={graphMode === "area"}
                onChange={() => setGraphMode("area")}
              />
              <span className="graph-label">Área</span>
            </label>

            <label className="graph-radio">
              <input
                type="radio"
                name="graphMode"
                value="resumo"
                checked={graphMode === "resumo"}
                onChange={() => setGraphMode("resumo")}
              />
              <span className="graph-label">Resumo</span>
            </label>
          </div>

          <div>{renderChart()}</div>
        </div>
      </div>
    </>
  );
}

export default SimpleInterest;
