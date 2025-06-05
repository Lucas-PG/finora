import yfinance as yf
import pandas as pd
import os
import time
from datetime import datetime

# Lista dos 52 ativos (ações, FIIs, ETFs, BDRs)
tickers = [
    # Ações (22)
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
    # FIIs (18)
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
    # ETFs (6)
    "IVVB11.SA",
    "HASH11.SA",
    "BOVA11.SA",
    "SMAL11.SA",
    "XINA11.SA",
    "GOLD11.SA",
    # BDRs (6)
    "AAPL34.SA",
    "MSFT34.SA",
    "GOGL34.SA",
    "AMZO34.SA",
    "TSLA34.SA",
    "NVDC34.SA",
]

# Total de ativos
total_tickers = len(tickers)

# Criar diretórios
os.makedirs("historical_data", exist_ok=True)
os.makedirs("daily_data", exist_ok=True)

# Parte 1: Baixar dados históricos e salvar em historical_data
print("Baixando dados históricos com yfinance...")
processed_count = 0
historical_failed = []

for i, ticker in enumerate(tickers, 1):
    try:
        print(f"Processando ativo {i}: {ticker}...")
        stock = yf.Ticker(ticker)
        # Dados de 1 ano, incluindo o dia atual (05/06/2025)
        data = stock.history(period="1y")

        if data.empty:
            print(f"Sem dados históricos para {ticker}.")
            historical_failed.append(ticker)
        else:
            # Selecionar apenas colunas Date, Close, Volume, Dividends
            data = data[["Close", "Volume", "Dividends"]].reset_index()
            data["Date"] = data["Date"].dt.strftime("%Y-%m-%d %H:%M:%S%z")
            filename = os.path.join("historical_data", f"{ticker}_historical.csv")
            data.to_csv(filename, sep=";", index=False, encoding="utf-8-sig")
            print(
                f"Dados históricos de {ticker} salvos em '{filename}' com {len(data)} linhas."
            )

        processed_count += 1
        print(
            f"Ativo {i}: {ticker} processado. Total: {processed_count}/{total_tickers}\n"
        )

        time.sleep(1)

    except Exception as e:
        print(f"Erro ao processar {ticker}: {e}")
        historical_failed.append(ticker)
        processed_count += 1
        print(
            f"Ativo {i}: {ticker} processado (com erro). Total: {processed_count}/{total_tickers}\n"
        )
        time.sleep(1)

# Parte 2: Obter dados atuais e salvar em daily_data
print("\nObtendo dados atuais com yfinance...")
processed_count = 0
daily_failed = []

for i, ticker in enumerate(tickers, 1):
    try:
        print(f"Processando ativo {i}: {ticker}...")
        stock = yf.Ticker(ticker)

        # Inicializar valores padrão
        market_cap = None
        variation_24h = None
        dividend_yield = None

        # Tentar obter informações atuais
        try:
            info = stock.info
            market_cap = info.get("marketCap", None)
            dividend_yield = info.get("dividendYield", None)
        except Exception as e:
            print(f"Erro ao obter info para {ticker}: {e}")

        # Tentar calcular variação de 24h
        try:
            data_2d = stock.history(period="2d", interval="1d")
            if len(data_2d) >= 2:
                close_today = data_2d["Close"].iloc[-1]
                close_yesterday = data_2d["Close"].iloc[-2]
                variation_24h = (
                    (close_today - close_yesterday) / close_yesterday
                ) * 100
        except Exception as e:
            print(f"Erro ao calcular variação de 24h para {ticker}: {e}")

        # Criar DataFrame com dados diários
        daily_data = pd.DataFrame(
            {
                "Ticker": [ticker],
                "Date": [datetime.now().strftime("%Y-%m-%d %H:%M:%S%z")],
                "MarketCap": [market_cap],
                "Variation_24h": [variation_24h],
                "Dividend_Yield": [dividend_yield],
            }
        )

        # Salvar em CSV
        filename = os.path.join("daily_data", f"{ticker}_daily.csv")
        daily_data.to_csv(filename, sep=";", index=False, encoding="utf-8-sig")
        print(f"Dados atuais de {ticker} salvos em '{filename}'.")

        processed_count += 1
        print(
            f"Ativo {i}: {ticker} processado. Total: {processed_count}/{total_tickers}\n"
        )

        time.sleep(1)

    except Exception as e:
        print(f"Erro ao processar {ticker}: {e}")
        daily_failed.append(ticker)
        processed_count += 1
        print(
            f"Ativo {i}: {ticker} processado (com erro). Total: {processed_count}/{total_tickers}\n"
        )
        time.sleep(1)

# Resumo
print("\nResumo:")
print(f"Ativos com falha nos dados históricos: {len(historical_failed)}")
if historical_failed:
    print("Tickers com falha (históricos):", historical_failed)
print(f"Ativos com falha nos dados atuais: {len(daily_failed)}")
if daily_failed:
    print("Tickers com falha (atuais):", daily_failed)

print("\nProcesso concluído!")
