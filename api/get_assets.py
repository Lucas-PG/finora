import yfinance as yf
import pandas as pd
import mysql.connector
import time
from datetime import datetime, timedelta

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
    "B3SA3.SA",
    "ELET3.SA",
    "ELET6.SA",
    "ENBR3.SA",
    "GOLL4.SA",
    "HAPV3.SA",
    "KLBN11.SA",
    "MRFG3.SA",
    "MRVE3.SA",
    "NTCO3.SA",
    "RADL3.SA",
    "SBSP3.SA",
    "TIMS3.SA",
    "UGPA3.SA",
    "USIM5.SA",
    "VVAR3.SA",
    "YDUQ3.SA",
    "AZUL4.SA",
    "CVCB3.SA",
    "ECOR3.SA",
    "ENEV3.SA",
    "EQTL3.SA",
    "FLRY3.SA",
    "HYPE3.SA",
    "QUAL3.SA",
    "SANB11.SA",
    "TAEE11.SA",
    "TOTS3.SA",
    "VBBR3.SA",
    "VIIA3.SA",
    "FIIB11.SA",
    "HFOF11.SA",
    "HGCR11.SA",
    "HGLG11.SA",
    "KNHY11.SA",
    "MXRF11.SA",
    "RZTR11.SA",
    "VISC11.SA",
    "XPLG11.SA",
    "XPML11.SA",
    "IMAB11.SA",
    "SPXI11.SA",
    "DIVO11.SA",
    "XBOV11.SA",
    "BRAX11.SA",
    "AMZN34.SA",
    "META34.SA",
    "NFLX34.SA",
    "PYPL34.SA",
    "SQIA34.SA",
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
    "B3SA3",
    "ELET3",
    "ELET6",
    "ENBR3",
    "GOLL4",
    "HAPV3",
    "KLBN11",
    "MRFG3",
    "MRVE3",
    "NTCO3",
    "RADL3",
    "SBSP3",
    "TIMS3",
    "UGPA3",
    "USIM5",
    "VVAR3",
    "YDUQ3",
    "AZUL4",
    "CVCB3",
    "ECOR3",
    "ENEV3",
    "EQTL3",
    "FLRY3",
    "HYPE3",
    "QUAL3",
    "SANB11",
    "TAEE11",
    "TOTS3",
    "VBBR3",
    "VIIA3",
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
    "FIIB11",
    "HGCR11",
    "KNHY11",
    "RZTR11",
    "VISC11",
}

etfs = {
    "IVVB11",
    "HASH11",
    "BOVA11",
    "SMAL11",
    "XINA11",
    "GOLD11",
    "IMAB11",
    "SPXI11",
    "DIVO11",
    "XBOV11",
    "BRAX11",
}

bdrs = {
    "AAPL34",
    "MSFT34",
    "GOGL34",
    "AMZO34",
    "TSLA34",
    "NVDC34",
    "AMZN34",
    "META34",
    "NFLX34",
    "PYPL34",
    "SQIA34",
}


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
    host="localhost", user="root", password="password", database="projeto_react"
)
cursor = conn.cursor()

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS fundamentals_data (
        ticker VARCHAR(10) PRIMARY KEY,
        trailing_pe DOUBLE,
        forward_pe DOUBLE,
        price_to_book DOUBLE,
        book_value DOUBLE,
        lpa DOUBLE,
        trailing_eps DOUBLE,
        roe DOUBLE,
        roa DOUBLE,
        beta DOUBLE,
        peg_ratio DOUBLE,
        ebitda_margin DOUBLE,
        gross_margin DOUBLE,
        operating_margin DOUBLE,
        profit_margin DOUBLE
    )
    """
)

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
        ex_dividend_date DATE DEFAULT NULL,
        PRIMARY KEY (ticker, date)
    )
    """
)

