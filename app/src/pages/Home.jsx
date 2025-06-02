import Navbar from "../components/NavBar.jsx";
import { NavLink } from "react-router-dom";
import "../css/Home.css";
import { FaLayerGroup, FaChartBar, FaChartLine } from "react-icons/fa";

function Home() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <section className="home-hero">
          <h1>
            Construa Seu <span>Futuro Financeiro</span>
            <br />
            Com Inteligência
          </h1>
          <p>
            Todas as informações que os investidores <br />
            precisam em um só lugar
          </p>
          <div className="home-hero-buttons">
            <NavLink className="home-btn-primary" to="/login">
              Comece já →
            </NavLink>
            <NavLink className="home-btn-secondary" to="/about">
              Aprenda mais
            </NavLink>
          </div>
        </section>

        <section className="home-section">
          <h2>Por quê a Finora?</h2>
          <div className="home-card-grid">
            <div className="home-card">
              <div className="home-card-icon">
                <div className="home-card-icon-container">
                  <FaLayerGroup size={24} className="home-icon" />
                </div>
              </div>
              <div className="home-card-text">
                <h2>Tudo o que você precisa</h2>
                <span>
                  Chega de abrir várias planilhas e sites diferentes. Reunimos,
                  em uma única plataforma, tudo o que um investidor precisa
                </span>
              </div>
            </div>
            <div className="home-card">
              <div className="home-card-icon">
                <div className="home-card-icon-container">
                  <FaChartBar size={24} className="home-icon" />
                </div>
              </div>
              <div className="home-card-text">
                <h2>Gráficos modernos e interativos</h2>
                <span>
                  Acompanhe seus investimentos com visualizações inteligentes,
                  bonitas e fáceis de entender. Nossos gráficos foram
                  desenvolvidos para destacar o que realmente importa
                </span>
              </div>
            </div>
            <div className="home-card">
              <div className="home-card-icon">
                <div className="home-card-icon-container">
                  <FaChartLine size={24} className="home-icon" />
                </div>
              </div>
              <div className="home-card-text">
                <h2>Informaçöes claras e fáceis</h2>
                <span>
                  Nosso site foi criado para transformar dados complexos do
                  mercado financeiro em informações simples, visuais e
                  compreensíveis.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section">
          <h2>Ativos em Destaque</h2>
          <div className="home-card-grid">
            <div className="home-card">ITUB4</div>
            <div className="home-card">BOVA11</div>
            <div className="home-card">HASH11</div>
            <div className="home-card">PETR4</div>
          </div>
        </section>

        <section className="home-section">
          <h2>Últimas Notícias</h2>
          <div className="home-news-grid">
            <div className="home-news-card">
              <p className="home-news-title">
                Bitcoin bate recorde! Veja as previsões de especialistas.
              </p>
              <p className="home-news-source">www.menti.com</p>
            </div>
            <div className="home-news-card">
              <p className="home-news-title">
                Banco do Brasil é rebaixado! Confira as implicações
              </p>
              <p className="home-news-source">www.fakenews.com</p>
            </div>
            <div className="home-news-card">
              <p className="home-news-title">
                PETR4 irá pagar 5 BILHÕES. Verifique as datas.
              </p>
              <p className="home-news-source">www.vainessa.org</p>
            </div>
          </div>
        </section>

        <section className="home-cta">
          <h2>Pronto para começar a investir?</h2>
          <NavLink
            className="home-btn-primary create-account-btn"
            to="/register"
          >
            Criar Conta Gratuita
          </NavLink>
        </section>
      </div>
    </>
  );
}

export default Home;
