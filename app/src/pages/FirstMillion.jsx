import Navbar from "../components/NavBar";

function FirstMillion() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", color: "#ccc" }}>
        <h1>Primeiro Milhão</h1>
        <p>Simule quanto tempo você levaria para atingir R$1.000.000.</p>
      </div>
    </>
  );
}

export default FirstMillion;
