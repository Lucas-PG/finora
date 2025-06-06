import yfinance as yf
import pandas as pd
import mysql.connector
import time
from datetime import datetime

tickers = [
    "PETR4.SA",
    "VALE3.SA",
    "ITUB4.SA",
    "WEGE3.SA",
    "MGLU3.SA",
    "BBAS3.SA",
    "BBDC4.SA",
    "ABEV3.SA",
    "JBSS3.SA",
    "RENT3.SA",
    "LREN3.SA",
    "GGBR4.SA",
    "CSNA3.SA",
    "EMBR3.SA",
    "BRFS3.SA",
    "SUZB3.SA",
    "EGIE3.SA",
    "CPFE3.SA",
    "CMIG4.SA",
    "VIVT3.SA",
    "PRIO3.SA",
    "RAIL3.SA",
    "HGLG11.SA",
    "XPML11.SA",
    "KNRI11.SA",
    "BCFF11.SA",
    "VILG11.SA",
    "MXRF11.SA",
    "HGRU11.SA",
    "KNCR11.SA",
    "BRCR11.SA",
    "JSRE11.SA",
    "HGBS11.SA",
    "MCCI11.SA",
    "RBRR11.SA",
    "CPTS11.SA",
    "HFOF11.SA",
    "IRDM11.SA",
    "RBVA11.SA",
    "XPLG11.SA",
    "IVVB11.SA",
    "HASH11.SA",
    "BOVA11.SA",
    "SMAL11.SA",
    "XINA11.SA",
    "GOLD11.SA",
    "AAPL34.SA",
    "MSFT34.SA",
    "GOGL34.SA",
    "AMZO34.SA",
    "TSLA34.SA",
    "NVDC34.SA",
]

acoes = {
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
}
fiis = {
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
}
etfs = {"IVVB11", "HASH11", "BOVA11", "SMAL11", "XINA11", "GOLD11"}
bdrs = {"AAPL34", "MSFT34", "GOGL34", "AMZO34", "TSLA34", "NVDC34"}


def classify_asset_type(ticker):
    ticker = ticker.replace(".SA", "")
    if ticker in acoes:
        return "stock"
    elif ticker in fiis:
        return "fii"
    elif ticker in etfs:
        return "etf"
    elif ticker in bdrs:
        return "bdr"
    return "desconhecido"


conn = mysql.connector.connect(
    host="localhost", user="user", password="password", database="projeto_react"
)
cursor = conn.cursor()

cursor.execute(
    """
CREATE TABLE IF NOT EXISTS historical_data (
    ticker VARCHAR(10),
    date DATETIME,
    close DOUBLE,
    volume BIGINT,
    dividends DOUBLE,
    market_cap DOUBLE,
    dividend_yield DOUBLE,
    variation_24h DOUBLE,
    full_name TEXT,
    asset_type VARCHAR(10),
    PRIMARY KEY (ticker, date)
)
"""
)

for i, ticker in enumerate(tickers, 1):
    try:
        print(f"Processando {ticker} ({i}/{len(tickers)})")
        stock = yf.Ticker(ticker)
        data = stock.history(period="1y")

        if data.empty:
            print(f"Sem dados para {ticker}")
            continue

        info = stock.info
        asset_type = classify_asset_type(ticker)

        market_cap = None
        if asset_type == "etf":
            market_cap = info.get("totalAssets")
            if (
                not market_cap
                and info.get("navPrice")
                and info.get("sharesOutstanding")
            ):
                market_cap = info["navPrice"] * info["sharesOutstanding"]
        else:
            market_cap = info.get("marketCap")
            if not market_cap:
                shares = info.get("sharesOutstanding")
                close = info.get("previousClose")
                if shares and close:
                    market_cap = shares * close

        if market_cap is None:
            print(f"Aviso: marketCap não disponível para {ticker}. Atribuindo 0.")
            market_cap = 0

        dividend_yield = info.get("dividendYield", 0)
        full_name = info.get("longName", "Desconhecido")

        data_2d = stock.history(period="2d", interval="1d")
        variation_24h = None
        if len(data_2d) >= 2:
            close_today = data_2d["Close"].iloc[-1]
            close_yesterday = data_2d["Close"].iloc[-2]
            variation_24h = ((close_today - close_yesterday) / close_yesterday) * 100

        data = data[["Close", "Volume", "Dividends"]].reset_index()
        data["ticker"] = ticker.replace(".SA", "")
        data["market_cap"] = market_cap
        data["dividend_yield"] = dividend_yield
        data["variation_24h"] = None
        data["full_name"] = full_name
        data["asset_type"] = asset_type

        if variation_24h is not None:
            data.loc[data.index[-1], "variation_24h"] = variation_24h

        data = data.fillna(0)

        data_tuples = [
            (
                row["ticker"],
                row["Date"],
                row["Close"],
                int(row["Volume"]),
                row["Dividends"],
                row["market_cap"],
                row["dividend_yield"],
                row["variation_24h"],
                row["full_name"],
                row["asset_type"],
            )
            for _, row in data.iterrows()
        ]

        cursor.executemany(
            """
            INSERT INTO historical_data
            (ticker, date, close, volume, dividends, market_cap, dividend_yield, variation_24h, full_name, asset_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                close=VALUES(close),
                volume=VALUES(volume),
                dividends=VALUES(dividends),
                market_cap=VALUES(market_cap),
                dividend_yield=VALUES(dividend_yield),
                variation_24h=VALUES(variation_24h),
                full_name=VALUES(full_name),
                asset_type=VALUES(asset_type)
        """,
            data_tuples,
        )

        conn.commit()
        print(f"Dados salvos para {ticker}")
        time.sleep(1)

    except Exception as e:
        print(f"Erro com {ticker}: {e}")
        time.sleep(1)

cursor.close()
conn.close()
print("\nProcesso concluído!")
