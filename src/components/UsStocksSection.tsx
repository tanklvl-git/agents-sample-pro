import React from "react";
import { StockItem } from "../types";

interface UsStocksSectionProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  onExpandStocks: () => void;
  isMarketOpen: boolean;
  onToggleMarketOpen: () => void;
}

export const UsStocksSection: React.FC<UsStocksSectionProps> = ({
  stocks,
  onSelectStock,
  onExpandStocks,
  isMarketOpen,
  onToggleMarketOpen,
}) => {
  // Display top 6 stocks
  const displayStocks = stocks.slice(0, 6);

  return (
    <section className="col-span-1 lg:col-span-2 bg-[#1E222D] border border-[#2A2E39] rounded flex flex-col shadow-sm">
      {/* Box Header */}
      <div className="p-4 border-b border-[#2A2E39] flex justify-between items-center select-none">
        <div
          onClick={onExpandStocks}
          className="flex items-center gap-1 group cursor-pointer"
        >
          <h2 className="text-[18px] font-semibold text-[#e0e2ed] group-hover:text-[#2962ff] transition-colors">
            US stocks
          </h2>
          <span className="material-symbols-outlined text-[#c3c5d8] group-hover:text-[#2962ff] text-[20px] transition-colors">
            chevron_right
          </span>
        </div>

        {/* Market Status Badge */}
        <button
          onClick={onToggleMarketOpen}
          title="Click to toggle Market Open/Closed simulation"
          className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold border rounded cursor-pointer transition-colors ${
            isMarketOpen
              ? "bg-[#089981]/10 text-[#089981] border-[#089981]/30 hover:bg-[#089981]/20"
              : "bg-[#31353d]/50 text-[#c3c5d8] border-[#434656] hover:bg-[#31353d]"
          }`}
        >
          {isMarketOpen ? "Market Open" : "Market Closed"}
        </button>
      </div>

      {/* Grid with 1px border gutter */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-[1px] bg-[#2A2E39] p-[1px] rounded-b">
        {displayStocks.map((stock) => {
          const isDown = stock.changePercent < 0;
          return (
            <button
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className="bg-[#1E222D] p-4 flex flex-col justify-between hover:bg-[#31353d]/40 transition-colors h-[120px] text-left cursor-pointer group"
            >
              {/* Header: Name + Monitoring Icon */}
              <div className="flex justify-between items-start w-full">
                <span className="font-semibold text-sm text-[#e0e2ed] group-hover:text-[#b6c4ff] transition-colors">
                  {stock.name}
                </span>
                {stock.monitoring && (
                  <span className="material-symbols-outlined text-[#c3c5d8] group-hover:text-[#2962ff] text-[16px]">
                    monitoring
                  </span>
                )}
              </div>

              {/* Price & Change % */}
              <div className="w-full">
                <div className="font-mono text-[16px] text-[#e0e2ed] font-medium">
                  {stock.price.toFixed(2)}
                </div>
                <div
                  className={`font-mono text-[12px] flex items-center ${
                    isDown ? "text-[#F23645]" : "text-[#089981]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] mr-0.5">
                    {isDown ? "arrow_drop_down" : "arrow_drop_up"}
                  </span>
                  {stock.changePercent > 0
                    ? `${stock.changePercent.toFixed(2)}%`
                    : `${stock.changePercent.toFixed(2)}%`}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
