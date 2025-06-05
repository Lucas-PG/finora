import Navbar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import "../css/Market.css";
import { useState } from "react";
import { AnimatedSection } from "../components/ui/AnimatedSection";
import { CiSearch } from "react-icons/ci";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { FaChartLine, FaUniversity } from "react-icons/fa";
import { MdShowChart } from "react-icons/md";
import { RiCoinsLine } from "react-icons/ri";

const highlightAssets = [
  { name: "IBOVESPA", price: "R$140.560", change: "+2.60%", type: "index" },
  { name: "BITCOIN", price: "R$554.210", change: "+5.60%", type: "crypto" },
  {
    name: "Banco Do Brasil",
    price: "R$32.45",
    change: "-12.15%",
    type: "bank",
  },
  { name: "IVVB11", price: "R$392.12", change: "+10.70%", type: "etf" },
];

const assetsData = [
  {
    name: "PETR4",
    price: "R$410,66",
    change: "-14,45%",
    marketCap: "R$723,62B",
    chart: "down",
    type: "stock",
  },
  {
    name: "IVVB11",
    price: "R$246,46",
    change: "-9,94%",
    marketCap: "R$458,85B",
    chart: "down",
    type: "etf",
  },
  {
    name: "HGLG11",
    price: "R$302,45",
    change: "-12,30%",
    marketCap: "R$178,31B",
    chart: "down",
    type: "fii",
  },
  {
    name: "AAPL34",
    price: "R$383,17",
    change: "+1,26%",
    marketCap: "R$404,90B",
    chart: "up",
    type: "bdr",
  },
  {
    name: "BTC",
    price: "R$468,43",
    change: "-10,41%",
    marketCap: "R$239,23B",
    chart: "down",
    type: "crypto",
  },
  {
    name: "VALE3",
    price: "R$442,11",
    change: "+9,00%",
    marketCap: "R$391,77B",
    chart: "up",
    type: "stock",
  },
  {
    name: "HASH11",
    price: "R$420,99",
    change: "+6,75%",
    marketCap: "R$165,71B",
    chart: "up",
    type: "etf",
  },
  {
    name: "XPML11",
    price: "R$247,71",
    change: "-1,10%",
    marketCap: "R$497,82B",
    chart: "down",
    type: "fii",
  },
  {
    name: "MSFT34",
    price: "R$559,91",
    change: "+3,40%",
    marketCap: "R$253,77B",
    chart: "up",
    type: "bdr",
  },
  {
    name: "ETH",
    price: "R$471,83",
    change: "+6,26%",
    marketCap: "R$401,93B",
    chart: "up",
    type: "crypto",
  },
  {
    name: "ITUB4",
    price: "R$35,12",
    change: "-2,15%",
    marketCap: "R$345,22B",
    chart: "down",
    type: "stock",
  },
  {
    name: "BOVA11",
    price: "R$125,80",
    change: "-3,50%",
    marketCap: "R$280,45B",
    chart: "down",
    type: "etf",
  },
  {
    name: "KNRI11",
    price: "R$160,25",
    change: "+0,85%",
    marketCap: "R$210,33B",
    chart: "up",
    type: "fii",
  },
  {
    name: "GOGL34",
    price: "R$420,50",
    change: "+2,75%",
    marketCap: "R$510,88B",
    chart: "up",
    type: "bdr",
  },
  {
    name: "BNB",
    price: "R$350,20",
    change: "+4,10%",
    marketCap: "R$190,75B",
    chart: "up",
    type: "crypto",
  },
  {
    name: "WEGE3",
    price: "R$45,90",
    change: "+1,30%",
    marketCap: "R$192,15B",
    chart: "up",
    type: "stock",
  },
  {
    name: "SMAL11",
    price: "R$110,45",
    change: "-4,20%",
    marketCap: "R$150,60B",
    chart: "down",
    type: "etf",
  },
  {
    name: "BCFF11",
    price: "R$90,10",
    change: "-0,95%",
    marketCap: "R$130,22B",
    chart: "down",
    type: "fii",
  },
  {
    name: "AMZO34",
    price: "R$380,75",
    change: "+2,90%",
    marketCap: "R$490,30B",
    chart: "up",
    type: "bdr",
  },
  {
    name: "ADA",
    price: "R$2,85",
    change: "-5,60%",
    marketCap: "R$100,12B",
    chart: "down",
    type: "crypto",
  },
  {
    name: "MGLU3",
    price: "R$12,30",
    change: "-8,15%",
    marketCap: "R$85,40B",
    chart: "down",
    type: "stock",
  },
  {
    name: "XINA11",
    price: "R$80,50",
    change: "-2,75%",
    marketCap: "R$95,88B",
    chart: "down",
    type: "etf",
  },
  {
    name: "VILG11",
    price: "R$105,20",
    change: "+1,10%",
    marketCap: "R$145,65B",
    chart: "up",
    type: "fii",
  },
  {
    name: "TSLA34",
    price: "R$320,15",
    change: "+5,40%",
    marketCap: "R$430,22B",
    chart: "up",
    type: "bdr",
  },
  {
    name: "XRP",
    price: "R$3,10",
    change: "-3,25%",
    marketCap: "R$170,90B",
    chart: "down",
    type: "crypto",
  },
  {
    name: "BBAS3",
    price: "R$28,75",
    change: "+0,50%",
    marketCap: "R$200,45B",
    chart: "up",
    type: "stock",
  },
  {
    name: "GOLD11",
    price: "R$65,30",
    change: "-1,80%",
    marketCap: "R$88,15B",
    chart: "down",
    type: "etf",
  },
  {
    name: "MXRF11",
    price: "R$10,25",
    change: "+0,75%",
    marketCap: "R$120,50B",
    chart: "up",
    type: "fii",
  },
  {
    name: "NVDC34",
    price: "R$510,80",
    change: "+4,60%",
    marketCap: "R$380,90B",
    chart: "up",
    type: "bdr",
  },
  {
    name: "SOL",
    price: "R$950,40",
    change: "+7,20%",
    marketCap: "R$220,33B",
    chart: "up",
    type: "crypto",
  },
];

