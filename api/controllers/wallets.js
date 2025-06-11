import { db } from "../db.js";

export const getUserWallets = (req, res) => {
  const userId = req.user.userId;

  db.query("SELECT * FROM wallets WHERE userId = ?", [userId], (err, wallets) => {
    if (err) {
      console.error("Erro ao buscar carteiras: ", err);
      return res.status(500).json({ error: "Erro interno" });
    }

    let count = wallets.length;
    if (count === 0) return res.json(wallets);

    wallets.forEach((wallet) => {
      db.query(
        "SELECT * FROM wallet_assets WHERE walletId = ?",
        [wallet.id],
        (err, assets) => {
          if (err) {
            console.error("Erro ao buscar ativos: ", err);
            return res.status(500).json({ error: "Erro interno" });
          }

          wallet.assets = assets;
          count--;

          if (count === 0) {
            res.json(wallets);
          }
        }
      );
    });
  });
};

export const createWallet = (req, res) => {
  const userId = req.user.userId;
  const { walletName } = req.body;

  db.query(
    "INSERT INTO wallets (userId, name) VALUES (?, ?)",
    [userId, walletName],
    (err, result) => {
      if (err) {
        console.error("Erro ao criar carteira: ", err);
        return res.status(500).json({ error: "Erro interno" });
      }

      db.query(
        "SELECT * FROM wallets WHERE id = ?",
        [result.insertId],
        (err, wallet) => {
          if (err) {
            console.error("Erro ao buscar carteira criada: ", err);
            return res.status(500).json({ error: "Erro interno" });
          }
          res.status(201).json(wallet[0]);
        }
      );
    }
  );
};

export const addAsset = (req, res) => {
  const userId = req.user.userId;
  const { walletId, ticker, quantity, buy_price, buy_date, type } = req.body;

  db.query(
    "SELECT * FROM wallets WHERE id = ? AND userId = ?",
    [walletId, userId],
    (err, wallet) => {
      if (err) {
        console.error("Erro ao buscar carteira: ", err);
        return res.status(500).json({ error: "Erro interno" });
      }

      if (!wallet[0]) {
        return res
          .status(404)
          .json({ error: "Carteira não encontrada ou não pertence ao usuário." });
      }

      db.query(
        "SELECT SUM(quantity) AS total FROM wallet_assets WHERE walletId = ? AND ticker = ?",
        [walletId, ticker.toUpperCase()],
        (err, sumResult) => {
          if (err) {
            console.error("Erro ao buscar soma de quantidade: ", err);
            return res.status(500).json({ error: "Erro interno" });
          }

          const saldoAtual = parseFloat(sumResult[0].total || 0);
          const novaQuantidade = parseFloat(quantity);

          if (novaQuantidade < 0 && saldoAtual + novaQuantidade < 0) {
            return res.status(400).json({
              error: "Venda excede a quantidade disponível na carteira",
            });
          }

          db.query(
            "INSERT INTO wallet_assets (walletId, ticker, quantity, buy_price, buy_date, type) VALUES (?, ?, ?, ?, ?, ?)",
            [walletId, ticker.toUpperCase(), quantity, buy_price, buy_date, type],
            (err, result) => {
              if (err) {
                console.error("Erro ao adicionar ativo: ", err);
                return res.status(500).json({ error: "Erro interno ao adicionar ativo" });
              }

              db.query(
                "SELECT * FROM wallet_assets WHERE id = ?",
                [result.insertId],
                (err, newAsset) => {
                  if (err) {
                    console.error("Erro ao buscar ativo adicionado: ", err);
                    return res.status(500).json({ error: "Erro interno" });
                  }
                  res.status(201).json(newAsset[0]);
                }
              );
            }
          );
        }
      );
    }
  );
};

export const deleteWallet = (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  db.query(
    "SELECT * FROM wallets WHERE id = ? AND userId = ?",
    [id, userId],
    (err, wallet) => {
      if (err) {
        console.error("Erro ao buscar carteira: ", err);
        return res.status(500).json({ error: "Erro interno" });
      }
      if (!wallet[0]) {
        return res
          .status(404)
          .json({ error: "Wallet not found or not owned by user" });
      }

      db.query("DELETE FROM wallet_assets WHERE walletId = ?", [id], (err) => {
        if (err) {
          console.error("Erro ao deletar ativos da carteira: ", err);
          return res.status(500).json({ error: "Erro interno" });
        }

        db.query("DELETE FROM wallets WHERE id = ?", [id], (err) => {
          if (err) {
            console.error("Erro ao deletar carteira: ", err);
            return res.status(500).json({ error: "Erro interno" });
          }

          res.status(200).json({ message: "Carteira deletada com sucesso" });
        });
      });
    }
  );
};