for i, ticker in enumerate(tickers, 1):
    try:
        print(f"Processando {ticker} ({i}/{len(tickers)})")
        stock = yf.Ticker(ticker)
        data = stock.history(period="2y")

        if data.empty:
            print(f"Sem dados para {ticker}")
            continue

        info = stock.info

        fundamentals = {
            "trailing_pe": info.get("trailingPE"),
            "forward_pe": info.get("forwardPE"),
            "price_to_book": info.get("priceToBook"),
            "book_value": info.get("bookValue"),
            "lpa": info.get("earningsPerShare"),
            "trailing_eps": info.get("trailingEps"),
            "roe": info.get("returnOnEquity"),
            "roa": info.get("returnOnAssets"),
            "beta": info.get("beta"),
            "peg_ratio": info.get("pegRatio"),
            "ebitda_margin": info.get("ebitdaMargins"),
            "gross_margin": info.get("grossMargins"),
            "operating_margin": info.get("operatingMargins"),
            "profit_margin": info.get("profitMargins"),
        }

        cursor.execute(
            """
            INSERT INTO fundamentals_data (
                ticker, trailing_pe, forward_pe, price_to_book, book_value, lpa,
                trailing_eps, roe, roa, beta, peg_ratio,
                ebitda_margin, gross_margin, operating_margin, profit_margin
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                trailing_pe=VALUES(trailing_pe),
                forward_pe=VALUES(forward_pe),
                price_to_book=VALUES(price_to_book),
                book_value=VALUES(book_value),
                lpa=VALUES(lpa),
                trailing_eps=VALUES(trailing_eps),
                roe=VALUES(roe),
                roa=VALUES(roa),
                beta=VALUES(beta),
                peg_ratio=VALUES(peg_ratio),
                ebitda_margin=VALUES(ebitda_margin),
                gross_margin=VALUES(gross_margin),
                operating_margin=VALUES(operating_margin),
                profit_margin=VALUES(profit_margin)
        """,
            (
                ticker.replace(".SA", ""),
                fundamentals["trailing_pe"],
                fundamentals["forward_pe"],
                fundamentals["price_to_book"],
                fundamentals["book_value"],
                fundamentals["lpa"],
                fundamentals["trailing_eps"],
                fundamentals["roe"],
                fundamentals["roa"],
                fundamentals["beta"],
                fundamentals["peg_ratio"],
                fundamentals["ebitda_margin"],
                fundamentals["gross_margin"],
                fundamentals["operating_margin"],
                fundamentals["profit_margin"],
            ),
        )
        conn.commit()
        asset_type = classify_asset_type(ticker)

        # Calculate market cap
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

        full_name = info.get("longName", "Desconhecido")

        # Fetch 2 days of data for 24h variation
        data_2d = stock.history(period="2d", interval="1d")
        variation_24h = None
        if len(data_2d) >= 2:
            close_today = data_2d["Close"].iloc[-1]
            close_yesterday = data_2d["Close"].iloc[-2]
            if close_yesterday != 0:  # Avoid division by zero
                variation_24h = (
                    (close_today - close_yesterday) / close_yesterday
                ) * 100

        dividends = stock.dividends
        dividend_dates = dividends.index.strftime("%Y-%m-%d").tolist()

        # Calculate dividend yield for each date based on cumulative dividends
        data = data[["Close", "Volume", "Dividends"]].reset_index()
        data["ticker"] = ticker.replace(".SA", "")
        data["market_cap"] = market_cap
        data["full_name"] = full_name
        data["asset_type"] = asset_type
        data["dividend_yield"] = 0.0
        data["variation_24h"] = None
        data["ex_dividend_date"] = pd.NaT

        # Calculate dividend yield for each row
        cumulative_dividends = 0.0
        for index, row in data.iterrows():
            current_date = row["Date"].strftime("%Y-%m-%d")

            # Acumula dividendos pagos
            cumulative_dividends += row["Dividends"]

            # Calcula dividend_yield com base nos dividendos acumulados
            if row["Close"] != 0:
                data.at[index, "dividend_yield"] = (
                    cumulative_dividends / row["Close"]
                ) * 100

            # Marca a data ex-dividendo (se a data atual for uma data de pagamento)
            if row["Dividends"] > 0 and current_date in dividend_dates:
                data.at[index, "ex_dividend_date"] = pd.to_datetime(current_date)

            # Adiciona variação de 24h somente na última linha
            if index == len(data) - 1 and variation_24h is not None:
                data.at[index, "variation_24h"] = variation_24h

        numeric_columns = [
            "Close",
            "Volume",
            "Dividends",
            "market_cap",
            "dividend_yield",
            "variation_24h",
        ]
        data[numeric_columns] = data[numeric_columns].fillna(0)

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
                row["ex_dividend_date"] if pd.notna(row["ex_dividend_date"]) else None,
            )
            for _, row in data.iterrows()
        ]

        cursor.executemany(
            """
            INSERT INTO historical_data
            (ticker, date, close, volume, dividends, market_cap, dividend_yield, variation_24h, full_name, asset_type, ex_dividend_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                close=VALUES(close),
                volume=VALUES(volume),
                dividends=VALUES(dividends),
                market_cap=VALUES(market_cap),
                dividend_yield=VALUES(dividend_yield),
                variation_24h=VALUES(variation_24h),
                full_name=VALUES(full_name),
                asset_type=VALUES(asset_type),
                ex_dividend_date=VALUES(ex_dividend_date)
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