const getAssetIcon = (type) => {
  switch (type) {
    case "stock":
      return <FaChartLine size={24} className="market-icon" />;
    case "crypto":
      return <RiCoinsLine size={24} className="market-icon" />;
    case "etf":
      return <MdShowChart size={24} className="market-icon" />;
    case "bank":
      return <FaUniversity size={24} className="market-icon" />;
    case "index":
    default:
      return <FaChartLine size={24} className="market-icon" />;
  }
};

function Market() {
  const [assetsSearch, setAssetsSearch] = useState("");
  const [activeAssetsFilter, setActiveAssetsFilter] = useState("all");

  const filteredAssets = assetsData.filter((asset) => {
    const matchesSearch = asset.name
      .toLowerCase()
      .includes(assetsSearch.toLowerCase());
    const matchesFilter =
      activeAssetsFilter === "all" || asset.type === activeAssetsFilter;
    return matchesSearch && matchesFilter;
  });

  const handleFilterClick = (filter) => {
    setActiveAssetsFilter(filter);
  };

  return (
    <>
      <Navbar />
      <HeroSection
        title="Resumo do Mercado"
        subtitle="Acompanhe as últimas cotações dos seus ativos favoritos"
      />
      <div className="page-container">
        <div className="page-content">
          <AnimatedSection className="market-highlight-animated-section">
            <h2>
              Em <span className="blue">Destaque</span>
            </h2>
            <div className="market-highlight-cards-container">
              {highlightAssets.map((item, index) => (
                <div key={index} className="market-highlight-card">
                  <div className="market-highlight-card-left">
                    <div className="market-icon-around">
                      {getAssetIcon(item.type)}
                    </div>
                  </div>
                  <div className="market-highlight-card-right">
                    <div className="market-card-name">
                      <span>{item.name}</span>
                    </div>
                    <div className="market-card-price">
                      <span>{item.price}</span>
                      <span
                        className={`market-card-variation ${
                          item.change.startsWith("+") ? "green" : "red"
                        }`}
                      >
                        {" "}
                        {item.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection className="market-assets-animated-section">
            <div className="market-assets-header">
              <h2 className="blue">Ativos</h2>
              <div className="market-assets-header-right">
                <div className="market-assets-input-container">
                  <CiSearch size={26} className="market-assets-search-icon" />
                  <input
                    type="text"
                    placeholder="Pesquise Ativos..."
                    value={assetsSearch}
                    onChange={(e) => setAssetsSearch(e.target.value)}
                    className="market-assets-input"
                  />
                </div>
                <button
                  className={`market-filter ${activeAssetsFilter === "all" ? "market-filter-active" : "secondary-btn"}`}
                  onClick={() => handleFilterClick("all")}
                >
                  Tudo
                </button>
                <button
                  className={`market-filter ${
                    activeAssetsFilter === "stock"
                      ? "market-filter-active"
                      : "secondary-btn"
                  }`}
                  onClick={() => handleFilterClick("stock")}
                >
                  Ações
                </button>
                <button
                  className={`market-filter ${
                    activeAssetsFilter === "fii"
                      ? "market-filter-active"
                      : "secondary-btn"
                  }`}
                  onClick={() => handleFilterClick("fii")}
                >
                  FIIs
                </button>
                <button
                  className={`market-filter ${
                    activeAssetsFilter === "etf"
                      ? "market-filter-active"
                      : "secondary-btn"
                  }`}
                  onClick={() => handleFilterClick("etf")}
                >
                  ETFs
                </button>
                <button
                  className={`market-filter ${
                    activeAssetsFilter === "bdr"
                      ? "market-filter-active"
                      : "secondary-btn"
                  }`}
                  onClick={() => handleFilterClick("bdr")}
                >
                  BDRs
                </button>
                <button
                  className={`market-filter ${
                    activeAssetsFilter === "crypto"
                      ? "market-filter-active"
                      : "secondary-btn"
                  }`}
                  onClick={() => handleFilterClick("crypto")}
                >
                  Cripto
                </button>
              </div>
            </div>
            <div className="market-list-container">
              <div className="market-list-header">
                <div>
                  <span>Nome</span>
                </div>
                <div>
                  <span>Cotação</span>
                </div>
                <div>
                  <span>Variação (24h)</span>
                </div>
                <div>
                  <span>Valor de Mercado</span>
                </div>
                <div>
                  <span>Gráfico</span>
                </div>
                <div>
                  <span>Ver Mais</span>
                </div>
              </div>
              <div className="market-list-body">
                {filteredAssets.map((asset, index) => (
                  <div key={index} className="market-list-asset-card">
                    <div>
                      <span>{asset.name}</span>
                    </div>
                    <div>
                      <span>{asset.price}</span>
                    </div>
                    <div>
                      <span
                        className={
                          asset.change.startsWith("+") ? "green" : "red"
                        }
                      >
                        {asset.change}
                      </span>
                    </div>
                    <div>
                      <span>{asset.marketCap}</span>
                    </div>
                    <div>
                      <span>
                        {asset.chart === "down" ? (
                          <FaAngleDoubleDown size={20} className="red" />
                        ) : (
                          <FaAngleDoubleUp size={20} className="green" />
                        )}
                      </span>
                    </div>
                    <div>
                      <button className="secondary-btn market-list-asset-btn">
                        Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}

export default Market;