export const updateAsset = (req, res) => {
  const userId = req.user.userId;
  const { walletId, assetId } = req.params;
  const { ticker, quantity, buy_price, buy_date, type } = req.body;

  db.query(
    "SELECT * FROM wallets WHERE id = ? AND userId = ?",
    [walletId, userId],
    (err, wallet) => {
      if (err) {
        console.error("Erro ao buscar carteira: ", err);
        return res.status(500).json({ error: "Erro interno" });
      }
      if (!wallet[0]) {
        return res
          .status(404)
          .json({ error: "Carteira não encontrada ou não pertence ao usuário" });
      }

      db.query(
        "SELECT * FROM wallet_assets WHERE id = ? AND walletId = ?",
        [assetId, walletId],
        (err, asset) => {
          if (err) {
            console.error("Erro ao buscar ativo: ", err);
            return res.status(500).json({ error: "Erro interno" });
          }
          if (!asset[0]) {
            return res.status(404).json({ error: "Ativo não encontrado" });
          }

          const oldQuantity = parseFloat(asset[0].quantity);
          const novaQuantidade = parseFloat(quantity);

          db.query(
            "SELECT SUM(quantity) AS total FROM wallet_assets WHERE walletId = ? AND ticker = ?",
            [walletId, ticker.toUpperCase()],
            (err, sumResult) => {
              if (err) {
                console.error("Erro ao buscar soma quantidade: ", err);
                return res.status(500).json({ error: "Erro interno" });
              }

              const saldoAtual = parseFloat(sumResult[0].total || 0);
              const saldoAposEdicao = saldoAtual - oldQuantity + novaQuantidade;

              if (novaQuantidade < 0 && saldoAposEdicao < 0) {
                return res.status(400).json({
                  error: "Venda excede a quantidade disponível na carteira",
                });
              }

              db.query(
                "UPDATE wallet_assets SET ticker = ?, quantity = ?, buy_price = ?, buy_date = ?, type = ? WHERE id = ?",
                [ticker.toUpperCase(), quantity, buy_price, buy_date, type, assetId],
                (err) => {
                  if (err) {
                    console.error("Erro ao atualizar ativo: ", err);
                    return res.status(500).json({ error: "Erro interno ao atualizar ativo" });
                  }

                  db.query(
                    "SELECT * FROM wallet_assets WHERE id = ?",
                    [assetId],
                    (err, updatedAsset) => {
                      if (err) {
                        console.error("Erro ao buscar ativo atualizado: ", err);
                        return res.status(500).json({ error: "Erro interno" });
                      }
                      res.status(200).json(updatedAsset[0]);
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

export const deleteAsset = (req, res) => {
  const userId = req.user.userId;
  const { walletId, assetId } = req.params;

  db.query(
    "SELECT * FROM wallets WHERE id = ? AND userId = ?",
    [walletId, userId],
    (err, wallet) => {
      if (err) {
        console.error("Erro ao buscar carteira: ", err);
        return res.status(500).json({ error: "Erro interno" });
      }
      if (!wallet[0]) {
        return res
          .status(404)
          .json({ error: "Wallet not found or not owned by user" });
      }

      db.query(
        "SELECT * FROM wallet_assets WHERE id = ? AND walletId = ?",
        [assetId, walletId],
        (err, asset) => {
          if (err) {
            console.error("Erro ao buscar ativo: ", err);
            return res.status(500).json({ error: "Erro interno" });
          }
          if (!asset[0]) {
            return res.status(404).json({ error: "Asset not found" });
          }

          db.query("DELETE FROM wallet_assets WHERE id = ?", [assetId], (err) => {
            if (err) {
              console.error("Erro ao deletar ativo: ", err);
              return res.status(500).json({ error: "Erro interno" });
            }
            res.status(200).json({ message: "Lançamento deletado com sucesso" });
          });
        }
      );
    }
  );
};

export const getWalletHistoricalData = (req, res) => {
  const walletId = req.params.walletId;

  db.query(
    "SELECT DISTINCT ticker FROM wallet_assets WHERE walletId = ?",
    [walletId],
    (err, assets) => {
      if (err) {
        console.error("Erro ao buscar tickers: ", err);
        return res.status(500).json({ error: "Erro ao buscar histórico" });
      }

      const tickers = assets.map((a) => a.ticker);

      if (tickers.length === 0) return res.json([]);

      db.query(
        `SELECT ticker, date, close 
         FROM historical_data 
         WHERE ticker IN (?) 
         ORDER BY date ASC`,
        [tickers],
        (err, historicalData) => {
          if (err) {
            console.error("Erro ao buscar histórico:", err);
            return res.status(500).json({ error: "Erro ao buscar histórico" });
          }

          res.json(historicalData);
        }
      );
    }
  );
};

export const updateWalletName = (req, res) => {
  const { id } = req.params;
  const { walletName } = req.body;

  db.query("UPDATE wallets SET name = ? WHERE id = ?", [walletName, id], (err) => {
    if (err) {
      console.error("Erro ao atualizar nome da carteira:", err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
};
