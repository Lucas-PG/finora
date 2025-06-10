DROP DATABASE IF EXISTS projeto_react;
CREATE DATABASE projeto_react;
USE projeto_react;

CREATE TABLE IF NOT EXISTS  users (
  uuid VARCHAR(36) PRIMARY KEY UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  photo VARCHAR(255)
);

CREATE TABLE messages (
  id INT PRIMARY KEY UNIQUE NOT NULL AUTO_INCREMENT,
  userId VARCHAR(36) NOT NULL,
  prompt VARCHAR(2500) NOT NULL,
  message VARCHAR(2500) NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(uuid)
);

CREATE TABLE IF NOT EXISTS  emails (
  id INT PRIMARY KEY UNIQUE NOT NULL AUTO_INCREMENT,
  userId VARCHAR(36) NOT NULL,
  message VARCHAR(2500) NOT NULL,
  timestamp DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS  wallets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(uuid)
);

CREATE TABLE IF NOT EXISTS wallet_assets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  walletId INT NOT NULL,
  ticker VARCHAR(10) NOT NULL,
  quantity INT NOT NULL,
  buy_price DECIMAL(10,2) NOT NULL,
  buy_date DATE NOT NULL,
  type ENUM('acao', 'fii', 'etf', 'bdr') NOT NULL,
  FOREIGN KEY (walletId) REFERENCES wallets(id)
);


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

-- SELECT * FROM users;
-- SELECT * FROM wallets WHERE userId = "INSIRA_O_UUID_AQUI";
-- SELECT COUNT(DISTINCT ticker) AS total_tickers FROM historical_data;
-- SELECT COUNT(*) AS total_rows FROM historical_data;
-- SELECT uuid, password, name FROM users WHERE email = 'lucas@gmail.com';
