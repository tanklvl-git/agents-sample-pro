import React from "react";
import { TickerTapeItem } from "../types";

interface TickerTapeProps {
  items: TickerTapeItem[];
  onSelectItem?: (symbol: string) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ items, onSelectItem }) => {
  return (
    <div className="bg-[#0b0e14] border-b border-[#2A2E39] text-[11px] font-mono h-8 flex items-center overflow-hidden select-none relative z-30">
      <div className="bg-[#2962ff] text-white px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0 z-10 shadow-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        Live Ticker
      </div>

      {/* Marquee Container */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1 px-3 whitespace-nowrap animate-marquee">
        {items.map((item, idx) => {
          const isDown = item.changePercent < 0;
          return (
            <button
              key={`${item.symbol}-${idx}`}
              onClick={() => onSelectItem && onSelectItem(item.symbol)}
              className="flex items-center gap-2 hover:bg-[#1E222D] px-2 py-0.5 rounded cursor-pointer transition-colors shrink-0 group"
            >
              <span className="font-bold text-[#e0e2ed] group-hover:text-[#2962ff]">
                {item.symbol}
              </span>
              <span className="text-[#c3c5d8]">{item.price}</span>
              <span
                className={`font-semibold flex items-center ${
                  isDown ? "text-[#F23645]" : "text-[#089981]"
                }`}
              >
                {item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
