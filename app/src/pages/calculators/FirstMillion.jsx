import { useState } from "react";
import Navbar from "../../components/NavBar";
import HeroSection from "../../components/HeroSection";
import { FaCalculator } from "react-icons/fa";
import { HiArrowTrendingUp } from "react-icons/hi2";
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
import "../../css/calculators/FirstMillion.css";

function FirstMillion() {
  const [mode, setMode] = useState("tempo");
  const [initialValue, setInitialValue] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [period, setPeriod] = useState("");
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [graphMode, setGraphMode] = useState("resumo");
  const [chartData, setChartData] = useState([]);
  const [finalAmount, setFinalAmount] = useState(null);
  const [investedTotal, setInvestedTotal] = useState(null);
  const [interestTotal, setInterestTotal] = useState(null);
  const [yearsToMillion, setYearsToMillion] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const title = "Simulador do Primeiro Milhão";
  const subtitle =
    "Descubra quanto tempo ou quanto investir por mês para alcançar R$1.000.000";

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setInitialValue("");
    setInterestRate("");
    setPeriod("");
    setMonthlyInvestment("");
    setFinalAmount(null);
    setInvestedTotal(null);
    setInterestTotal(null);
    setYearsToMillion(null);
    setChartData([]);
    resetResults();
  };

  const resetResults = () => {
    setFinalAmount(null);
    setInvestedTotal(null);
    setInterestTotal(null);
    setYearsToMillion(null);
    setChartData([]);
  };

  const calculateFirstMillion = () => {
    const P = parseFloat(initialValue);
    const r = parseFloat(interestRate) / 100 / 12;
    const PMT = parseFloat(monthlyInvestment);
    const target = 1000000;

    if (isNaN(P) || isNaN(r) || isNaN(parseFloat(interestRate))) {
      setErrorMessage("Preencha todos os campos corretamente.");
      return;
    }

    if (mode === "tempo") {
      if (isNaN(PMT)) {
        alert("Preencha todos os campos corretamente.");
        return;
      }

      let months = 0;
      let total = P;
      const data = [];
      while (total < target && months < 20000) {
        total = total * (1 + r) + PMT;
        months++;
        if (months % 12 === 0) {
          data.push({
            ano: `${months / 12}º`,
            montante: parseFloat(total.toFixed(2)),
          });
        }
      }

      const invested = P + PMT * months;
      const interest = total - invested;

      setFinalAmount(total.toFixed(2));
      setInvestedTotal(invested.toFixed(2));
      setInterestTotal(interest.toFixed(2));
      setYearsToMillion(months);
      setChartData(data);
      setGraphMode("resumo");
    } else {
      const t = parseInt(period);
      const n = t * 12;

      if (isNaN(n)) {
        alert("Preencha todos os campos corretamente.");
        return;
      }

      const PMT =
        ((target - P * Math.pow(1 + r, n)) * r) / (Math.pow(1 + r, n) - 1);
      const total = target;
      const invested = P + PMT * n;
      const interest = total - invested;

      const data = [];
      for (let i = 1; i <= n; i++) {
        const partial =
          P * Math.pow(1 + r, i) + PMT * ((Math.pow(1 + r, i) - 1) / r);
        if (i % 12 === 0) {
          data.push({
            ano: `${i / 12}º`,
            montante: parseFloat(partial.toFixed(2)),
          });
        }
      }

      setMonthlyInvestment(PMT.toFixed(2));
      setFinalAmount(total.toFixed(2));
      setInvestedTotal(invested.toFixed(2));
      setInterestTotal(interest.toFixed(2));
      setYearsToMillion(n);
      setChartData(data);
      setGraphMode("resumo");
      setErrorMessage("");
    }
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
    const invested = Number(investedTotal);
    const interest = Number(interestTotal);

    if (graphMode === "resumo") {
      return finalAmount !== null ? (
        <div className="million-resume">
          <div className="resume-flex-box">
            <div className="resume-card">
              <div className="result-item">
                <span className="result-label">Valor Total Final</span>
                <span className="result-value">
                  <HiArrowTrendingUp className="growth-icon" />
                  {parseFloat(finalAmount).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
            <div className="resume-card">
              <div className="result-item">
                <span className="result-label">Valor Total Investido</span>
                <span className="result-value">
                  {parseFloat(investedTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
            <div className="resume-card">
              <div className="result-item">
                <span className="result-label">Total em Juros</span>
                <span className="result-value">
                  {parseFloat(interestTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          </div>

          <ul className="million-resume-list">
            <li>
              Valor inicial:{" "}
              <strong>
                {parseFloat(initialValue).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </li>
            <li>
              Taxa de juros anual:{" "}
              <strong>{parseFloat(interestRate).toFixed(2)}%</strong>
            </li>
            {mode === "tempo" ? (
              <>
                <li>
                  Investimento mensal:{" "}
                  <strong>
                    {parseFloat(monthlyInvestment).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </li>
                <li>
                  Tempo para o milhão:{" "}
                  <strong>
                    {Math.floor(yearsToMillion / 12)} anos e{" "}
                    {yearsToMillion % 12} meses
                  </strong>
                </li>
              </>
            ) : (
              <>
                <li>
                  Período: <strong>{period} anos</strong>
                </li>
                <li>
                  Investimento mensal:{" "}
                  <strong>
                    {parseFloat(monthlyInvestment).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </li>
              </>
            )}
            <li className="million-tip">
              Juros compostos crescem de forma exponencial com o tempo. Quanto
              mais longo o período, maior o impacto dos juros.
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
      <div className="million-bottom-section">
        <div className="million-box-calculator">
          <h3 className="million-calculator-title">
            <FaCalculator className="calculator-icon-inline" />
            Calculadora do Primeiro Milhão
          </h3>
          <div className="graph-mode-toggle">
            <label className="graph-radio">
              <input
                type="radio"
                name="mode"
                value="tempo"
                checked={mode === "tempo"}
                onChange={() => handleModeChange("tempo")}
              />
              <span className="graph-label">Tempo de Investimento</span>
            </label>

            <label className="graph-radio">
              <input
                type="radio"
                name="mode"
                value="valor"
                checked={mode === "valor"}
                onChange={() => handleModeChange("valor")}
              />
              <span className="graph-label">Valor Mensal Necessário</span>
            </label>
          </div>

          {mode === "tempo" && (
            <div className="first-million-form">
              <input
                className="million-input-initial"
                placeholder="Quanto você já tem guardado e investido?"
                value={initialValue}
                onChange={(e) => {
                  setInitialValue(e.target.value);
                  resetResults();
                }}
                type="number"
              />
              <input
                className="million-input-rate"
                placeholder="Taxa de Juros Anual (%)"
                value={interestRate}
                onChange={(e) => {
                  setInterestRate(e.target.value);
                  resetResults();
                }}
                type="number"
              />
              <input
                className="million-input-monthly"
                placeholder="Valor de investimento Mensal"
                value={monthlyInvestment}
                onChange={(e) => {
                  setMonthlyInvestment(e.target.value);
                  resetResults();
                }}
                type="number"
              />
            </div>
          )}

          {mode === "valor" && (
            <div className="first-million-form">
              <input
                className="million-input-initial"
                placeholder="Quanto você já tem guardado e investido?"
                value={initialValue}
                onChange={(e) => {
                  setInitialValue(e.target.value);
                  resetResults();
                }}
                type="number"
              />
              <input
                className="million-input-rate"
                placeholder="Taxa de Juros Anual (%)"
                value={interestRate}
                onChange={(e) => {
                  setInterestRate(e.target.value);
                  resetResults();
                }}
                type="number"
              />
              <input
                className="million-input-period"
                placeholder="Período para o primeiro milhão (anos)"
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  resetResults();
                }}
                type="number"
              />
            </div>
          )}

          <button className="million-button" onClick={calculateFirstMillion}>
            <span className="million-button-content">Calcular</span>
          </button>

          {errorMessage && (
            <p className="million-error-message">{errorMessage}</p>
          )}
        </div>

        <div className="million-box-graph">
          <h3 className="million-result-title">Resultados</h3>

          {finalAmount !== null && (
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
          )}

          <div className="million-chart-area">{renderChart()}</div>
        </div>
      </div>
    </>
  );
}

export default FirstMillion;
