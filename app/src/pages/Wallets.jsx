import Navbar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import { AnimatedSection } from "../components/ui/AnimatedSection.jsx";
import { FaWallet } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { LuX } from "react-icons/lu";
import { AuthContext } from "../context/AuthContext.jsx";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { assetList } from "../data/assetsData.js";
import {
  Modal,
  Button,
  Typography,
  Autocomplete,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import FloatingInput from "../components/ui/FloatingInput.jsx";
import "../css/Wallets.css";

function Wallets() {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const { token } = useContext(AuthContext);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showDividendsModal, setShowDividendsModal] = useState(false);
  const [transactionType, setTransactionType] = useState("buy");
  const [ticker, setTicker] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetData, setAssetData] = useState({});
  const [receivedDividends, setReceivedDividends] = useState(0);
  const [walletListFilter, setWalletListFilter] = useState("Tudo");
  const tickerOptions = assetList[assetType] || [];

  const fetchWallets = async () => {
    try {
      const res = await axios.get("http://localhost:3001/wallets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedWallets = res.data;
      setWallets(fetchedWallets);

      const savedId = localStorage.getItem("selectedWalletId");
      const restoredWallet = fetchedWallets.find(
        (w) => w.id === Number(savedId),
      );

      if (restoredWallet) {
        setSelectedWallet(restoredWallet);
      } else if (fetchedWallets.length > 0) {
        setSelectedWallet(fetchedWallets[0]);
      }

      return fetchedWallets;
    } catch (err) {
      console.error(
        "Erro ao buscar carteiras:",
        err.response?.data || err.message,
      );
    }
  };

  const fetchAssetData = async () => {
    try {
      const res = await axios.get("http://localhost:3001/assets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      const latestData = {};
      data.forEach((item) => {
        if (
          !latestData[item.ticker] ||
          new Date(item.date) > new Date(latestData[item.ticker].date)
        ) {
          latestData[item.ticker] = item;
        }
      });
      setAssetData(latestData);
    } catch (err) {
      console.error(
        "Erro ao buscar dados de ativos:",
        err.response?.data || err.message,
      );
    }
  };

  useEffect(() => {
    const fetchAndCalculateDividends = async () => {
      if (!selectedWallet || !selectedWallet.assets) return;

      try {
        const res = await axios.get("http://localhost:3001/assets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const historicalData = res.data;
        const total = calculateReceivedDividends(
          selectedWallet.assets,
          historicalData,
        );
        setReceivedDividends(total);
      } catch (err) {
        console.error("Erro ao calcular dividendos recebidos:", err);
      }
    };

    fetchAndCalculateDividends();
  }, [selectedWallet, token]);

  useEffect(() => {
    fetchWallets();
    fetchAssetData();
  }, [token]);

  const handleCreateWallet = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/wallets",
        { walletName: newWalletName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const newWallet = { ...res.data, assets: res.data.assets || [] };
      setWallets([...wallets, newWallet]);
      setSelectedWallet(newWallet);
      setNewWalletName("");
      setShowWalletForm(false);
    } catch (err) {
      console.error(
        "Erro ao criar carteira:",
        err.response?.data || err.message,
      );
    }
  };

  const handleAddAsset = async () => {
    const parsedPrice = parseFloat(price);
    const parsedAmount = parseFloat(amount);

    if (
      !ticker ||
      isNaN(parsedPrice) ||
      isNaN(parsedAmount) ||
      !date ||
      !assetType
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3001/wallets/${selectedWallet.id}/assets`,
        {
          walletId: selectedWallet.id,
          ticker: ticker.toUpperCase(),
          quantity: transactionType === "buy" ? parsedAmount : -parsedAmount,
          buy_price: parsedPrice,
          buy_date: new Date(date).toISOString().split("T")[0],
          type: assetType,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const newAsset = res.data;
      setSelectedWallet((prev) => ({
        ...prev,
        assets: [...(prev.assets || []), newAsset],
      }));

      const updatedWallets = await fetchWallets();
      await fetchAssetData();

      const updatedWallet = updatedWallets.find(
        (w) => w.id === selectedWallet.id,
      );
      setSelectedWallet(updatedWallet);

      setShowTransactionModal(false);
      setTicker("");
      setPrice("");
      setAmount("");
      setDate("");
      setAssetType("acao");
      alert("Ativo adicionado com sucesso!");
    } catch (err) {
      console.error("Erro ao adicionar ativo:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      alert(
        `Erro ao adicionar ativo: ${
          err.response?.data?.error || err.message || "Tente novamente"
        }`,
      );
    }
  };

  const totalInvested = (selectedWallet?.assets || []).reduce(
    (sum, asset) => sum + (asset.quantity || 0) * (asset.buy_price || 0),
    0,
  );

  const totalMarketValue = (selectedWallet?.assets || []).reduce(
    (sum, asset) => {
      const latest = assetData[asset.ticker];
      const currentPrice = latest ? latest.close : asset.buy_price || 0;
      return sum + (asset.quantity || 0) * currentPrice;
    },
    0,
  );

  const totalDividends = (selectedWallet?.assets || []).reduce((sum, asset) => {
    const latest = assetData[asset.ticker];
    return sum + (latest?.dividends || 0);
  }, 0);

  const walletRentability =
    totalInvested > 0
      ? ((totalMarketValue + totalDividends - totalInvested) / totalInvested) *
        100
      : 0;

  const calculateReceivedDividends = (walletAssets, historicalData) => {
    let totalDividends = 0;

    walletAssets.forEach((asset) => {
      const ticker = asset.ticker;
      const buyDate = new Date(asset.buy_date);
      const quantity = asset.quantity;

      const dividendsForTicker = historicalData.filter(
        (entry) =>
          entry.ticker === ticker &&
          entry.dividends > 0 &&
          entry.ex_dividend_date &&
          new Date(entry.ex_dividend_date) >= buyDate,
      );

      dividendsForTicker.forEach((entry) => {
        totalDividends += quantity * entry.dividends;
      });
    });

    return totalDividends;
  };

  const filteredAssets = Object.values(
    (selectedWallet?.assets || []).reduce((acc, asset) => {
      if (
        walletListFilter === "Tudo" ||
        (walletListFilter === "Ações" && asset.type === "acao") ||
        (walletListFilter === "FIIs" && asset.type === "fii") ||
        (walletListFilter === "BDRs" && asset.type === "bdr") ||
        (walletListFilter === "ETFs" && asset.type === "etf")
      ) {
        const key = asset.ticker;
        if (!acc[key]) {
          acc[key] = {
            ...asset,
            quantity: 0,
            totalInvested: 0,
          };
        }

        acc[key].quantity += asset.quantity;
        acc[key].totalInvested += asset.quantity * asset.buy_price;
      }
      return acc;
    }, {}),
  ).filter((asset) => asset.quantity > 0);

  const filteredTotalAssets = filteredAssets.length;

  const filteredMarketValue = filteredAssets.reduce((sum, asset) => {
    const currentPrice = assetData[asset.ticker]?.close || asset.buy_price;
    return sum + asset.quantity * currentPrice;
  }, 0);

  const filteredInvestedValue = filteredAssets.reduce(
    (sum, asset) => sum + asset.totalInvested,
    0,
  );

  const filteredRentability =
    filteredInvestedValue > 0
      ? ((filteredMarketValue - filteredInvestedValue) /
          filteredInvestedValue) *
        100
      : 0;

  const title = "Suas Carteiras";
  const subtitle =
    "Acompanhe seu portfolio ou simule carteiras para planejar seus investimentos.";

  return (
    <>
      <Navbar />
      <HeroSection title={title} subtitle={subtitle} />
      <div className="page-container">
        <div className="page-content">
          <AnimatedSection className="your-wallets-section wallets-section">
            {wallets.length > 0 && (
              <div className="your-wallets-title">
                <h2>
                  Suas<span className="blue"> Carteiras</span>
                </h2>
              </div>
            )}
            {wallets.length === 0 && (
              <div className="your-wallets-title">
                <h2>
                  Cadastre sua <span className="blue">Primeira Carteira</span>
                </h2>
              </div>
            )}
            <div className="your-wallets-content">
              {wallets.length > 0 &&
                wallets.map((wallet) => {
                  const totalValue = (wallet.assets || []).reduce(
                    (sum, asset) =>
                      sum + (asset.quantity || 0) * (asset.buy_price || 0),
                    0,
                  );

                  return (
                    <div
                      key={wallet.id}
                      className={`wallet-card ${
                        wallet.id === selectedWallet?.id
                          ? "wallet-card-active"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedWallet(wallet);
                        localStorage.setItem("selectedWalletId", wallet.id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="wallet-card-left">
                        <div className="wallet-icon-around">
                          <FaWallet size={20} />
                        </div>
                      </div>
                      <div className="wallet-card-right">
                        <h3>{wallet.name}</h3>
                        <span>
                          {totalValue.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              <div
                className="add-wallet-card"
                onClick={() => setShowWalletForm(true)}
              >
                <div className="add-wallet-icon-around">
                  <FaPlus size={15} />
                </div>
                <h3>Adicionar Carteira</h3>
              </div>
              {showWalletForm && (
                <Modal
                  open={showWalletForm}
                  onClose={() => setShowWalletForm(false)}
                  disableAutoFocus={true}
                >
                  <div className="modal-box">
                    <h3>Criar Nova Carteira</h3>
                    <FloatingInput
                      type="text"
                      label="Nome da Carteira"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      icon={FaWallet}
                    />
                    <button
                      className="primary-btn modal-btn"
                      onClick={handleCreateWallet}
                    >
                      Criar
                    </button>
                  </div>
                </Modal>
              )}
            </div>
            {wallets.length > 0 && (
              <div className="edit-wallets-btn">
                <button type="button" className="secondary-btn">
                  Editar Carteiras
                </button>
              </div>
            )}
          </AnimatedSection>

          {wallets.length > 0 && selectedWallet && (
            <>
              <AnimatedSection className="wallets-dividing-section">
                <div>Informações da Carteira</div>
              </AnimatedSection>

              <AnimatedSection className="wallets-wallet-name-section wallets-section">
                <h3>{selectedWallet.name}</h3>
                <div className="include-transaction-btn-div">
                  <button
                    type="button"
                    className="include-transaction-btn primary-btn"
                    onClick={() => setShowTransactionModal(true)}
                  >
                    Incluir Lançamento
                  </button>
                  <button
                    type="button"
                    className="include-transaction-btn secondary-btn"
                    onClick={() => setShowTransactionsModal(true)}
                  >
                    Ver Lançamentos
                  </button>
                  <button
                    type="button"
                    className="include-transaction-btn secondary-btn"
                    onClick={() => setShowDividendsModal(true)}
                  >
                    Ver Proventos
                  </button>
                </div>
              </AnimatedSection>
              <Modal
                open={showTransactionModal}
                onClose={() => setShowTransactionModal(false)}
                disableAutoFocus={true}
              >
                <Box className="modal-box">
                  <h3>Incluir Lançamento</h3>
                  <div className="modal-inputs">
                    <div className="transaction-type-buttons">
                      <button
                        type="button"
                        className={`type-btn ${transactionType === "buy" ? "active" : ""}`}
                        onClick={() => setTransactionType("buy")}
                      >
                        Compra
                      </button>
                      <button
                        type="button"
                        className={`type-btn ${transactionType === "sell" ? "active" : ""}`}
                        onClick={() => setTransactionType("sell")}
                      >
                        Venda
                      </button>
                    </div>

                    {/* Tipo de Ativo */}
                    <FormControl
                      fullWidth
                      className="transaction-asset-type-input"
                    >
                      <InputLabel id="asset-type-label">
                        Tipo de Ativo
                      </InputLabel>
                      <Select
                        labelId="asset-type-label"
                        value={assetType}
                        label="Tipo de Ativo"
                        onChange={(e) => setAssetType(e.target.value)}
                      >
                        <MenuItem value="acao">Ação</MenuItem>
                        <MenuItem value="fii">FII</MenuItem>
                        <MenuItem value="bdr">BDR</MenuItem>
                        <MenuItem value="etf">ETF</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Ticker */}
                    <Autocomplete
                      fullWidth
                      options={tickerOptions}
                      value={ticker}
                      onChange={(event, newValue) => setTicker(newValue || "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Ticker"
                          variant="outlined"
                        />
                      )}
                    />

                    {/* Preço */}
                    <TextField
                      fullWidth
                      type="number"
                      label="Preço por Unidade"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      variant="outlined"
                    />

                    {/* Quantidade e Data */}
                    <div
                      className="include-transaction-modal-middle"
                      style={{ display: "flex", gap: "1rem" }}
                    >
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantidade"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        variant="outlined"
                      />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="custom-date-input"
                        onFocus={(e) =>
                          e.target.showPicker && e.target.showPicker()
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="modal-btn primary-btn"
                    onClick={handleAddAsset}
                  >
                    Confirmar
                  </button>
                </Box>
              </Modal>
              <Modal
                open={showTransactionsModal}
                onClose={() => setShowTransactionsModal(false)}
                disableAutoFocus={true}
              >
                <Box className="modal-box">
                  <h3>Lançamentos da Carteira</h3>
                  <div className="transaction-list">
                    {(selectedWallet?.assets || []).map((asset, i) => (
                      <div key={i} className="transaction-item">
                        <p>
                          <strong>{asset.ticker}</strong>
                        </p>
                        <p>Tipo: {asset.quantity >= 0 ? "Compra" : "Venda"}</p>
                        <p>Quantidade: {Math.abs(asset.quantity)}</p>

                        <p>
                          Preço: R${" "}
                          {Number(asset.buy_price || 0).toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </p>
                        <p>
                          Data: {new Date(asset.buy_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </Box>
              </Modal>
              <Modal
                open={showDividendsModal}
                onClose={() => setShowDividendsModal(false)}
                disableAutoFocus={true}
              >
                <Box className="modal-box">
                  <h3>Proventos Recebidos</h3>
                  <p>
                    Total:{" "}
                    {receivedDividends.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </Box>
              </Modal>
              <AnimatedSection className="wallets-info-section wallets-section">
                <div className="wallet-total-value-card">
                  <span>Seu Patrimônio</span>
                  <div>
                    <h3>
                      {totalMarketValue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </h3>
                    <div
                      className={
                        "wallet-total-value-percentage " +
                        (walletRentability >= 0
                          ? "green-opacity"
                          : "red-opacity")
                      }
                    >
                      <span
                        className={walletRentability >= 0 ? "green" : "red"}
                      >
                        {walletRentability.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="wallet-value-invested-card">
                  <span>Valor Investido</span>
                  <h3>
                    {totalInvested.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </h3>
                </div>
                <div className="wallet-dividends-card">
                  <span>Proventos Recebidos</span>
                  <h3>
                    {receivedDividends.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </h3>
                </div>
                <div className="wallet-total-assets-card">
                  <span>Ativos na Carteira</span>
                  <h3>
                    {
                      new Set(
                        (selectedWallet.assets || []).map(
                          (asset) => asset.ticker,
                        ),
                      ).size
                    }
                  </h3>
                </div>
              </AnimatedSection>
              <AnimatedSection className="wallets-chart-section wallets-section">
                <div className="wallets-chart-title">
                  <h3>Performance da Carteira</h3>
                </div>
              </AnimatedSection>
              <AnimatedSection className="wallets-list-title-section wallets-section">
                <h3>Ativos</h3>
                <div className="wallets-list-filter-div">
                  <button
                    type="button"
                    className={`wallets-list-filter ${walletListFilter == "Tudo" ? "wallets-list-filter-active" : "secondary-btn"}`}
                    onClick={() => setWalletListFilter("Tudo")}
                  >
                    Tudo
                  </button>
                  <button
                    type="button"
                    className={`wallets-list-filter ${walletListFilter == "Ações" ? "wallets-list-filter-active" : "secondary-btn"}`}
                    onClick={() => setWalletListFilter("Ações")}
                  >
                    Ações
                  </button>
                  <button
                    type="button"
                    className={`wallets-list-filter ${walletListFilter == "FIIs" ? "wallets-list-filter-active" : "secondary-btn"}`}
                    onClick={() => setWalletListFilter("FIIs")}
                  >
                    FIIs
                  </button>
                  <button
                    type="button"
                    className={`wallets-list-filter ${walletListFilter == "BDRs" ? "wallets-list-filter-active" : "secondary-btn"}`}
                    onClick={() => setWalletListFilter("BDRs")}
                  >
                    BDRs
                  </button>
                  <button
                    type="button"
                    className={`wallets-list-filter ${walletListFilter == "ETFs" ? "wallets-list-filter-active" : "secondary-btn"}`}
                    onClick={() => setWalletListFilter("ETFs")}
                  >
                    ETFs
                  </button>
                </div>
              </AnimatedSection>
              <AnimatedSection
                className="wallets-list-section wallets-section"
                rootMargin="600px"
              >
                <div className="wallets-list-container">
                  <div className="wallets-list-info">
                    <div className="wallets-list-info-left">
                      <div className="wallets-list-info-left-top">
                        <h3>{walletListFilter}</h3>

                        <div
                          className={
                            filteredRentability >= 0
                              ? "green-opacity wallet-percentage"
                              : "red-opacity wallet-percentage"
                          }
                        >
                          <span
                            className={
                              filteredRentability >= 0 ? "green" : "red"
                            }
                          >
                            {filteredRentability.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="wallets-list-info-assets-num">
                        {filteredTotalAssets} ativos
                      </div>
                    </div>

                    <div className="wallets-list-info-right">
                      <h3>
                        {filteredMarketValue.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </h3>
                      <span
                        className={
                          filteredMarketValue - filteredInvestedValue >= 0
                            ? "green"
                            : "red"
                        }
                      >
                        {(filteredMarketValue - filteredInvestedValue >= 0
                          ? "+"
                          : "") +
                          (
                            filteredMarketValue - filteredInvestedValue
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                      </span>
                    </div>
                  </div>
                  <div className="wallets-list-header">
                    <div>
                      <span>Nome</span>
                    </div>
                    <div>
                      <span>Cotação Atual</span>
                    </div>
                    <div>
                      <span>Preço Médio</span>
                    </div>
                    <div>
                      <span>Quantidade</span>
                    </div>
                    <div>
                      <span>Rentabilidade (%)</span>
                    </div>
                    <div>
                      <span>Dividend Yield (%)</span>
                    </div>
                    <div>
                      <span>Valor Total</span>
                    </div>
                    <div>
                      <span>Ver Mais</span>
                    </div>
                  </div>
                  <div className="wallets-list-body">
                    {filteredAssets.map((asset, index) => {
                      const latest = assetData[asset.ticker];
                      const currentPrice = latest
                        ? latest.close
                        : asset.averagePrice || 0;
                      const assetMarketValue = asset.quantity * currentPrice;
                      const assetDividends = latest ? latest.dividends || 0 : 0;
                      const assetRentability =
                        asset.totalInvested > 0
                          ? ((assetMarketValue +
                              assetDividends -
                              asset.totalInvested) /
                              asset.totalInvested) *
                            100
                          : 0;
                      const dividendYield = latest
                        ? latest.dividend_yield || 0
                        : 0;
                      const isPositiveRentability = assetRentability >= 0;

                      return (
                        <div key={index} className="wallets-list-asset-card">
                          <div>
                            <span>{asset.ticker}</span>
                          </div>
                          <div>
                            <span>
                              {currentPrice.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                          </div>
                          <div>
                            <div>
                              <span>
                                {asset.quantity > 0
                                  ? (
                                      asset.totalInvested / asset.quantity
                                    ).toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    })
                                  : "—"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span>{asset.quantity}</span>
                          </div>
                          <div>
                            <span
                              className={
                                isPositiveRentability ? "green" : "red"
                              }
                            >
                              {assetRentability.toFixed(2)}%
                            </span>
                          </div>
                          <div>
                            <span>{dividendYield.toFixed(2)}%</span>
                          </div>
                          <div>
                            <span>
                              {assetMarketValue.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                          </div>
                          <div>
                            <button className="secondary-btn wallets-list-asset-btn">
                              Detalhes
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Wallets;
