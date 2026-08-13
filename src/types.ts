export interface SparklinePoint {
  x: number;
  y: number;
}

export interface CandlestickBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FinancialMetric {
  revenue: string;
  netIncome: string;
  grossMargin: string;
  freeCashFlow: string;
  peRatio: number;
  dividendYield: string;
}

export interface AnalystConsensus {
  rating: "Strong Buy" | "Buy" | "Hold" | "Sell";
  targetPriceAvg: number;
  targetPriceHigh: number;
  targetPriceLow: number;
  buyCount: number;
  holdCount: number;
  sellCount: number;
}

export interface EarningsSurprise {
  quarter: string;
  actual: number;
  estimate: number;
}

export interface StockItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: string;
  avgVolume: string;
  marketCap: string;
  peRatio: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  sector: string;
  isUp: boolean;
  monitoring?: boolean;
  sparkline: SparklinePoint[];
  history: CandlestickBar[];
  description: string;
  financials?: FinancialMetric;
  analystConsensus?: AnalystConsensus;
  earningsHistory?: EarningsSurprise[];
}

export interface IndexItem {
  symbol: string;
  name: string;
  badgeNumber: string;
  price: number;
  change: number;
  changePercent: number;
  isUp: boolean;
  sparkline: SparklinePoint[];
}

export interface TickerTapeItem {
  symbol: string;
  name: string;
  price: string;
  changePercent: number;
  category: "FOREX" | "CRYPTO" | "INDEX" | "COMMODITY";
}

export type MarketMoverCategory = "highest_volume" | "most_volatile" | "gainers" | "losers";

export interface MarketMoverItem {
  symbol: string;
  name: string;
  price: number | string;
  change: number;
  changePercent: number;
  volume: string;
  category: MarketMoverCategory;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: "Tech" | "Markets" | "Macro" | "Crypto";
  summary: string;
  relatedSymbols: string[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  country: string;
  event: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  actual: string;
  forecast: string;
  previous: string;
}

export interface BrokerItem {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  minDeposit: string;
  spread: string;
  leverage: string;
  regulation: string;
  badge?: string;
  features: string[];
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: "ABOVE" | "BELOW";
  createdAt: string;
  active: boolean;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  shares: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: string;
}

export type SidebarTab =
  | "watchlist"
  | "alerts"
  | "data_window"
  | "screener"
  | "heatmap"
  | "paper_trading"
  | "calendar"
  | "ideas"
  | "help"
  | "settings";

export type TopNavTab = "Products" | "Community" | "Markets" | "Screener" | "Heatmap" | "News" | "Brokers";
