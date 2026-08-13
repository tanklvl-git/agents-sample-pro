import React from "react";
import { StockItem } from "../types";

interface WatchlistDrawerProps {
  watchlistSymbols: string[];
  stocks: StockItem[];
  onRemoveFromWatchlist: (symbol: string) => void;
  onSelectStock: (stock: StockItem) => void;
  onClose: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  watchlistSymbols,
  stocks,
  onRemoveFromWatchlist,
  onSelectStock,
  onClose,
}) => {
  const watchlistStocks = stocks.filter((s) => watchlistSymbols.includes(s.symbol));

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#1E222D] border-l border-[#2A2E39] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#2A2E39] flex justify-between items-center bg-[#131722]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2962ff]">list_alt</span>
          <h2 className="text-base font-bold text-[#e0e2ed]">Your Watchlist</h2>
          <span className="bg-[#2962ff] text-white text-xs px-2 py-0.5 rounded-full font-mono">
            {watchlistStocks.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#c3c5d8] hover:text-[#e0e2ed] p-1 rounded hover:bg-[#31353d] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {watchlistStocks.length > 0 ? (
          watchlistStocks.map((stock) => {
            const isDown = stock.changePercent < 0;
            return (
              <div
                key={stock.symbol}
                className="bg-[#10131b] border border-[#2A2E39] p-3 rounded flex justify-between items-center hover:border-[#434656] transition-colors group"
              >
                <div
                  onClick={() => onSelectStock(stock)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#e0e2ed] group-hover:text-[#2962ff]">
                      {stock.symbol}
                    </span>
                    <span className="text-xs text-[#c3c5d8] truncate max-w-[120px]">
                      {stock.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#c3c5d8] mt-0.5">{stock.sector}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <div className="text-sm font-semibold text-[#e0e2ed]">${stock.price.toFixed(2)}</div>
                    <div className={`text-xs ${isDown ? "text-[#F23645]" : "text-[#089981]"}`}>
                      {stock.changePercent >= 0 ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromWatchlist(stock.symbol)}
                    title="Remove from watchlist"
                    className="text-[#c3c5d8] hover:text-[#F23645] p-1 rounded hover:bg-[#31353d] cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-[#c3c5d8]">
            <span className="material-symbols-outlined text-4xl text-[#434656] mb-2 block">star_border</span>
            No stocks added to your watchlist yet. Click any stock or index to add it to your watchlist!
          </div>
        )}
      </div>
    </div>
  );
};
