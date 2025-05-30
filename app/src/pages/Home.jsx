import Navbar from "../components/NavBar.jsx"
import "../css/Home.css"

function Home() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <section className="home-hero">
          <h1>
            Invista no seu futuro de <br />
            maneira simples
          </h1>
          <p>
            Todas as informações que os investidores <br />
            precisam em um só lugar
          </p>
          <div className="home-hero-buttons">
            <button className="home-btn-primary">Comece já →</button>
            <button className="home-btn-secondary">Aprenda mais</button>
          </div>
        </section>

        <section className="home-section">
          <h2>Por quê a Finora?</h2>
          <div className="home-card-grid">
            <div className="home-card">Motivo 1</div>
            <div className="home-card">Motivo 2</div>
            <div className="home-card">Motivo 3</div>
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
          <button className="home-btn-primary create-account-btn">
            Criar Conta Gratuita
          </button>
        </section>
      </div>
    </>
  )
}

export default Home