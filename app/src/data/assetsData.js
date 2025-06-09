import { useEffect, useState } from "react";
import { fetchAssets } from "../api/assetsAPI";

const getHighlightAssets = (assets) => {
  const groupedByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) acc[asset.type] = [];
    acc[asset.type].push(asset);
    return acc;
  }, {});

  const sortedByType = Object.keys(groupedByType).reduce((acc, type) => {
    acc[type] = groupedByType[type].sort((a, b) => {
      const marketCapA = parseFloat(
        a.marketCap.replace("R$", "").replace("B", "").replace(",", "."),
      );
      const marketCapB = parseFloat(
        b.marketCap.replace("R$", "").replace("B", "").replace(",", "."),
      );
      return marketCapB - marketCapA;
    });
    return acc;
  }, {});

  const highlightTypes = ["stock", "fii", "etf", "bdr", "crypto"];
  return highlightTypes
    .map((type) => sortedByType[type]?.[0])
    .filter(Boolean)
    .slice(0, 5);
};

export const useAssetsData = () => {
  const [assetsData, setAssetsData] = useState([]);
  const [highlightAssets, setHighlightAssets] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAssets();

      const latestPerTicker = Object.values(
        data.reduce((acc, item) => {
          const key = item.ticker;
          const itemDate = new Date(item.date);
          const current = acc[key];

          if (!current || itemDate > new Date(current.date)) {
            acc[key] = item;
          }

          return acc;
        }, {}),
      );

      const formatted = latestPerTicker.map((item) => {
        const price = item.close.toFixed(2).replace(".", ",");
        const changeValue = parseFloat(item.variation_24h ?? 0);
        const marketCapB = item.market_cap ? item.market_cap / 1e9 : 0;

        return {
          name: item.ticker.replace(".SA", ""),
          fullName: item.full_name,
          price: `R$${price}`,
          change: `${changeValue >= 0 ? "+" : ""}${changeValue.toFixed(2)}%`,
          marketCap: `R$${marketCapB.toFixed(2)}B`,
          chart: changeValue >= 0 ? "up" : "down",
          type: item.asset_type,
        };
      });

      setAssetsData(formatted);
      setHighlightAssets(getHighlightAssets(formatted));
    };

    loadData();
  }, []);

  return { assetsData, highlightAssets };
};

export const assetList = {
  acao: [
    "PETR4",
    "VALE3",
    "ITUB4",
    "WEGE3",
    "MGLU3",
    "BBAS3",
    "BBDC4",
    "ABEV3",
    "JBSS3",
    "RENT3",
    "LREN3",
    "GGBR4",
    "CSNA3",
    "EMBR3",
    "BRFS3",
    "SUZB3",
    "EGIE3",
    "CPFE3",
    "CMIG4",
    "VIVT3",
    "PRIO3",
    "RAIL3",
  ],
  fii: [
    "HGLG11",
    "XPML11",
    "KNRI11",
    "BCFF11",
    "VILG11",
    "MXRF11",
    "HGRU11",
    "KNCR11",
    "BRCR11",
    "JSRE11",
    "HGBS11",
    "MCCI11",
    "RBRR11",
    "CPTS11",
    "HFOF11",
    "IRDM11",
    "RBVA11",
    "XPLG11",
  ],
  bdr: ["AAPL34", "MSFT34", "GOGL34", "AMZO34", "TSLA34", "NVDC34"],
  etf: ["IVVB11", "HASH11", "BOVA11", "SMAL11", "XINA11", "GOLD11"],
};
