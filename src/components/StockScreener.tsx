import React, { useState } from "react";
import { StockItem } from "../types";

interface StockScreenerProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
}

export const StockScreener: React.FC<StockScreenerProps> = ({ stocks, onSelectStock }) => {
  const [sectorFilter, setSectorFilter] = useState<string>("ALL");
  const [minPe, setMinPe] = useState<number>(0);
  const [maxPe, setMaxPe] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<keyof StockItem>("changePercent");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const sectors = ["ALL", ...Array.from(new Set(stocks.map((s) => s.sector)))];

  const filtered = stocks.filter((stock) => {
    if (sectorFilter !== "ALL" && stock.sector !== sectorFilter) return false;
    if (stock.peRatio < minPe || stock.peRatio > maxPe) return false;
    if (
      searchQuery &&
      !stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    if (typeof valA === "string" && typeof valB === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return 0;
  });

  const handleSort = (field: keyof StockItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2E39] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#e0e2ed] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2962ff]">filter_alt</span>
            Pro Stock Screener
          </h2>
          <p className="text-xs text-[#c3c5d8] mt-1">
            Filter tickers by sector, valuation multiples, price change, and market cap.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search ticker or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#10131b] border border-[#2A2E39] text-[#e0e2ed] text-xs px-3 py-1.5 rounded focus:outline-none focus:border-[#2962ff] w-56 font-mono"
          />
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#10131b] p-4 rounded border border-[#2A2E39] text-xs">
        <div>
          <label className="text-[#8d90a2] block mb-1 font-bold uppercase text-[10px]">Sector</label>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="w-full bg-[#1E222D] border border-[#2A2E39] text-[#e0e2ed] p-2 rounded focus:outline-none focus:border-[#2962ff]"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[#8d90a2] block mb-1 font-bold uppercase text-[10px]">Min P/E Ratio ({minPe})</label>
          <input
            type="range"
            min="0"
            max="100"
            value={minPe}
            onChange={(e) => setMinPe(Number(e.target.value))}
            className="w-full accent-[#2962ff]"
          />
        </div>

        <div>
          <label className="text-[#8d90a2] block mb-1 font-bold uppercase text-[10px]">Max P/E Ratio ({maxPe})</label>
          <input
            type="range"
            min="0"
            max="100"
            value={maxPe}
            onChange={(e) => setMaxPe(Number(e.target.value))}
            className="w-full accent-[#2962ff]"
          />
        </div>
      </div>

      {/* Screener Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-[#2A2E39] text-[#c3c5d8] uppercase tracking-wider font-bold h-9">
              <th onClick={() => handleSort("symbol")} className="py-2 px-3 cursor-pointer hover:text-[#e0e2ed]">
                Ticker {sortField === "symbol" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("name")} className="py-2 px-3 cursor-pointer hover:text-[#e0e2ed]">
                Name {sortField === "name" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("sector")} className="py-2 px-3 cursor-pointer hover:text-[#e0e2ed]">
                Sector
              </th>
              <th onClick={() => handleSort("price")} className="py-2 px-3 text-right cursor-pointer hover:text-[#e0e2ed]">
                Price ($)
              </th>
              <th onClick={() => handleSort("changePercent")} className="py-2 px-3 text-right cursor-pointer hover:text-[#e0e2ed]">
                Change %
              </th>
              <th onClick={() => handleSort("peRatio")} className="py-2 px-3 text-right cursor-pointer hover:text-[#e0e2ed]">
                P/E Ratio
              </th>
              <th onClick={() => handleSort("marketCap")} className="py-2 px-3 text-right cursor-pointer hover:text-[#e0e2ed]">
                Market Cap
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2E39]">
            {sorted.map((stock) => {
              const isDown = stock.changePercent < 0;
              return (
                <tr
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock)}
                  className="hover:bg-[#31353d]/40 cursor-pointer h-10 transition-colors"
                >
                  <td className="py-2 px-3 font-bold text-[#e0e2ed]">{stock.symbol}</td>
                  <td className="py-2 px-3 text-[#c3c5d8] font-sans">{stock.name}</td>
                  <td className="py-2 px-3 text-[#c3c5d8] font-sans text-[11px]">{stock.sector}</td>
                  <td className="py-2 px-3 text-right font-bold text-[#e0e2ed]">${stock.price.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        isDown ? "bg-[#F23645]/15 text-[#F23645]" : "bg-[#089981]/15 text-[#089981]"
                      }`}
                    >
                      {stock.changePercent > 0 ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-[#c3c5d8]">{stock.peRatio}</td>
                  <td className="py-2 px-3 text-right text-[#e0e2ed] font-semibold">{stock.marketCap}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
