import Navbar from "../../components/NavBar";
import HeroSection from "../../components/HeroSection";

function FirstMillion() {
  const title = "Primeiro Milhão";
  const subtitle = "Simule quanto tempo você levaria para atingir R$1.000.000";

  return (
    <>
      <Navbar />
      <HeroSection title={title} subtitle={subtitle} />
    </>
  );
}

export default FirstMillion;
