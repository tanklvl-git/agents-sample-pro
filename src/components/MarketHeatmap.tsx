import React from "react";
import { StockItem } from "../types";

interface MarketHeatmapProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ stocks, onSelectStock }) => {
  // Group stocks by sector
  const groupedBySector: Record<string, StockItem[]> = {};
  stocks.forEach((stock) => {
    const sec = stock.sector || "Other";
    if (!groupedBySector[sec]) groupedBySector[sec] = [];
    groupedBySector[sec].push(stock);
  });

  const getHeatmapBg = (changePct: number) => {
    if (changePct >= 3.0) return "bg-[#089981] text-white";
    if (changePct >= 1.0) return "bg-[#089981]/80 text-white";
    if (changePct > 0) return "bg-[#089981]/40 text-[#e0e2ed]";
    if (changePct === 0) return "bg-[#31353d] text-[#c3c5d8]";
    if (changePct > -1.0) return "bg-[#F23645]/40 text-[#e0e2ed]";
    if (changePct > -3.0) return "bg-[#F23645]/80 text-white";
    return "bg-[#F23645] text-white";
  };

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-[#2A2E39] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#e0e2ed] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2962ff]">grid_view</span>
            S&P 500 Market Heatmap
          </h2>
          <p className="text-xs text-[#c3c5d8] mt-1">
            Visual performance map scaled by market cap and performance intensity.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className="text-[#F23645] font-bold">-3%</span>
          <div className="flex h-3 w-24 rounded overflow-hidden">
            <div className="bg-[#F23645] w-1/5" />
            <div className="bg-[#F23645]/50 w-1/5" />
            <div className="bg-[#31353d] w-1/5" />
            <div className="bg-[#089981]/50 w-1/5" />
            <div className="bg-[#089981] w-1/5" />
          </div>
          <span className="text-[#089981] font-bold">+3%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedBySector).map(([sectorName, items]) => (
          <div
            key={sectorName}
            className="bg-[#10131b] border border-[#2A2E39] p-4 rounded space-y-3"
          >
            <h3 className="text-xs font-bold text-[#b6c4ff] uppercase tracking-wider border-b border-[#2A2E39] pb-1.5">
              {sectorName}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {items.map((stock) => {
                const bgClass = getHeatmapBg(stock.changePercent);
                return (
                  <button
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`${bgClass} p-3 rounded flex flex-col justify-between h-24 hover:opacity-90 transition-opacity cursor-pointer text-left font-mono relative overflow-hidden group shadow-sm`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-bold text-sm tracking-wide">{stock.symbol}</span>
                      <span className="text-[10px] opacity-80">{stock.marketCap}</span>
                    </div>

                    <div>
                      <div className="text-xs font-semibold">${stock.price.toFixed(2)}</div>
                      <div className="text-xs font-bold mt-0.5">
                        {stock.changePercent > 0 ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
