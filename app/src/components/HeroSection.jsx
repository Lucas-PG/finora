import "../css/HeroSection.css";

function HeroSection({ title, subtitle }) {
  // Pintar ultima palavra apenas
  const words = title.trim().split(" ");
  const lastWord = words.pop();
  const rest = words.join(" ");

  return (
    <section className="hero-section">
      <h1>
        {rest} <span className="hero-h1-highlight">{lastWord}</span>
      </h1>
      <span>{subtitle}</span>
    </section>
  );
}

export default HeroSection;
