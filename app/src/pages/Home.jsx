import Navbar from "../components/NavBar.jsx";
import { NavLink } from "react-router-dom";
import "../css/Home.css";
import { FaLayerGroup, FaChartBar, FaChartLine } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { AnimatedSection } from "../components/ui/AnimatedSection.jsx";
import { HiOutlineViewGrid } from "react-icons/hi";
import { BsPieChart } from "react-icons/bs";
import { TbArrowsShuffle } from "react-icons/tb";
import { LuCalculator } from "react-icons/lu";
import NewsCard from "../components/ui/NewsCard";

function Home() {
  // TODO: Pegar isso de uma API
  // https://www.marketaux.com/
  const news = [
    {
      title: "Ibovespa fecha em alta com impulso de commodities",
      source: "infomoney.com.br",
    },
    {
      title: "Selic deve cair novamente em decisão do Copom, dizem analistas",
      source: "valorinveste.globo.com",
    },
    {
      title: "Petrobras anuncia novo plano estratégico até 2028",
      source: "exame.com",
    },
    {
      title: "Dólar recua e fecha abaixo de R$ 5,00 após dados dos EUA",
      source: "cnnbrasil.com.br",
    },
  ];

  return (
    <>
      <Navbar />
      <div>
        <section className="home-hero-section">
          <h1>
            Construa Seu
            <span className="home-hero-h1-highlight"> Futuro Financeiro</span>
            <br />
            de Maneira Simples
          </h1>
          <span>
            Acompanhe o mercado. Organize seus investimentos. Construa seu
            futuro. Tudo em um só lugar.
          </span>

          <div className="home-hero-buttons">
            <NavLink className="home-btn-primary primary-btn" to="/login">
              Comece já
              <FiArrowRight size={20} />
            </NavLink>
            <NavLink className="home-btn-secondary secondary-btn" to="/about">
              Aprenda mais
            </NavLink>
          </div>
        </section>
        <div className="page-container">
          <div className="page-content">
            <section className="home-section">
              <AnimatedSection className="home-animated-section">
                <div className="home-section-title">
                  <h2>
                    Ferramentas Poderosas para
                    <span> Investimentos Inteligentes</span>
                  </h2>
                </div>
                <div className="home-card-grid">
                  <div className="home-card">
                    <div className="home-card-icon">
                      <div className="home-card-icon-container">
                        <HiOutlineViewGrid size={24} className="home-icon" />
                      </div>
                    </div>
                    <div className="home-card-text">
                      <h2>Plataforma completa</h2>
                      <span>
                        Chega de abrir várias planilhas e sites diferentes.
                        Reunimos, em uma única plataforma, tudo o que um
                        investidor precisa.
                      </span>
                    </div>
                  </div>
                  <div className="home-card">
                    <div className="home-card-icon">
                      <div className="home-card-icon-container">
                        <BsPieChart size={24} className="home-icon" />
                      </div>
                    </div>
                    <div className="home-card-text">
                      <h2>Sua carteira</h2>
                      <span>
                        Veja sua carteira atualizada com gráficos intuitivos,
                        distribuição de ativos e histórico de rentabilidade.
                      </span>
                    </div>
                  </div>

                  <div className="home-card">
                    <div className="home-card-icon">
                      <div className="home-card-icon-container">
                        <TbArrowsShuffle size={24} className="home-icon" />
                      </div>
                    </div>
                    <div className="home-card-text">
                      <h2>Simule carteiras</h2>
                      <span>
                        Teste diferentes combinações de ativos e veja como cada
                        carteira se comportaria ao longo do tempo.
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </section>

            <section className="home-section home-dashboard-section">
              <AnimatedSection className="home-dashboard-animated-section">
                <div className="home-dashboard-left">
                  <div className="home-dashboard-text">
                    <h2>
                      Acompanhe Seus Ativos Favoritos
                      <br /> de <span className="blue">Forma Fácil</span>
                    </h2>
                    <span className="faded home-dashboard-subtitle">
                      Acompanhe seus ativos com dashboards interativos, gráficos
                      bonitos e dados atualizados. Entenda sua carteira de um
                      jeito simples, compare investimentos e tome decisões com
                      confiança, tudo em um só lugar.
                    </span>
                  </div>

                  <button className="home-dashboard-btn secondary-btn">
                    Monte sua carteira
                  </button>
                </div>
                <div className="home-dashboard-right">
                  <img src="/img/home-dashboard-img.png" alt="Img" />
                </div>
              </AnimatedSection>
            </section>

            <section className="home-section home-news-section">
              <AnimatedSection className="home-news-animated-section">
                <div className="home-section-title">
                  <h2>
                    Acompanhe as <span className="blue">Últimas Notícias</span>{" "}
                    do Mercado
                  </h2>
                </div>
                <div className="home-news-grid">
                  {news.map((noticia, index) => (
                    <NewsCard
                      key={index}
                      title={noticia.title}
                      source={noticia.source}
                    />
                  ))}
                </div>
              </AnimatedSection>
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
        </div>
      </div>
    </>
  );
}

export default Home;
