import React, { useState, useEffect, useRef } from "react";
import { StockItem, IndexItem } from "../types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  indices: IndexItem[];
  onSelectItem: (item: StockItem | IndexItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  onSelectItem,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allItems: (StockItem | IndexItem)[] = [...stocks, ...indices];

  const filtered = allItems.filter(
    (item) =>
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Header */}
        <div className="p-3 border-b border-[#2A2E39] flex items-center gap-3 bg-[#131722]">
          <span className="material-symbols-outlined text-[#c3c5d8]">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbols, company names, or indices... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#e0e2ed] text-sm focus:outline-none placeholder-[#8d90a2]"
          />
          <button
            onClick={onClose}
            className="text-xs text-[#c3c5d8] bg-[#31353d] px-2 py-1 rounded hover:text-[#e0e2ed] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const isDown = item.changePercent < 0;
              return (
                <button
                  key={item.symbol}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="w-full p-3 hover:bg-[#31353d]/50 rounded flex justify-between items-center transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#e0e2ed] group-hover:text-[#2962ff] transition-colors w-16">
                      {item.symbol}
                    </span>
                    <span className="text-xs text-[#c3c5d8] truncate max-w-[200px]">
                      {item.name}
                    </span>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <div className="text-[#e0e2ed] font-semibold">${item.price.toFixed(2)}</div>
                    <div className={isDown ? "text-[#F23645]" : "text-[#089981]"}>
                      {item.changePercent >= 0 ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="p-6 text-center text-xs text-[#c3c5d8]">No matching stocks or indices found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
