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
        .json({ error: "Carteira não encontrada ou não pertence ao usuário." });
    }

    const [sumResult] = await db.query(
      "SELECT SUM(quantity) AS total FROM wallet_assets WHERE walletId = ? AND ticker = ?",
      [walletId, ticker.toUpperCase()],
    );

    const saldoAtual = parseFloat(sumResult[0].total || 0);
    const novaQuantidade = parseFloat(quantity);

    if (novaQuantidade < 0 && saldoAtual + novaQuantidade < 0) {
      console.log(novaQuantidade);
      console.log(saldoAtual);
      return res.status(400).json({
        error: "Venda excede a quantidade disponível na carteira",
      });
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
    res.status(500).json({ error: "Erro interno ao adicionar ativo" });
  }
};

export const deleteWallet = async (req, res) => {
  const userId = req.user.uuid;
  const { id } = req.params;

  try {
    const [wallet] = await db.query(
      "SELECT * FROM wallets WHERE id = ? AND userId = ?",
      [id, userId],
    );
    if (!wallet[0]) {
      return res
        .status(404)
        .json({ error: "Wallet not found or not owned by user" });
    }

    await db.query("DELETE FROM wallet_assets WHERE walletId = ?", [id]);

    await db.query("DELETE FROM wallets WHERE id = ?", [id]);

    res.status(200).json({ message: "Carteira deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar carteira: ", err);
    res.status(500).json({ error: "Erro interno" });
  }
};

export const updateAsset = async (req, res) => {
  const userId = req.user.uuid;
  const { walletId, assetId } = req.params;
  const { ticker, quantity, buy_price, buy_date, type } = req.body;

  try {
    const [wallet] = await db.query(
      "SELECT * FROM wallets WHERE id = ? AND userId = ?",
      [walletId, userId],
    );
    if (!wallet[0]) {
      return res
        .status(404)
        .json({ error: "Carteira não encontrada ou não pertence ao usuário" });
    }

    const [asset] = await db.query(
      "SELECT * FROM wallet_assets WHERE id = ? AND walletId = ?",
      [assetId, walletId],
    );
    if (!asset[0]) {
      return res.status(404).json({ error: "Ativo não encontrado" });
    }

    await db.query(
      "UPDATE wallet_assets SET ticker = ?, quantity = ?, buy_price = ?, buy_date = ?, type = ? WHERE id = ?",
      [ticker.toUpperCase(), quantity, buy_price, buy_date, type, assetId],
    );

    const oldQuantity = parseFloat(asset[0].quantity);
    const [sumResult] = await db.query(
      "SELECT SUM(quantity) AS total FROM wallet_assets WHERE walletId = ? AND ticker = ?",
      [walletId, ticker.toUpperCase()],
    );

    const saldoAtual = parseFloat(sumResult[0].total || 0);
    const novaQuantidade = parseFloat(quantity);
    const saldoAposEdicao = saldoAtual - oldQuantity + novaQuantidade;

    if (novaQuantidade < 0 && saldoAposEdicao < 0) {
      return res.status(400).json({
        error: "Venda excede a quantidade disponível na carteira",
      });
    }

    const [updatedAsset] = await db.query(
      "SELECT * FROM wallet_assets WHERE id = ?",
      [assetId],
    );

    res.status(200).json(updatedAsset[0]);
  } catch (err) {
    console.error("Erro ao atualizar ativo: ", err);
    res.status(500).json({ error: "Erro interno ao atualizar ativo" });
  }
};

export const deleteAsset = async (req, res) => {
  const userId = req.user.uuid;
  const { walletId, assetId } = req.params;

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

    const [asset] = await db.query(
      "SELECT * FROM wallet_assets WHERE id = ? AND walletId = ?",
      [assetId, walletId],
    );
    if (!asset[0]) {
      return res.status(404).json({ error: "Asset not found" });
    }

    await db.query("DELETE FROM wallet_assets WHERE id = ?", [assetId]);

    res.status(200).json({ message: "Lançamento deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar ativo: ", err);
    res.status(500).json({ error: "Erro interno" });
  }
};
