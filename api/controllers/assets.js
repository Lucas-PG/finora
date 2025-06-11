import { db } from "../db.js";

export const getAssets = (req, res) => {
  db.query("SELECT * FROM historical_data", (err, results) => {
    if (err) {
      console.error("Erro ao buscar ativos:", err);
      return res.status(500).json({ error: "Erro ao buscar ativos" });
    }
    res.status(200).json(results);
  });
};

export const getTickerInfo = (req, res) => {
  const { ticker } = req.params;

  const mainQuery = `
    SELECT 
      h.ticker,
      h.full_name,
      h.close AS price,
      h.dividend_yield,
      h.market_cap,
      f.trailing_pe,
      f.forward_pe,
      f.price_to_book,
      f.book_value,
      f.lpa,
      f.trailing_eps,
      f.roe,
      f.roa,
      f.beta,
      f.peg_ratio,
      f.ebitda_margin,
      f.gross_margin,
      f.operating_margin,
      f.profit_margin
    FROM historical_data h
    LEFT JOIN fundamentals_data f ON h.ticker = f.ticker
    WHERE h.ticker = ?
    ORDER BY h.date DESC
    LIMIT 1
  `;

  db.query(mainQuery, [ticker], (err, results) => {
    if (err) {
      console.error("Erro ao buscar ticker:", err);
      return res.status(500).json({ message: "Erro ao buscar ticker." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Ticker não encontrado." });
    }

    const asset = results[0];

    db.query(
      "SELECT date, close FROM historical_data WHERE ticker = ? ORDER BY date ASC",
      [ticker],
      (err2, historicalResults) => {
        if (err2) {
          console.error("Erro ao buscar histórico:", err2);
          return res.status(500).json({ message: "Erro ao buscar histórico." });
        }

        res.status(200).json({
          ticker: asset.ticker,
          full_name: asset.full_name,
          price: asset.price,
          dividend_yield: asset.dividend_yield,
          market_cap: asset.market_cap,
          fundamentals: {
            trailing_pe: asset.trailing_pe,
            forward_pe: asset.forward_pe,
            price_to_book: asset.price_to_book,
            book_value: asset.book_value,
            lpa: asset.lpa,
            trailing_eps: asset.trailing_eps,
            roe: asset.roe,
            roa: asset.roa,
            beta: asset.beta,
            peg_ratio: asset.peg_ratio,
            ebitda_margin: asset.ebitda_margin,
            gross_margin: asset.gross_margin,
            operating_margin: asset.operating_margin,
            profit_margin: asset.profit_margin,
          },
          historical: historicalResults,
        });
      }
    );
  });
};
