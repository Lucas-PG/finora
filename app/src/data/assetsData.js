import { useEffect, useState } from "react";
import { fetchAssets } from "../api/assetsAPI";

const getHighlightAssets = (assets) => {
  const parseMarketCap = (str) => {
    if (!str) return 0;
    return (
      parseFloat(str.replace("R$", "").replace("B", "").replace(",", ".")) || 0
    );
  };

  const parseChange = (str) => {
    if (!str) return 0;
    return parseFloat(str.replace("%", "").replace(",", ".")) || 0;
  };

  const highlights = [];

  // 1. Ação, FII e BDR — top 5 por market cap → mais volátil
  const typesWithTop5 = ["stock", "fii", "bdr"];
  typesWithTop5.forEach((type) => {
    const filtered = assets.filter((a) => a.type === type);

    const top5 = filtered
      .sort((a, b) => parseMarketCap(b.marketCap) - parseMarketCap(a.marketCap))
      .slice(0, 5);

    if (top5.length === 0) return;

    const mostVolatile = top5.reduce((prev, curr) =>
      Math.abs(parseChange(curr.change)) > Math.abs(parseChange(prev.change))
        ? curr
        : prev,
    );

    highlights.push(mostVolatile);
  });

  // 2. ETF — mais volátil entre todos
  const etfs = assets.filter((a) => a.type === "etf");
  if (etfs.length > 0) {
    const mostVolatileETF = etfs.reduce((prev, curr) =>
      Math.abs(parseChange(curr.change)) > Math.abs(parseChange(prev.change))
        ? curr
        : prev,
    );
    highlights.push(mostVolatileETF);
  }

  return highlights;
};

export const useAssetsData = () => {
  const [assetsData, setAssetsData] = useState([]);
  const [highlightAssets, setHighlightAssets] = useState([]);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [assetList, setAssetList] = useState({});

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
          ticker: item.ticker.replace(".SA", ""),
          name: item.ticker.replace(".SA", ""),
          fullName: item.full_name,
          price: `R$${price}`,
          change: `${changeValue >= 0 ? "+" : ""}${changeValue.toFixed(2)}%`,
          marketCap: `R$${marketCapB.toFixed(2)}B`,
          chart: changeValue >= 0 ? "up" : "down",
          type: item.asset_type,
        };
      });

      const options = formatted.map((item) => ({
        title: item.name,
        link: `/ticker?ticker=${item.name}`,
        search: `${item.name} ${item.fullName}`,
      }));

      const byType = formatted.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item.name);
        return acc;
      }, {});

      setAssetsData(formatted);
      setHighlightAssets(getHighlightAssets(formatted));
      setAutocompleteOptions(options);
      setAssetList(byType);
    };

    loadData();
  }, []);

  return { assetsData, highlightAssets, autocompleteOptions, assetList };
};
