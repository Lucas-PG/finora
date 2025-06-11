import Navbar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { ptBR } from "date-fns/locale";
import "../css/TickerDetails.css";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
);

function TickerDetails() {
  const [searchParams] = useSearchParams();
  const ticker = searchParams.get("ticker");
  const [data, setData] = useState(null);
  const [chartRange, setChartRange] = useState("all");

  useEffect(() => {
    if (ticker) {
      axios
        .get(`http://localhost:3001/assets/${ticker}`)
        .then((res) => {
          console.log(
            "Dados históricos recebidos:",
            res.data.historical?.slice(0, 5),
          );
          setData(res.data);
        })
        .catch((err) => console.error("Erro ao buscar dados do ticker:", err));
    }
  }, [ticker]);

  if (!ticker) return <p>Ticker não especificado na URL.</p>;
  if (!data) return <p>Carregando dados de {ticker}...</p>;

  const formatMarketCap = (value) => {
    if (!value || isNaN(value)) return "-";

    if (value >= 1_000_000_000) {
      return (
        "R$ " + (value / 1_000_000_000).toFixed(2).replace(".", ",") + " B"
      );
    } else if (value >= 1_000_000) {
      return "R$ " + (value / 1_000_000).toFixed(2).replace(".", ",") + " M";
    }

    return "R$ " + value.toLocaleString("pt-BR");
  };

  const filterHistoricalData = (historical, range) => {
    if (!Array.isArray(historical)) return [];

    if (range === "all") return historical;

    const now = new Date();
    const dateLimit = new Date();

    switch (range) {
      case "1y":
        dateLimit.setFullYear(now.getFullYear() - 1);
        break;
      case "6m":
        dateLimit.setMonth(now.getMonth() - 6);
        break;
      case "1m":
        dateLimit.setMonth(now.getMonth() - 1);
        break;
      case "1d":
        dateLimit.setDate(now.getDate() - 1);
        break;
      default:
        return historical;
    }

    return historical.filter((d) => new Date(d.date) >= dateLimit);
  };

  const buildChartData = (historical) => {
    const filtered = filterHistoricalData(historical, chartRange);

    if (!Array.isArray(filtered) || filtered.length === 0) return null;

    const sorted = [...filtered].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    const labels = sorted.map((d) => new Date(d.date));
    const data = sorted.map((d) => d.close);

    return {
      labels,
      datasets: [
        {
          label: `Preço de ${ticker}`,
          data,
          borderColor: "#7a00ff",
          backgroundColor: "rgba(122, 0, 255, 0.15)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };
  };

  const calculateVariation = (historical, periodInDays) => {
    if (!historical || historical.length < 2) return null;

    const sorted = [...historical].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    const latest = sorted[sorted.length - 1];
    const latestDate = new Date(latest.date);
    const targetDate = new Date(latestDate);
    targetDate.setDate(targetDate.getDate() - periodInDays);

    const closest = sorted.reduce((prev, curr) => {
      const currDiff = Math.abs(new Date(curr.date) - targetDate);
      const prevDiff = Math.abs(new Date(prev.date) - targetDate);
      return currDiff < prevDiff ? curr : prev;
    });

    if (!closest || !closest.close) return null;

    const variation = ((latest.close - closest.close) / closest.close) * 100;
    return variation;
  };

  const variationRanges = [
    { label: "1 dia", days: 1 },
    { label: "5 dias", days: 5 },
    { label: "1 mês", days: 30 },
    { label: "6 meses", days: 180 },
    { label: "Year to date", fromJan: true },
    { label: "1 ano", days: 365 },
    { label: "Todos", full: true },
  ];

  return (
    <>
      <Navbar />
      {/* <HeroSection title={data.ticker} subtitle={data.full_name} /> */}
      <div className="page-container ticker-page-container">
        <div className="ticker-page-header">
          <div>
            <h2 className="blue">{data.ticker}</h2>
            <h3>{data.full_name}</h3>
          </div>
        </div>
        <div className="page-content ticker-page-content">
          <div className="ticker-cards-container">
            <div className="ticker-info-card">
              <span className="ticker-info-label">Preço atual</span>
              <h3 className="ticker-info-value">
                R$ {data.price.toFixed(2).replace(".", ",")}
              </h3>
            </div>
            {data.historical &&
              data.historical.length >= 2 &&
              (() => {
                const sorted = [...data.historical].sort(
                  (a, b) => new Date(a.date) - new Date(b.date),
                );

                const lastDate = new Date(sorted[sorted.length - 1].date);
                const oneYearAgo = new Date(lastDate);
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                const closest = sorted.reduce((prev, curr) => {
                  const currDiff = Math.abs(new Date(curr.date) - oneYearAgo);
                  const prevDiff = Math.abs(new Date(prev.date) - oneYearAgo);
                  return currDiff < prevDiff ? curr : prev;
                });

                const pastPrice = closest.close;
                const variation = ((data.price - pastPrice) / pastPrice) * 100;

                return (
                  <div className="ticker-info-card">
                    <span className="ticker-info-label">Variação (12m)</span>
                    <h3
                      className={`ticker-info-value ${variation >= 0 ? "green" : "red"}`}
                    >
                      {variation.toFixed(2).replace(".", ",")}%{" "}
                    </h3>
                  </div>
                );
              })()}
            {data.dividend_yield !== null &&
              data.dividend_yield !== undefined && (
                <div className="ticker-info-card">
                  <span className="ticker-info-label">Dividend Yield</span>
                  <h3 className="ticker-info-value">
                    {Number(data.dividend_yield).toFixed(2).replace(".", ",")}%
                  </h3>
                </div>
              )}

            {data.market_cap > 0 && (
              <div className="ticker-info-card">
                <span className="ticker-info-label">Valor de mercado</span>
                <h3 className="ticker-info-value">
                  {formatMarketCap(data.market_cap)}
                </h3>
              </div>
            )}
          </div>
          <div className="ticker-chart-section">
            <div className="ticker-chart-header">
              <h3>Histórico de Cotações</h3>
              <div className="ticker-chart-btns">
                {[
                  { label: "Tudo", value: "all" },
                  { label: "1 ano", value: "1y" },
                  { label: "6 meses", value: "6m" },
                  { label: "1 mês", value: "1m" },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setChartRange(value)}
                    className={`ticker-chart-btn ${chartRange === value ? "ticker-chart-active" : "secondary-btn"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {data.historical && data.historical.length > 0 && (
              <div className="ticker-chart-container">
                <Line
                  data={buildChartData(data.historical)}
                  className="ticker-chart"
                  options={{
                    responsive: true,
                    interaction: {
                      mode: "index",
                      intersect: false,
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          title: (tooltipItems) => {
                            const date = new Date(tooltipItems[0].parsed.x);
                            if (isNaN(date.getTime())) return "Data inválida";
                            return date.toLocaleDateString("pt-BR");
                          },
                          label: (tooltipItem) => {
                            const value = Number(
                              tooltipItem.raw,
                            ).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              minimumFractionDigits: 2,
                            });
                            return `Preço: ${value}`;
                          },
                        },
                      },
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        ticks: { display: false },
                        grid: { display: false },
                        type: "time",
                        time: {
                          unit: "month",
                          tooltipFormat: "dd/MM/yyyy",
                          displayFormats: {
                            month: "MMM yyyy",
                          },
                        },
                        adapters: {
                          date: { locale: ptBR },
                        },
                      },
                      y: {
                        ticks: {
                          callback: function (value) {
                            return "R$ " + value.toLocaleString("pt-BR");
                          },
                        },
                        grid: { color: "rgba(255,255,255,0.05)" },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
          <div className="ticker-variation-summary">
            {variationRanges.map(({ label, days, fromJan, full }) => {
              let variation = null;

              if (full) {
                const sorted = [...data.historical].sort(
                  (a, b) => new Date(a.date) - new Date(b.date),
                );
                variation =
                  ((sorted[sorted.length - 1].close - sorted[0].close) /
                    sorted[0].close) *
                  100;
              } else if (fromJan) {
                const sorted = [...data.historical].sort(
                  (a, b) => new Date(a.date) - new Date(b.date),
                );
                const latest = sorted[sorted.length - 1];
                const target = sorted.find(
                  (d) =>
                    new Date(d.date).getFullYear() === new Date().getFullYear(),
                );
                if (target) {
                  variation =
                    ((latest.close - target.close) / target.close) * 100;
                }
              } else {
                variation = calculateVariation(data.historical, days);
              }

              if (variation == null) return null;

              const isPositive = variation >= 0;
              const formatted = variation.toFixed(2).replace(".", ",") + "%";

              return (
                <div key={label} className="ticker-variation-item">
                  <span>{label}</span>
                  <strong className={`${isPositive ? "green" : "red"}`}>
                    {formatted}
                  </strong>
                </div>
              );
            })}
          </div>
          <div className="fundamentals-grid">
            {data.asset_type && (
              <div className="fundamentals-card">
                <span className="ticker-info-label">Tipo de ativo</span>
                <h3 className="ticker-info-value">
                  {{
                    stock: "Ação",
                    fii: "FII",
                    etf: "ETF",
                    bdr: "BDR",
                  }[data.asset_type] || "Desconhecido"}
                </h3>
              </div>
            )}

            {data.fundamentals &&
              Object.entries(data.fundamentals).map(([key, value]) => {
                if (value === null || value === undefined) return null;

                const labelMap = {
                  trailing_pe: "P/L",
                  forward_pe: "P/L (futuro)",
                  price_to_book: "P/VP",
                  book_value: "Valor Patrimonial",
                  lpa: "LPA",
                  trailing_eps: "Lucro por Ação",
                  roe: "ROE",
                  roa: "ROA",
                  beta: "Beta",
                  peg_ratio: "PEG Ratio",
                  ebitda_margin: "Margem EBITDA",
                  gross_margin: "Margem Bruta",
                  operating_margin: "Margem Operacional",
                  profit_margin: "Margem Líquida",
                };

                const format = (k, v) => {
                  if (
                    [
                      "roe",
                      "roa",
                      "ebitda_margin",
                      "gross_margin",
                      "operating_margin",
                      "profit_margin",
                    ].includes(k)
                  ) {
                    return (v * 100).toFixed(2).replace(".", ",") + "%";
                  }
                  return typeof v === "number"
                    ? v.toFixed(2).replace(".", ",")
                    : v;
                };

                return (
                  <div key={key} className="fundamentals-card">
                    <span className="ticker-info-label">
                      {labelMap[key] || key}
                    </span>
                    <h3 className="ticker-info-value">{format(key, value)}</h3>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default TickerDetails;
