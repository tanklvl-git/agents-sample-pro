import React, { useState } from "react";

export const GeminiMarketAnalyst: React.FC = () => {
  const [query, setQuery] = useState("");
  const [symbol, setSymbol] = useState("NVDA");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const predefinedPrompts = [
    "What is driving NVIDIA's recent momentum?",
    "How could upcoming CPI numbers impact US Stocks?",
    "Compare Tesla vs. Apple valuation and technicals.",
    "Give me an executive summary of current market risks.",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/gemini/market-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: symbol || "US Markets",
          query: query,
        }),
      });
      const data = await res.json();
      setResponse(data.analysis || "No response received.");
    } catch (err) {
      console.error(err);
      setResponse("Error connecting to Gemini AI Market Analyst service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded p-6 shadow-sm space-y-6">
      <div className="border-b border-[#2A2E39] pb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2962ff] text-2xl">
            lightbulb
          </span>
          <h2 className="text-xl font-bold text-[#e0e2ed]">
            MarketPulse AI Ideas & Analyst
          </h2>
        </div>
        <p className="text-xs text-[#c3c5d8] mt-1">
          Ask custom financial questions and generate instant market reports powered by Gemini AI.
        </p>
      </div>

      {/* Suggested Prompts */}
      <div>
        <span className="text-xs font-bold text-[#c3c5d8] uppercase tracking-wider block mb-2">
          Suggested Analysis Topics
        </span>
        <div className="flex flex-wrap gap-2">
          {predefinedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p);
              }}
              className="bg-[#10131b] border border-[#2A2E39] hover:border-[#2962ff] text-xs text-[#c3c5d8] hover:text-[#e0e2ed] px-3 py-1.5 rounded transition-all cursor-pointer text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Symbol (e.g., NVDA, AAPL, S&P 500)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-32 bg-[#10131b] border border-[#2A2E39] text-[#e0e2ed] text-xs px-3 py-2 rounded focus:outline-none focus:border-[#2962ff] font-mono"
          />
          <input
            type="text"
            placeholder="Ask AI Analyst anything about tickers, technicals, or macro..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#10131b] border border-[#2A2E39] text-[#e0e2ed] text-xs px-3 py-2 rounded focus:outline-none focus:border-[#2962ff]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2962ff] hover:bg-[#004ee8] text-white px-5 py-2 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {loading ? "Analyzing..." : "Ask Gemini"}
          </button>
        </div>
      </form>

      {/* Output Panel */}
      {response && (
        <div className="bg-[#10131b] border border-[#2A2E39] p-5 rounded space-y-3">
          <div className="flex justify-between items-center border-b border-[#2A2E39] pb-2">
            <span className="text-xs font-bold text-[#2962ff] uppercase tracking-wider">
              AI Market Intelligence Report
            </span>
            <span className="text-[10px] text-[#c3c5d8] font-mono">Target: {symbol}</span>
          </div>
          <div className="text-xs text-[#e0e2ed] leading-relaxed whitespace-pre-wrap font-sans">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};
