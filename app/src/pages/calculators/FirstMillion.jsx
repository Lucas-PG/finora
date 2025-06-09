import { useState } from "react";
import Navbar from "../../components/NavBar";
import Arrow from "../../components/Arrow";
import HeroSection from "../../components/HeroSection";
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
    if (graphMode === "resumo") {
      return finalAmount !== null ? (
        <div className="million-resume">
          {mode === "tempo" ? (
            <>
              <p className="million-result-description">
                Você vai atingir seu primeiro milhão em{" "}
                <strong>
                  {Math.floor(yearsToMillion / 12)} anos e {yearsToMillion % 12}{" "}
                  meses
                </strong>
                .
                <br />
                Após esse prazo, o valor total será de{" "}
                <strong>
                  {parseFloat(finalAmount).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
                ,<br />
                sendo{" "}
                <strong>
                  {parseFloat(investedTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>{" "}
                de valor investido e{" "}
                <strong>
                  {parseFloat(interestTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>{" "}
                de rendimentos.
              </p>
              <div className="million-result-summary">
                <p>
                  <strong>Valor Total Final:</strong>{" "}
                  {parseFloat(finalAmount).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p>
                  <strong>Valor Total Investido:</strong>{" "}
                  {parseFloat(investedTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p>
                  <strong>Total em Juros:</strong>{" "}
                  {parseFloat(interestTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="million-result-description">
                Considerando os{" "}
                <strong>
                  {parseFloat(initialValue).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>{" "}
                guardados e investidos inicialmente, você precisa investir{" "}
                <strong>
                  {parseFloat(monthlyInvestment).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>{" "}
                mensalmente para atingir seu primeiro milhão em{" "}
                <strong>{period} anos</strong>!
                <br />
                Desta forma, você irá alcançar <strong>
                  R$ 1.000.000,00
                </strong>{" "}
                neste período, sendo{" "}
                <strong>
                  {parseFloat(investedTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>{" "}
                de valor investido e de rendimento.
              </p>
              <div className="million-result-summary">
                <p>
                  <strong>Valor Total Final:</strong> R$ 1.000.000,00
                </p>
                <p>
                  <strong>Valor Total Investido:</strong>{" "}
                  {parseFloat(investedTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p>
                  <strong>Total em Juros:</strong>{" "}
                  {parseFloat(interestTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p>
                  <strong>Valor Investimento Mensal:</strong>{" "}
                  {parseFloat(monthlyInvestment).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </>
          )}
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
        const invested = Number(investedTotal);
        const interest = Number(interestTotal);
        const pieData = [
          { name: "Investido", value: invested },
          { name: "Juros", value: interest },
        ];
        const COLORS = ["#0066ff", "#ffff"];

        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip {...customTooltip} />
              formatter=
              {(value) =>
                Number(value).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
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
          <h3 className="compound-calculator-title">
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
            <>
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
                placeholder="Taxa de Juros (%)"
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
            </>
          )}

          {mode === "valor" && (
            <>
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
                placeholder="Taxa de Juros (%)"
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
            </>
          )}

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
