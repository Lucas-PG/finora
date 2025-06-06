import db from "../db.js";

export const getAssets = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM historical_data");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar ativos:", err);
    res.status(500).json({ error: "Erro ao buscar ativos no banco de dados" });
  }
};
