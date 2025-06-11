import Navbar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { AnimatedSection } from "../components/ui/AnimatedSection.jsx";
import { FaWallet } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { LuX, LuPencil, LuTrash2, LuCheck } from "react-icons/lu";
import { AuthContext } from "../context/AuthContext.jsx";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAssetsData } from "../data/assetsData.js";
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
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "../css/Wallets.css";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
);

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
  const [showEditTransactionModal, setShowEditTransactionModal] =
    useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [confirmDeleteWalletOpen, setConfirmDeleteWalletOpen] = useState(false);
  const [confirmDeleteTransactionOpen, setConfirmDeleteTransactionOpen] =
    useState(false);
  const [historicalTickerData, setHistoricalTickerData] = useState([]);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [walletToDelete, setWalletToDelete] = useState(null);
  const [showEditWalletsModal, setShowEditWalletsModal] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [editedWalletName, setEditedWalletName] = useState("");
  const { assetsData, highlightAssets, autocompleteOptions, assetList } =
    useAssetsData();

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
    if (!newWalletName.trim()) {
      showSnackbar("O nome da carteira é obrigatório.", "error");
      return;
    }

    const alreadyExists = wallets.some(
      (wallet) =>
        wallet.name.toLowerCase() === newWalletName.trim().toLowerCase(),
    );

    if (alreadyExists) {
      showSnackbar("Já existe uma carteira com esse nome.", "error");
      return;
    }

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

  const handleUpdateWalletName = async (walletId) => {
    if (!editedWalletName.trim()) {
      showSnackbar("O nome da carteira não pode ser vazio.", "error");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3001/wallets/${walletId}`,
        { walletName: editedWalletName },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      showSnackbar("Nome da carteira atualizado!", "success");
      setEditingWalletId(null);
      fetchWallets();
    } catch (err) {
      console.error("Erro ao atualizar nome da carteira:", err);
      showSnackbar("Erro ao atualizar nome da carteira.", "error");
    }
  };

  const handleClickDeleteWallet = (wallet) => {
    setWalletToDelete(wallet);
    setConfirmDeleteWalletOpen(true);
  };

  const confirmDeleteWallet = async () => {
    try {
      await axios.delete(`http://localhost:3001/wallets/${walletToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar("Carteira deletada com sucesso!", "success");
      fetchWallets();
    } catch (err) {
      showSnackbar("Erro ao deletar carteira.", "error");
    } finally {
      setConfirmDeleteWalletOpen(false);
      setWalletToDelete(null);
    }
  };

  const handleEditAsset = (asset) => {
    setTicker(asset.ticker);
    setPrice(asset.buy_price);
    setAmount(Math.abs(asset.quantity));
    setDate(asset.buy_date);
    setAssetType(asset.type);
    setTransactionType(asset.quantity >= 0 ? "buy" : "sell");
    setEditingAssetId(asset.id);
    setShowTransactionModal(true);
  };

  const handleUpdateTransaction = async (transactionId) => {
    const parsedPrice = parseFloat(price);
    const parsedAmount = parseFloat(amount);

    if (
      !ticker ||
      isNaN(parsedPrice) ||
      isNaN(parsedAmount) ||
      !date ||
      !assetType
    ) {
      setSnackbarMessage("Por favor, preencha todos os campos obrigatórios.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:3001/wallets/${selectedWallet.id}/assets/${transactionId}`,
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

      const updatedWallets = await fetchWallets();
      await fetchAssetData();

      const updatedWallet = updatedWallets.find(
        (w) => w.id === selectedWallet.id,
      );
      setSelectedWallet(updatedWallet);

      setShowEditTransactionModal(false);
      setTicker("");
      setPrice("");
      setAmount("");
      setDate("");
      setAssetType("acao");
      setEditTransaction(null);

      setSnackbarMessage("Lançamento atualizado com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Erro ao atualizar lançamento:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setSnackbarMessage(
        `Erro ao atualizar lançamento: ${
          err.response?.data?.error || err.message || "Tente novamente"
        }`,
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteTransaction = (transactionId) => {
    setTransactionToDelete(transactionId);
    setConfirmDeleteTransactionOpen(true);
  };

  const confirmDeleteTransaction = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/wallets/${selectedWallet.id}/assets/${transactionToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedWallets = await fetchWallets();
      await fetchAssetData();

      const updatedWallet = updatedWallets.find(
        (w) => w.id === selectedWallet.id,
      );
      setSelectedWallet(updatedWallet);

      showSnackbar("Lançamento deletado com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao deletar lançamento:", err);
      showSnackbar(
        `Erro ao deletar lançamento: ${
          err.response?.data?.error || err.message || "Tente novamente"
        }`,
        "error",
      );
    } finally {
      setConfirmDeleteTransactionOpen(false);
      setTransactionToDelete(null);
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
      showSnackbar(
        "Por favor, preencha todos os campos obrigatórios.",
        "error",
      );
      return;
    }

    const payload = {
      walletId: selectedWallet.id,
      ticker: ticker.toUpperCase(),
      quantity: transactionType === "buy" ? parsedAmount : -parsedAmount,
      buy_price: parsedPrice,
      buy_date: new Date(date).toISOString().split("T")[0],
      type: assetType,
    };

    try {
      if (editingAssetId) {
        await axios.put(
          `http://localhost:3001/wallets/${selectedWallet.id}/assets/${editingAssetId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        showSnackbar("Transação editada com sucesso!", "success");
      } else {
        await axios.post(
          `http://localhost:3001/wallets/${selectedWallet.id}/assets`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        showSnackbar("Transação adicionada com sucesso!", "success");
      }

      const updatedWallets = await fetchWallets();
      const updatedWallet = updatedWallets.find(
        (w) => w.id === selectedWallet.id,
      );
      setSelectedWallet(updatedWallet);
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      if (err.response?.data?.error?.includes("Venda excede")) {
        showSnackbar(
          "Você não possui ações suficientes para essa venda",
          "error",
        );
      } else {
        showSnackbar("Erro ao salvar transação. Tente novamente.", "error");
      }
    } finally {
      setShowTransactionModal(false);
      setEditingAssetId(null);
      setTicker("");
      setPrice("");
      setAmount("");
      setDate("");
      setAssetType("acao");
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

  const calculateReceivedDividends = (walletAssets, historicalEntries) => {
    let totalDividends = 0;

    walletAssets.forEach((asset) => {
      const ticker = asset.ticker;
      const buyDate = new Date(asset.buy_date);
      const quantity = asset.quantity;

      const dividendsForTicker = historicalEntries.filter(
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

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (selectedWallet) {
      fetchWalletHistorical(selectedWallet.id); // só chama a função, ela já faz o set
    }
  }, [selectedWallet]);

  const fetchWalletHistorical = async (walletId) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/wallets/${walletId}/historical`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setHistoricalTickerData(res.data);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      setHistoricalTickerData([]);
    }
  };

  const buildWalletChartData = (wallet, historicalTickerData) => {
    const firstBuyDate = new Date(
      Math.min(...wallet.assets.map((a) => new Date(a.buy_date))),
    );

    if (
      !wallet ||
      !wallet.assets ||
      !Array.isArray(historicalTickerData) ||
      historicalTickerData.length === 0
    ) {
      return {
        labels: [],
        datasets: [],
      };
    }
    const portfolio = {};
    const launchesByTicker = {};

    wallet.assets.forEach((asset) => {
      if (!launchesByTicker[asset.ticker]) launchesByTicker[asset.ticker] = [];
      launchesByTicker[asset.ticker].push(asset);
    });

    historicalTickerData.forEach(({ date, ticker, close }) => {
      const currentDate = new Date(date);

      if (currentDate < firstBuyDate) return;

      if (!portfolio[date]) portfolio[date] = 0;

      const relevantAssets = (launchesByTicker[ticker] || []).filter(
        (a) => new Date(a.buy_date) <= currentDate,
      );

      relevantAssets.forEach((a) => {
        portfolio[date] += a.quantity * close;
      });
    });

    const sortedDates = Object.keys(portfolio).sort();

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Evolução do Patrimônio",
          data: sortedDates.map((d) => portfolio[d]),
          // borderColor: "#0066ff",
          // backgroundColor: "rgba(0, 102, 255, 0.2)",
          // borderColor: "#4CAF50",
          // backgroundColor: "rgba(76, 175, 80, 0.2)",
          borderColor: "#7a00ff",
          backgroundColor: "rgba(122, 0, 255, 0.15)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };
  };

  const chartData = selectedWallet
    ? buildWalletChartData(selectedWallet, historicalTickerData)
    : { labels: [], datasets: [] };

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
                          {(totalMarketValue >= 0
                            ? totalMarketValue
                            : 0
                          ).toLocaleString("pt-BR", {
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
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowEditWalletsModal(true)}
                >
                  Editar Carteiras
                </button>
              </div>
            )}
          </AnimatedSection>
          <Modal
            open={showEditWalletsModal}
            onClose={() => setShowEditWalletsModal(false)}
            disableAutoFocus={true}
            className="wallets-edit-modal"
          >
            <Box className="modal-box wallets-edit-box">
              <div className="wallets-edit-list-title">
                <h3>Editar Carteiras</h3>
              </div>
              <div className="wallets-edit-list-container">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="wallets-edit-list-card">
                    <div>
                      {editingWalletId === wallet.id ? (
                        <FloatingInput
                          type="text"
                          label={wallet.name}
                          value={editedWalletName}
                          onChange={(e) => setEditedWalletName(e.target.value)}
                        />
                      ) : (
                        <span>{wallet.name}</span>
                      )}
                    </div>
                    <div className="wallets-edit-list-btns">
                      {editingWalletId === wallet.id ? (
                        <>
                          <button
                            className="wallets-edit-list-delete-btn"
                            onClick={() => handleUpdateWalletName(wallet.id)}
                          >
                            <LuCheck size={20} />
                          </button>
                          <button
                            className="wallets-edit-list-delete-btn red"
                            onClick={() => setEditingWalletId(null)}
                          >
                            <LuX size={20} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="wallets-edit-list-delete-btn"
                            onClick={() => {
                              setEditingWalletId(wallet.id);
                              setEditedWalletName("");
                            }}
                          >
                            <LuPencil size={20} />
                          </button>
                          <button
                            className="wallets-edit-list-delete-btn red"
                            onClick={() => handleClickDeleteWallet(wallet)}
                          >
                            <LuTrash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          </Modal>

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
                  {/* <button */}
                  {/*   type="button" */}
                  {/*   className="include-transaction-btn secondary-btn" */}
                  {/*   onClick={() => setShowDividendsModal(true)} */}
                  {/* > */}
                  {/*   Ver Proventos */}
                  {/* </button> */}
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
                className="transaction-list-modal"
              >
                <Box className="modal-box transaction-list-box">
                  <div className="transaction-list-title">
                    <h3>Lançamentos da Carteira</h3>
                  </div>
                  <div className="transaction-list-container">
                    <div className="wallets-list-header">
                      <div>
                        <span>Ticker</span>
                      </div>
                      <div>
                        <span>Tipo</span>
                      </div>
                      <div>
                        <span>Quantidade</span>
                      </div>
                      <div>
                        <span>Preço</span>
                      </div>
                      <div>
                        <span>Data</span>
                      </div>
                      <div>
                        <span>Ações</span>
                      </div>
                    </div>
                    <div className="wallets-list-body">
                      {(selectedWallet?.assets || []).map((asset, i) => (
                        <div key={i} className="wallets-list-asset-card">
                          <div>
                            <span>{asset.ticker}</span>
                          </div>
                          <div>
                            <span>
                              {asset.quantity >= 0 ? "Compra" : "Venda"}
                            </span>
                          </div>
                          <div>
                            <span>{Math.abs(asset.quantity)}</span>
                          </div>
                          <div>
                            <span>
                              {Number(asset.buy_price || 0).toLocaleString(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                },
                              )}
                            </span>
                          </div>
                          <div>
                            <span>
                              {new Date(asset.buy_date).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                          <div className="assets-edit-list-btns">
                            <button
                              className="wallets-edit-list-delete-btn"
                              onClick={() => handleEditAsset(asset)}
                            >
                              <LuPencil size={20} />
                            </button>
                            <button
                              className="wallets-edit-list-delete-btn red"
                              style={{ marginLeft: "10px", color: "red" }}
                              onClick={() => handleDeleteTransaction(asset.id)}
                            >
                              <LuTrash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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
                      {(totalMarketValue >= 0
                        ? totalMarketValue
                        : 0
                      ).toLocaleString("pt-BR", {
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
                    {(totalInvested >= 0 ? totalInvested : 0).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      },
                    )}
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
                  <h3>{filteredTotalAssets}</h3>
                </div>
              </AnimatedSection>
              <AnimatedSection className="wallets-chart-section wallets-section">
                <div className="wallets-chart-title">
                  <h3>Performance da Carteira</h3>
                </div>
                <div className="wallet-chart-container">
                  {selectedWallet &&
                  Array.isArray(historicalTickerData) &&
                  historicalTickerData.length > 0 ? (
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                          mode: "index",
                          intersect: false,
                        },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              title: (tooltipItems) => {
                                const date = new Date(tooltipItems[0].label);
                                return date.toLocaleDateString("pt-BR");
                              },
                              label: (tooltipItem) => {
                                const value = Number(
                                  tooltipItem.raw,
                                ).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                  minimumFractionDigits: 2,
                                });
                                return `Patrimônio: ${value}`;
                              },
                            },
                          },
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              display: false,
                            },
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <p style={{ textAlign: "center" }}>
                      Nenhum dado suficiente para mostrar o gráfico.
                    </p>
                  )}
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
                            <Link
                              className="secondary-btn wallets-list-asset-btn"
                              to={`/ticker?ticker=${asset.ticker}`}
                            >
                              Detalhes
                            </Link>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ConfirmDialog
        open={confirmDeleteTransactionOpen}
        onClose={() => setConfirmDeleteTransactionOpen(false)}
        onConfirm={confirmDeleteTransaction}
        title="Deletar lançamento"
        message="Tem certeza que deseja deletar este lançamento? Essa ação não pode ser desfeita."
      />
      <ConfirmDialog
        open={confirmDeleteWalletOpen}
        onClose={() => setConfirmDeleteWalletOpen(false)}
        onConfirm={confirmDeleteWallet}
        title="Deletar Carteira"
        message={`Tem certeza que deseja deletar a carteira "${walletToDelete?.name}"?`}
      />
    </>
  );
}

export default Wallets;
