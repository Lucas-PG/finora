import { useState } from "react";
import Navbar from "../../components/NavBar";
import Arrow from "../../components/Arrow";
import HeroSection from "../../components/HeroSection";
import "../../css/calculators/FirstMillion.css";
import { FaCalculator } from "react-icons/fa";

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

function FirstMillion() {
  const [initialValue, setInitialValue] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [period, setPeriod] = useState("");
  const [finalAmount, setFinalAmount] = useState(null);
  const [graphMode, setGraphMode] = useState("resumo");
  const [chartData, setChartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const title = "Primeiro Milhão";
  const subtitle =
    "Veja quanto investir por mês para alcançar R$ 1.000.000 em determinado tempo.";

  const calculateFirstMillion = () => {
    const P = parseFloat(initialValue);
    const r = parseFloat(interestRate) / 100 / 12;
    const t = parseInt(period);
    const FV = 1000000;

    if (isNaN(P) || isNaN(r) || isNaN(t)) {
      setFinalAmount(null);
      setChartData([]);
      setErrorMessage("Preencha todos os campos corretamente.");
      return;
    }

    const n = t * 12;
    const PMT = ((FV - P * Math.pow(1 + r, n)) * r) / (Math.pow(1 + r, n) - 1);
    const data = [];
    let total = 0;

    for (let i = 1; i <= n; i++) {
      const parcial =
        P * Math.pow(1 + r, i) + PMT * ((Math.pow(1 + r, i) - 1) / r);
      if (i % 12 === 0) {
        data.push({
          ano: `${i / 12}º`,
          montante: parseFloat(parcial.toFixed(2)),
        });
      }
      total = parcial;
    }

    setChartData(data);
    setFinalAmount(total.toFixed(2));
    setGraphMode("resumo");
    setErrorMessage("");
  };

  const invested = Number(initialValue);
  const interest = Number(finalAmount) - invested;

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
    if (graphMode === "resumo") {
      return finalAmount !== null ? (
        <div className="million-resume">
          <div className="million-resume-flex-box">
            <div className="million-resume-card">
              <div className="million-result-item">
                <span className="million-result-label">Valor Total Final</span>
                <span className="million-result-value">R$ {finalAmount}</span>
              </div>
            </div>
            <div className="million-resume-card">
              <div className="million-result-item">
                <span className="million-result-label">
                  Valor Total Investido
                </span>
                <span className="million-result-value">
                  R$ {invested.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="million-resume-card">
              <div className="million-result-item">
                <span className="million-result-label">Total em Juros</span>
                <span className="million-result-value">
                  R$ {interest.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <ul className="million-resume-list">
            <li>
              Capital Inicial: <strong>R$ {invested.toFixed(2)}</strong>
            </li>
            <li>
              Taxa de Juros Mensal:{" "}
              <strong>{(parseFloat(interestRate) / 12).toFixed(2)}%</strong>
            </li>
            <li>
              Duração: <strong>{period} anos</strong>
            </li>
            <li className="million-tip">
              Esse cálculo assume juros compostos mensais com aportes mensais
              constantes.
            </li>
          </ul>
        </div>
      ) : (
        <p className="million-result-description">
          Preencha os campos e clique em Calcular.
        </p>
      );
    }

    if (chartData.length === 0) return null;

    const chartProps = {
      data: chartData,
      width: "100%",
      height: 300,
    };

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
          <ResponsiveContainer {...chartProps}>
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
          <ResponsiveContainer {...chartProps}>
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

      <div className="million-bottom-section">
        <div className="million-box-calculator">
          <h3 className="million-calculator-title">
            <FaCalculator className="calculator-icon-inline" />
            Calculadora do Primeiro Milhão
          </h3>
          <input
            className="million-input-initial"
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
            className="million-input-rate"
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
            className="million-input-period"
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
          <button className="million-button" onClick={calculateFirstMillion}>
            <span className="million-button-content">Calcular</span>
          </button>

          {errorMessage && (
            <p className="million-error-message">{errorMessage}</p>
          )}
        </div>

        <Arrow />

        <div className="million-box-graph">
          <h3 className="million-result-title">Resultados</h3>

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

          <div className="million-chart-area">{renderChart()}</div>
        </div>
      </div>
    </>
  );
}

export default FirstMillion;
