import "../css/Calculators.css";

import { FaCalculator } from "react-icons/fa";
import HeroSection from "../components/HeroSection";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

function Calculators() {
  const title = "Calculadoras de Investimentos";
  const subtitle =
    "Use nossas ferramentas para calcular, planejar e prever seus investimentos";

  return (
    <>
      <Navbar />
      <HeroSection title={title} subtitle={subtitle} />
      <div className="page-container">
        <div className="page-content">
          <div className="calculators-card-section">
            <Link className="calculators-card" to="/compound-interest">
              <div className="calculator-icon-section">
                <div className="calculator-icon-around">
                  <FaCalculator size={20} className="calculator-icon" />
                </div>
              </div>
              <div className="calculator-text-section">
                <h3>Juros Compostos</h3>
                <span>
                  O modelo mais comum em aplicações de renda fixa. Veja sua
                  "bola de neve” formando.
                </span>
              </div>
            </Link>

            <Link className="calculators-card" to="/simple-interest">
              <div className="calculator-icon-section">
                <div className="calculator-icon-around">
                  <FaCalculator size={20} className="calculator-icon" />
                </div>
              </div>
              <div className="calculator-text-section">
                <h3>Juros Simples</h3>
                <span>
                  Calcule os rendimentos de seus investimentos usando juros
                  simples.
                </span>
              </div>
            </Link>
            <Link className="calculators-card" to="/first-million">
              <div className="calculator-icon-section">
                <div className="calculator-icon-around">
                  <FaCalculator size={20} className="calculator-icon" />
                </div>
              </div>
              <div className="calculator-text-section">
                <h3>Primeiro Milhão</h3>
                <span>
                  Veja quanto tempo e quanto investir por mês para alcançar o
                  seu primeiro milhão.
                </span>
              </div>
            </Link>
            <Link className="calculators-card" to="/asset-percentage">
              <div className="calculator-icon-section">
                <div className="calculator-icon-around">
                  <FaCalculator size={20} className="calculator-icon" />
                </div>
              </div>
              <div className="calculator-text-section">
                <h3>Alocação de Portfolio</h3>
                <span>
                  Monte sua carteira ideal organizando seus ativos por tipo e
                  perfil de investimento.
                </span>
              </div>
            </Link>
          </div>
          <div className="suggest-tool-section">
            <div className="suggest-tool-card">
              <div className="suggest-title-section">
                <h2>Não encontrou o que precisava?</h2>
                <span>
                  Estamos sempre trabalhando para ajudar nossos usuários a tomar
                  as melhores decisões de investimentos. Que tal nos contar que
                  tipo de ferramenta te ajudaria?
                </span>
              </div>
              <div className="suggest-btn-section">
                <button type="button" className="primary-btn suggest-btn">
                  Sugerir Ferramenta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calculators;
