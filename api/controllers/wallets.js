import { db } from "../db.js";

export const getUserWallets = async (req, res) => {
  const userId = req.user.uuid;

  try {
    const [wallets] = await db.query("SELECT * FROM wallets WHERE userId = ?", [
      userId,
    ]);

    for (let wallet of wallets) {
      const [assets] = await db.query(
        "SELECT * FROM wallet_assets WHERE walletId = ?",
        [wallet.id],
      );

      wallet.assets = assets;
    }

    res.json(wallets);
  } catch (err) {
    console.error("Erro ao buscar carteiras: ", err);
    res.status(500).json({ error: "Erro interno" });
  }
};

export const createWallet = async (req, res) => {
  const userId = req.user.uuid;
  const { walletName } = req.body;

  try {
    console.log("Payload JWT no req.user:", req.user);
    const [result] = await db.query(
      "INSERT INTO wallets (userId, name) VALUES (?, ?)",
      [userId, walletName],
    );

    const [wallet] = await db.query("SELECT * FROM wallets WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(wallet[0]);
  } catch (err) {
    console.error("Erro ao criar carteira: ", err);
    res.status(500).json({ error: "Erro interno" });
  }
};

export const addAsset = async (req, res) => {
  const userId = req.user.uuid;
  const { walletId, ticker, quantity, buy_price, buy_date, type } = req.body;

  try {
    const [wallet] = await db.query(
      "SELECT * FROM wallets WHERE id = ? AND userId = ?",
      [walletId, userId],
    );
    if (!wallet[0]) {
      return res
        .status(404)
        .json({ error: "Wallet not found or not owned by user" });
    }

    const [result] = await db.query(
      "INSERT INTO wallet_assets (walletId, ticker, quantity, buy_price, buy_date, type) VALUES (?, ?, ?, ?, ?, ?)",
      [walletId, ticker.toUpperCase(), quantity, buy_price, buy_date, type],
    );

    const [newAsset] = await db.query(
      "SELECT * FROM wallet_assets WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json(newAsset[0]);
  } catch (err) {
    console.error("Erro ao adicionar ativo: ", err);
    res.status(500).json({ error: "Erro interno" });
  }
};
