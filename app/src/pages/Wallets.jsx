import Navbar from "../components/NavBar"
import "../css/Wallets.css"
import { FaPlus } from "react-icons/fa"
import { Pie, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
)

function Wallets() {
  const pieData = {
    labels: ["AÇÕES", "RENDA FIXA", "ETFs"],
    datasets: [
      {
        data: [50, 25, 25],
        backgroundColor: ["#0000ff", "#ffff00", "#00ff00"],
        borderWidth: 0,
      },
    ],
  }
  const pieOptions = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || ""
            const value = context.raw
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percent = ((value / total) * 100).toFixed(0) + "%"
            return `${label}: ${percent}`
          },
        },
      },
    },
  }

  const lineData = {
    labels: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
    ],
    datasets: [
      {
        label: "Evolução da Carteira",
        data: [
          5000, 23000, 11000, 19000, 8000, 7000, 15000, 20000, 9000, 18000,
        ],
        borderColor: "#a78bfa",
        backgroundColor: "rgba(167, 139, 250, 0.2)",
        pointBackgroundColor: "#ffffff",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#1e1e2e",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label: function (context) {
            const value = context.raw.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
            return ` ${value}`
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "#1e293b" },
      },
      y: {
        ticks: {
          color: "#94a3b8",
          callback: function (value) {
            return "R$ " + value.toLocaleString("pt-BR")
          },
        },
        grid: { color: "#1e293b" },
      },
    },
  }

  return (
    <>
      <Navbar />
      <div className="wallets-container">
        <div className="wallets-header">
          <h2>Suas Carteiras</h2>
          <button className="add-asset-btn">
            <FaPlus /> Adicionar Ativo
          </button>
        </div>

        <div className="wallets-charts">
          <div className="wallets-charts-left">
            <div className="card wallet-value">
              <div className="wallet-value-header card-header">
                <span>PATRIMÔNIO LÍQUIDO</span>
              </div>
              <div className="wallet-value-body card-body">
                <h3 className="wallet-value-num">R$ 19.560,78</h3>
                <p className="wallet-value-percent">+4,04%</p>
              </div>
            </div>

            <div className="card pizza-chart">
              <div className="card-header">
                <span>DISTRIBUIÇÃO DA CARTEIRA</span>
              </div>
              <div className="pizza-chart-container card-body">
                <Pie data={pieData} options={pieOptions} />
              </div>
              {/* <ul className="legenda"> */}
              {/*   <li> */}
              {/*     <span className="azul"></span> 50% AÇÕES */}
              {/*   </li> */}
              {/*   <li> */}
              {/*     <span className="amarelo"></span> 25% RENDA FIXA */}
              {/*   </li> */}
              {/*   <li> */}
              {/*     <span className="verde"></span> 25% ETFs */}
              {/*   </li> */}
              {/* </ul> */}
            </div>
          </div>

          <div className="wallets-charts-right">
            <div className="card line-chart">
              <div className="card-header">
                <span>EVOLUÇÃO DA CARTEIRA</span>
              </div>
              <div className="card-body line-chart-body">
                <div className="line-chart-container">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ativos-section">
          <h3>
            AÇÕES <span className="subinfo">9 ativos - R$ 10.000</span>
          </h3>
          <div className="tabela-ativos">
            <table>
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Quantidade</th>
                  <th>Preço Médio</th>
                  <th>Preço Atual</th>
                  <th>Rentabilidade</th>
                  <th>Saldo</th>
                  <th>% na Carteira</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BBAS3</td>
                  <td>100</td>
                  <td>R$23,00</td>
                  <td>R$28,50</td>
                  <td className="positivo">+23,91%</td>
                  <td>R$2850,00</td>
                  <td>28,50%</td>
                </tr>
                <tr>
                  <td>PETR4</td>
                  <td>100</td>
                  <td>R$35,00</td>
                  <td>R$36,00</td>
                  <td className="positivo">+2,8%</td>
                  <td>R$3600,00</td>
                  <td>36%</td>
                </tr>
                <tr>
                  <td>BBSE3</td>
                  <td>100</td>
                  <td>R$40,00</td>
                  <td>R$38,00</td>
                  <td className="negativo">-5%</td>
                  <td>R$3800,00</td>
                  <td>38%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="ativos-section">
          <h3>FIIs</h3>
          <p>Você ainda não adicionou nenhum FII.</p>
        </div>

        <div className="ativos-section">
          <h3>BDRs</h3>
          <p>Você ainda não adicionou nenhum BDR.</p>
        </div>

        <div className="ativos-section">
          <h3>ETFs</h3>
          <p>Você ainda não adicionou nenhum ETF.</p>
        </div>

        <div className="ativos-section">
          <h3>Cripto</h3>
          <p>Você ainda não adicionou nenhum ativo de Criptomoedas.</p>
        </div>
      </div>
    </>
  )
}

export default Wallets