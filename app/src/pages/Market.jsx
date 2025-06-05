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
import { assetsData, highlightAssets } from "../data/assetsData";

const getAssetIcon = (type) => {
  switch (type) {
    case "stock":
      return <FaChartLine size={24} className="market-icon" />;
    case "crypto":
      return <RiCoinsLine size={24} className="market-icon" />;
    case "etf":
      return <MdShowChart size={24} className="market-icon" />;
    case "fii":
      return <FaUniversity size={24} className="market-icon" />;
    case "bdr":
      return <FaChartLine size={24} className="market-icon" />;
    default:
      return <FaChartLine size={24} className="market-icon" />;
  }
};

function Market() {
  const [assetsSearch, setAssetsSearch] = useState("");
  const [activeAssetsFilter, setActiveAssetsFilter] = useState("all");

  // Para não ficar reescrevendo
  const normalizeString = (str) => str.toLowerCase().trim().replace(/\s+/g, "");

  const filteredAssets = assetsData.filter((asset) => {
    const searchTerm = normalizeString(assetsSearch);
    const matchesSearch =
      normalizeString(asset.name).includes(searchTerm) ||
      normalizeString(asset.fullName).includes(searchTerm);
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
          </AnimatedSection>
          <AnimatedSection
            className="market-assets-animated-section market-list-animated-section"
            rootMargin="600px"
          >
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
