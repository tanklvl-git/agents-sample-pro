import React, { useState } from "react";
import { NewsArticle } from "../types";

interface NewsViewProps {
  articles: NewsArticle[];
  onSelectSymbol: (symbol: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ articles, onSelectSymbol }) => {
  const [filter, setFilter] = useState<string>("ALL");

  const categories = ["ALL", "Tech", "Markets", "Macro", "Crypto"];

  const filtered =
    filter === "ALL" ? articles : articles.filter((a) => a.category === filter);

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2E39] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#e0e2ed] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2962ff]">newspaper</span>
            Financial News & Market Pulse
          </h2>
          <p className="text-xs text-[#c3c5d8] mt-1">
            Real-time market coverage, earnings releases, and macroeconomic analysis.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                filter === cat
                  ? "bg-[#2962ff] text-white"
                  : "bg-[#31353d]/50 text-[#c3c5d8] hover:text-[#e0e2ed]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#10131b] border border-[#2A2E39] p-4 rounded hover:border-[#434656] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center text-xs text-[#c3c5d8] mb-2">
                <span className="font-semibold text-[#2962ff]">{item.source}</span>
                <span>{item.timeAgo}</span>
              </div>
              <h3 className="font-bold text-sm text-[#e0e2ed] leading-snug hover:text-[#b6c4ff] transition-colors cursor-pointer">
                {item.title}
              </h3>
              <p className="text-xs text-[#c3c5d8] mt-2 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2A2E39] flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#c3c5d8] bg-[#31353d] px-2 py-0.5 rounded">
                {item.category}
              </span>

              <div className="flex gap-1">
                {item.relatedSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => onSelectSymbol(sym)}
                    className="font-mono text-[11px] font-bold text-[#b6c4ff] hover:text-white bg-[#2962ff]/10 border border-[#2962ff]/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    ${sym}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
