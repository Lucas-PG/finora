import axios from "axios";

export const fetchAssets = async () => {
  try {
    const response = await axios.get("http://localhost:3001/assets");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ativos:", error);
    return [];
  }
};
