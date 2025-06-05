import Navbar from "../../components/NavBar";
import HeroSection from "../../components/HeroSection";

function AssetPercentage() {
  const title = "Alocação de Porfolio";
  const subtitle = "Organize e visualize a distribuição dos seus investimentos";

  return (
    <>
      <Navbar />
      <HeroSection title={title} subtitle={subtitle} />
    </>
  );
}

export default AssetPercentage;
