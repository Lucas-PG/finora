import { useState } from "react";
import Navbar from "../../components/NavBar";
import Arrow from "../../components/Arrow";
import { FaCalculator } from "react-icons/fa";
import { HiArrowTrendingUp } from "react-icons/hi2";
import HeroSection from "../../components/HeroSection.jsx";
import {
  PieChart,
  Pie,
  Cell,
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
import "../../css/calculators/CompoundInterest.css";

function CompoundInterest() {
  const [initialValue, setInitialValue] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [period, setPeriod] = useState("");
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [finalAmount, setFinalAmount] = useState(null);
  const [graphMode, setGraphMode] = useState("pizza");
  const [chartData, setChartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const title = "Juros Compostos";
  const subtitle =
    'O modelo mais comum em aplicações de renda fixa. Veja sua "bola de neve" formando.';

  const calculateCompoundInterest = () => {
    const P = parseFloat(initialValue);
    const r = parseFloat(interestRate) / 100 / 12;
    const t = parseInt(period);
    const PMT = parseFloat(monthlyInvestment);

    if (isNaN(P) || isNaN(r) || isNaN(t) || isNaN(PMT)) {
      setFinalAmount(null);
      setChartData([]);
      setErrorMessage("Preencha todos os campos corretamente.");
      return;
    }

    const months = t * 12;
    const total =
      P * Math.pow(1 + r, months) + PMT * ((Math.pow(1 + r, months) - 1) / r);

    const data = [];
    for (let i = 1; i <= months; i++) {
      const partial =
        P * Math.pow(1 + r, i) + PMT * ((Math.pow(1 + r, i) - 1) / r);
      if (i % 12 === 0) {
        data.push({
          ano: `${i / 12}º`,
          montante: partial,
        });
      }
    }

    setChartData(data);
    setFinalAmount(total);
    setGraphMode("resumo");
    setErrorMessage("");
  };

  const customTooltip = {
    contentStyle: {
      backgroundColor: "#181e2b",
      border: "1px solid #41434a",
      borderRadius: "8px",
      color: "#fff",
    },
    labelStyle: { color: "#ccc" },
    itemStyle: { color: "#fff" },
    formatter: (value) =>
      Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
  };

  const renderChart = () => {
    const invested =
      Number(initialValue) + Number(monthlyInvestment) * Number(period) * 12;
    const interest = Number(finalAmount) - invested;

    if (graphMode === "resumo") {
      return finalAmount !== null ? (
        <div className="compound-resume">
          <div className="resume-flex-box">
            <div className="resume-card">
              <div className="result-item">
                <span className="result-label">Valor Total Final</span>
                <span className="result-value">
                  <HiArrowTrendingUp className="growth-icon" /> R${" "}
                  {Number(finalAmount).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="resume-card">
              <div className="result-item">
                <span className="result-label">Valor Total Investido</span>
                <span className="result-value">R$ {invested.toFixed(2)}</span>
              </div>
            </div>
            <div className="resume-card">
              <div className="result-item">
                <span className="result-label">Total em Juros</span>
                <span className="result-value">R$ {interest.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <ul className="compound-resume-list">
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
            <li className="compound-tip">
              Juros compostos crescem de forma exponencial com o tempo. Quanto
              mais longo o período, maior o impacto dos juros.
            </li>
          </ul>
        </div>
      ) : (
        <p className="compound-result-description">
          Preencha os campos e clique em Calcular.
        </p>
      );
    }

    if (chartData.length === 0) return null;

    switch (graphMode) {
      case "pizza":
        const pieData = [
          { name: "Investido", value: invested },
          { name: "Juros", value: interest },
        ];
        const COLORS = ["#0066ff", "#ffff"];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip {...customTooltip} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                minAngle={3}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      case "barra":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ano" />
              <YAxis />
              <Tooltip {...customTooltip} />
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
              <Tooltip {...customTooltip} />
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

  return (
    <>
      <Navbar />
      <HeroSection title={title} subtitle={subtitle} />
      <div className="compound-bottom-section">
        <div className="compound-box-calculator">
          <h3 className="compound-calculator-title">
            <FaCalculator className="calculator-icon-inline" />
            Calculadora de Juros Compostos
          </h3>

          <input
            className="compound-input-initial"
            placeholder="Valor Inicial"
            value={initialValue}
            onChange={(e) => {
              setInitialValue(e.target.value);
              setFinalAmount(null);
              setChartData([]);
              setErrorMessage("");
            }}
            type="number"
          />
          <input
            className="compound-input-rate"
            placeholder="Taxa de Juros (%)"
            value={interestRate}
            onChange={(e) => {
              setInterestRate(e.target.value);
              setFinalAmount(null);
              setChartData([]);
              setErrorMessage("");
            }}
            type="number"
          />
          <input
            className="compound-input-period"
            placeholder="Período (anos)"
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setFinalAmount(null);
              setChartData([]);
              setErrorMessage("");
            }}
            type="number"
          />
          <input
            className="compound-input-monthly"
            placeholder="Investimento Mensal"
            value={monthlyInvestment}
            onChange={(e) => {
              setMonthlyInvestment(e.target.value);
              setFinalAmount(null);
              setChartData([]);
              setErrorMessage("");
            }}
            type="number"
          />

          <button
            className="compound-button"
            onClick={calculateCompoundInterest}
          >
            <span className="compound-button-content">Calcular</span>
          </button>

          {errorMessage && (
            <p className="compound-error-message">{errorMessage}</p>
          )}
        </div>

        <Arrow />

        <div className="compound-box-graph">
          <h3 className="compound-result-title">Resultados</h3>

          <div className="graph-mode-toggle">
            {["resumo", "pizza", "barra", "area"].map((mode) => (
              <label key={mode} className="graph-radio">
                <input
                  type="radio"
                  name="graphMode"
                  value={mode}
                  checked={graphMode === mode}
                  onChange={() => setGraphMode(mode)}
                />
                <span className="graph-label">
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </span>
              </label>
            ))}
          </div>

          <div className="compound-chart-area">{renderChart()}</div>
        </div>
      </div>
    </>
  );
}

export default CompoundInterest;
