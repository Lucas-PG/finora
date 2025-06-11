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
        link: `/ticker/${item.name}`,
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
