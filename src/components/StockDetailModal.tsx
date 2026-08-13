import React, { useState } from "react";
import { StockItem, IndexItem } from "../types";
import { TradingViewChart } from "./TradingViewChart";
import { OrderBook } from "./OrderBook";

interface StockDetailModalProps {
  item: StockItem | IndexItem | null;
  onClose: () => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onSetAlert: (symbol: string, targetPrice: number) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  item,
  onClose,
  isInWatchlist,
  onToggleWatchlist,
  onSetAlert,
}) => {
  const [activeTab, setActiveTab] = useState<"chart" | "orderbook" | "financials" | "analysts">("chart");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [alertPriceInput, setAlertPriceInput] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  if (!item) return null;

  const isStock = "peRatio" in item;
  const stock = isStock ? (item as StockItem) : null;
  const isDown = item.changePercent < 0;

  // Fetch AI Analysis from Express Gemini API
  const fetchAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/gemini/market-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: item.symbol,
          query: `Analyze current technical pattern, support/resistance levels, and market momentum for ${item.name} (${item.symbol}).`,
          context: {
            price: item.price,
            changePercent: item.changePercent,
            sector: stock?.sector || "Index",
          },
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.analysis || "No analysis available.");
    } catch (err) {
      console.error("AI Analysis error:", err);
      setAiAnalysis("Failed to load Gemini AI Analysis. Please try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(alertPriceInput);
    if (!isNaN(val) && val > 0) {
      onSetAlert(item.symbol, val);
      setAlertMessage(`Alert set for ${item.symbol} at $${val.toFixed(2)}`);
      setAlertPriceInput("");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2A2E39] flex justify-between items-start sticky top-0 bg-[#1E222D] z-20">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#e0e2ed] font-mono">{item.symbol}</h2>
              <span className="text-xs text-[#b6c4ff] bg-[#2962ff]/15 border border-[#2962ff]/30 px-2 py-0.5 rounded font-mono font-bold">
                {isStock ? stock?.sector : "Market Index"}
              </span>
            </div>
            <p className="text-sm text-[#c3c5d8] font-medium mt-0.5">{item.name}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Watchlist Toggle Button */}
            <button
              onClick={() => onToggleWatchlist(item.symbol)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isInWatchlist
                  ? "bg-[#2962ff] text-white border-[#2962ff]"
                  : "bg-[#31353d]/50 text-[#c3c5d8] border-[#434656] hover:text-[#e0e2ed]"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isInWatchlist ? "star" : "star_outline"}
              </span>
              {isInWatchlist ? "Watchlisted" : "Add Watchlist"}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#c3c5d8] hover:text-[#e0e2ed] hover:bg-[#31353d] rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry Summary Strip */}
        <div className="p-5 border-b border-[#2A2E39] grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#131722]/60">
          <div>
            <span className="text-[10px] text-[#8d90a2] uppercase font-bold tracking-wider block">
              Last Price
            </span>
            <div className="font-mono text-2xl font-bold text-[#e0e2ed] mt-0.5">
              ${item.price.toFixed(2)}
            </div>
            <div
              className={`font-mono text-xs font-semibold flex items-center mt-0.5 ${
                isDown ? "text-[#F23645]" : "text-[#089981]"
              }`}
            >
              {item.change >= 0 ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)} (
              {item.changePercent >= 0 ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`})
            </div>
          </div>

          {stock && (
            <>
              <div>
                <span className="text-[10px] text-[#8d90a2] uppercase font-bold tracking-wider block">
                  Market Cap & Vol
                </span>
                <div className="text-xs font-medium text-[#e0e2ed] mt-1 space-y-0.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#c3c5d8]">Cap:</span>
                    <span className="font-bold">{stock.marketCap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#c3c5d8]">Vol:</span>
                    <span className="font-bold">{stock.volume}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#8d90a2] uppercase font-bold tracking-wider block">
                  Valuation Multiples
                </span>
                <div className="text-xs font-medium text-[#e0e2ed] mt-1 space-y-0.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#c3c5d8]">P/E:</span>
                    <span className="font-bold">{stock.peRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#c3c5d8]">Div Yield:</span>
                    <span className="font-bold">{stock.financials?.dividendYield || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#8d90a2] uppercase font-bold tracking-wider block">
                  52-Week Range
                </span>
                <div className="text-xs font-medium text-[#e0e2ed] mt-1 space-y-0.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#c3c5d8]">52W High:</span>
                    <span className="text-[#089981] font-bold">${stock.fiftyTwoWeekHigh.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#c3c5d8]">52W Low:</span>
                    <span className="text-[#F23645] font-bold">${stock.fiftyTwoWeekLow.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Section Tabs */}
        <div className="px-5 pt-3 border-b border-[#2A2E39] flex gap-4 bg-[#10131b]">
          <button
            onClick={() => setActiveTab("chart")}
            className={`pb-2 border-b-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "chart"
                ? "border-[#2962ff] text-[#b6c4ff]"
                : "border-transparent text-[#c3c5d8] hover:text-[#e0e2ed]"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">candlestick_chart</span>
            Technical Analysis Chart
          </button>
          <button
            onClick={() => setActiveTab("orderbook")}
            className={`pb-2 border-b-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "orderbook"
                ? "border-[#2962ff] text-[#b6c4ff]"
                : "border-transparent text-[#c3c5d8] hover:text-[#e0e2ed]"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">table_rows</span>
            Level 2 Order Book
          </button>
          {stock && (
            <>
              <button
                onClick={() => setActiveTab("financials")}
                className={`pb-2 border-b-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "financials"
                    ? "border-[#2962ff] text-[#b6c4ff]"
                    : "border-transparent text-[#c3c5d8] hover:text-[#e0e2ed]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">account_balance</span>
                Financials & Earnings
              </button>
              <button
                onClick={() => setActiveTab("analysts")}
                className={`pb-2 border-b-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "analysts"
                    ? "border-[#2962ff] text-[#b6c4ff]"
                    : "border-transparent text-[#c3c5d8] hover:text-[#e0e2ed]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                Analyst Consensus
              </button>
            </>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 border-b border-[#2A2E39]">
          {activeTab === "chart" && (
            <TradingViewChart
              data={stock?.history || []}
              symbol={item.symbol}
              isDown={isDown}
            />
          )}

          {activeTab === "orderbook" && (
            <OrderBook currentPrice={item.price} symbol={item.symbol} />
          )}

          {activeTab === "financials" && stock?.financials && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#10131b] p-4 rounded border border-[#2A2E39] font-mono">
                <div>
                  <span className="text-[#8d90a2] block font-bold text-[10px]">Annual Revenue</span>
                  <span className="text-base font-bold text-[#e0e2ed]">{stock.financials.revenue}</span>
                </div>
                <div>
                  <span className="text-[#8d90a2] block font-bold text-[10px]">Net Income</span>
                  <span className="text-base font-bold text-[#089981]">{stock.financials.netIncome}</span>
                </div>
                <div>
                  <span className="text-[#8d90a2] block font-bold text-[10px]">Gross Margin</span>
                  <span className="text-base font-bold text-[#b6c4ff]">{stock.financials.grossMargin}</span>
                </div>
                <div>
                  <span className="text-[#8d90a2] block font-bold text-[10px]">Free Cash Flow</span>
                  <span className="text-base font-bold text-[#e0e2ed]">{stock.financials.freeCashFlow}</span>
                </div>
              </div>

              {stock.earningsHistory && (
                <div>
                  <h4 className="font-bold text-[#e0e2ed] mb-3">Quarterly Earnings EPS (Actual vs Estimate)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stock.earningsHistory.map((earning, idx) => (
                      <div key={idx} className="bg-[#10131b] p-3 rounded border border-[#2A2E39] font-mono">
                        <span className="text-[#8d90a2] text-[10px] block font-bold">{earning.quarter}</span>
                        <div className="mt-1 flex justify-between">
                          <span className="text-[#c3c5d8]">Actual:</span>
                          <span className="text-[#089981] font-bold">${earning.actual.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#c3c5d8]">Est:</span>
                          <span className="text-[#c3c5d8]">${earning.estimate.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "analysts" && stock?.analystConsensus && (
            <div className="space-y-6 text-xs">
              <div className="bg-[#10131b] p-4 rounded border border-[#2A2E39] flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <span className="text-[#8d90a2] text-[10px] font-bold uppercase tracking-wider block">
                    Wall Street Consensus
                  </span>
                  <div className="text-2xl font-bold text-[#2962ff] mt-1">
                    {stock.analystConsensus.rating}
                  </div>
                  <p className="text-[#c3c5d8] text-[11px] mt-1">
                    Based on {stock.analystConsensus.buyCount + stock.analystConsensus.holdCount + stock.analystConsensus.sellCount} Wall Street analyst ratings.
                  </p>
                </div>

                <div className="font-mono text-xs space-y-1 bg-[#1E222D] p-3 rounded border border-[#2A2E39] min-w-[200px]">
                  <div className="flex justify-between">
                    <span className="text-[#c3c5d8]">Average Target:</span>
                    <span className="text-[#089981] font-bold">${stock.analystConsensus.targetPriceAvg.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#c3c5d8]">High Target:</span>
                    <span className="text-[#e0e2ed]">${stock.analystConsensus.targetPriceHigh.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#c3c5d8]">Low Target:</span>
                    <span className="text-[#F23645]">${stock.analystConsensus.targetPriceLow.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Set Custom Price Alert Form */}
        <div className="p-5 border-b border-[#2A2E39] bg-[#131722]/30">
          <h3 className="text-xs font-bold text-[#e0e2ed] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#2962ff]">notifications_active</span>
            Create Price Alert Condition
          </h3>
          <form onSubmit={handleCreateAlert} className="flex gap-3 items-center">
            <input
              type="number"
              step="0.01"
              placeholder={`Target price (e.g. ${(item.price * 1.05).toFixed(2)})`}
              value={alertPriceInput}
              onChange={(e) => setAlertPriceInput(e.target.value)}
              className="bg-[#10131b] border border-[#2A2E39] text-[#e0e2ed] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#2962ff] flex-1 font-mono"
            />
            <button
              type="submit"
              className="bg-[#2962ff] hover:bg-[#004ee8] text-white px-4 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              Set Alert
            </button>
          </form>
          {alertMessage && (
            <p className="text-xs text-[#089981] font-medium mt-2">{alertMessage}</p>
          )}
        </div>

        {/* Gemini AI Intelligence Section */}
        <div className="p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-[#e0e2ed] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2962ff]">lightbulb</span>
              Gemini AI Market Intelligence Report
            </h3>
            <button
              onClick={fetchAiAnalysis}
              disabled={loadingAi}
              className="bg-[#2962ff]/15 hover:bg-[#2962ff]/30 text-[#b6c4ff] border border-[#2962ff]/40 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              {loadingAi ? "Analyzing..." : "Generate AI Insights"}
            </button>
          </div>

          {aiAnalysis ? (
            <div className="bg-[#10131b] border border-[#2A2E39] p-4 rounded text-xs text-[#c3c5d8] leading-relaxed whitespace-pre-wrap font-sans">
              {aiAnalysis}
            </div>
          ) : (
            <p className="text-xs text-[#c3c5d8] italic bg-[#10131b]/60 p-3 rounded border border-[#2A2E39]/60">
              Click &quot;Generate AI Insights&quot; to run Gemini technical pattern recognition and news sentiment scanning for {item.symbol}.
            </p>
          )}

          {stock?.description && (
            <div className="mt-4 pt-4 border-t border-[#2A2E39]">
              <h4 className="text-xs font-bold text-[#c3c5d8] uppercase tracking-wider mb-1">Company Overview</h4>
              <p className="text-xs text-[#c3c5d8] leading-normal">{stock.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
