import Navbar from "../components/NavBar.jsx";
import "../css/Assets.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sampleData = Array.from({ length: 10 }, (_, i) => ({
  name: `${i + 1}`,
  value: 10 + Math.floor(Math.random() * 20),
}));

function AssetSection({ title, tickers }) {
  return (
    <section className="assets-section">
      <h2>
        {title} <span className="assets-arrow">›</span>
      </h2>
      <div className="assets-tickers">
        {tickers.map((ticker) => (
          <span key={ticker} className="assets-ticker">
            {ticker}
          </span>
        ))}
      </div>
      <div className="assets-chart-wrapper">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sampleData}>
            <XAxis dataKey="name" tick={{ fill: "#aaa", fontSize: 12 }} />
            <YAxis tick={{ fill: "#aaa", fontSize: 12 }} domain={[0, 30]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#A78BFA"
              strokeWidth={2}
              dot={{ r: 3, stroke: "#A78BFA", strokeWidth: 1, fill: "#A78BFA" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="assets-filters">
        <span className="active">1 DIA</span>
        <span>1 SEMANA</span>
        <span>1 MÊS</span>
        <span>1 ANO</span>
        <span>TUDO</span>
      </div>
    </section>
  );
}

function Assets() {
  return (
    <>
      <Navbar />
      <main className="assets-container">
        <AssetSection
          title="Ações Nacionais"
          tickers={["PETR4", "BBAS3", "ITSA4", "VALE3", "WEGE3"]}
        />
        <AssetSection
          title="Fundos Imobiliários (FIIs)"
          tickers={["XPML11", "HGLG11", "MXRF11", "BTLG11", "KNRI11"]}
        />
        <AssetSection
          title="BDRs"
          tickers={["AAPL34", "TSLA34", "AMZO34", "NFLX34", "MSFT34"]}
        />
        <AssetSection
          title="ETFs"
          tickers={["BOVA11", "HASH11", "IVVB11", "SMAL11", "DIVO11"]}
        />
        <AssetSection
          title="Fundos de Índice"
          tickers={["BOVV11", "XFIX11", "GOVE11", "ISUS11", "TECK11"]}
        />
        <AssetSection
          title="COEs"
          tickers={["COE1", "COE2", "COE3", "COE4", "COE5"]}
        />
        <AssetSection
          title="Letras de Crédito (LCI/LCA)"
          tickers={["LCI1", "LCA1", "LCI2", "LCA2", "LCI3"]}
        />
        <AssetSection
          title="Debêntures"
          tickers={["DEB1", "DEB2", "DEB3", "DEB4", "DEB5"]}
        />
        <AssetSection
          title="Criptomoedas"
          tickers={["BTC", "ETH", "SOL", "ADA", "MATIC"]}
        />
      </main>
    </>
  );
}

export default Assets;