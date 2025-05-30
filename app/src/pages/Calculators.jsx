import Navbar from "../components/NavBar";
import "../css/Calculators.css";

function Calculators() {
  return (
    <>
      <Navbar />
      <div className="calculators-container">
        <div className="calculators-content">
          <div className="calculators-title-div">
            <h2>Calculadoras de Investimentos</h2>
            <p className="calculators-subtitle">
              Faça os cálculos necessários para planejar, simular ou prever seus
              investimentos.
            </p>
          </div>

          <div className="calculators-grid">
            <div className="calculators-card">
              <h3>Juros Compostos</h3>
              <p>
                Descubra quanto seus investimentos podem render com juros
                compostos. Esse é o modelo mais comum em aplicações de renda
                fixa.
              </p>
              <a href="#">Simular ›</a>
            </div>

            <div className="calculators-card">
              <h3>Juros Simples</h3>
              <p>
                Calcule os rendimentos de seus investimentos usando juros
                simples. Ideal para entender ganhos em aplicações mais diretas
                ou de curto prazo.
              </p>
              <a href="#">Simular ›</a>
            </div>

            <div className="calculators-card">
              <h3>Primeiro Milhão</h3>
              <p>
                Veja quanto tempo e quanto investir por mês para alcançar o seu
                primeiro milhão.
              </p>
              <a href="#">Simular ›</a>
            </div>

            <div className="calculators-card">
              <h3>Porcentagem de Ativos</h3>
              <p>
                Organize sua carteira de investimentos por tipo de ativo.
                Calcule a distribuição ideal entre renda fixa, variável, fundos
                e mais.
              </p>
              <a href="#">Simular ›</a>
            </div>
          </div>
          <div className="suggestion-section">
            <div className="suggestion-content">
              <h4>Não encontrou o que precisava?</h4>
              <span>
                Estamos sempre trabalhando para ajudar nossos usuários a tomar
                as melhores decisões de investimentos. Que tal nos falar o que
                te ajudaria?
              </span>
              <button className="suggest-btn">Sugerir Ferramenta</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calculators;