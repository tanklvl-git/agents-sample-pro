import React, { useState } from "react";
import { MarketMoverItem, MarketMoverCategory } from "../types";

interface MarketMoversSectionProps {
  movers: MarketMoverItem[];
  onSelectMoverSymbol: (symbol: string) => void;
  onSeeAll: () => void;
}

export const MarketMoversSection: React.FC<MarketMoversSectionProps> = ({
  movers,
  onSelectMoverSymbol,
  onSeeAll,
}) => {
  const [activeTab, setActiveTab] = useState<MarketMoverCategory>("highest_volume");

  const tabs: { id: MarketMoverCategory; label: string }[] = [
    { id: "highest_volume", label: "Highest volume" },
    { id: "most_volatile", label: "Most volatile" },
    { id: "gainers", label: "Gainers" },
    { id: "losers", label: "Losers" },
  ];

  const filteredMovers = movers.filter((m) => m.category === activeTab);

  return (
    <section className="col-span-1 bg-[#1E222D] border border-[#2A2E39] rounded flex flex-col shadow-sm">
      {/* Tab Controls */}
      <div className="px-4 pt-3 pb-0 border-b border-[#2A2E39] flex gap-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 border-b-2 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "border-[#2962ff] text-[#b6c4ff]"
                  : "border-transparent text-[#c3c5d8] hover:text-[#e0e2ed]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Table Body */}
      <div className="flex-1 p-2 flex flex-col justify-between">
        <table className="w-full text-left border-collapse">
          <tbody>
            {filteredMovers.slice(0, 5).map((item) => {
              const isDown = item.changePercent < 0;
              const isNeutral = item.changePercent === 0;

              return (
                <tr
                  key={item.symbol}
                  onClick={() => onSelectMoverSymbol(item.symbol)}
                  className="hover:bg-[#31353d]/30 cursor-pointer h-[40px] border-b border-[#2A2E39]/50 last:border-0 group transition-colors"
                >
                  {/* Ticker & Name */}
                  <td className="pl-2 py-1">
                    <div className="text-xs font-semibold text-[#e0e2ed] group-hover:text-[#2962ff] transition-colors">
                      {item.symbol}
                    </div>
                    <div className="text-[10px] text-[#c3c5d8] truncate max-w-[120px]">
                      {item.name}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="text-right py-1">
                    <div className="font-mono text-[13px] text-[#e0e2ed]">
                      {typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                    </div>
                  </td>

                  {/* Change % Pill */}
                  <td className="pr-2 text-right py-1 w-20">
                    <div
                      className={`font-mono text-[12px] px-1.5 py-0.5 rounded inline-block font-medium ${
                        isNeutral
                          ? "bg-[#31353d] text-[#c3c5d8]"
                          : isDown
                          ? "bg-[#F23645]/10 text-[#F23645]"
                          : "bg-[#089981]/10 text-[#089981]"
                      }`}
                    >
                      {item.changePercent > 0
                        ? `+${item.changePercent.toFixed(item.changePercent % 1 === 0 ? 1 : 2)}%`
                        : `${item.changePercent.toFixed(item.changePercent % 1 === 0 ? 1 : 2)}%`}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Bottom Expansion Link */}
        <button
          onClick={onSeeAll}
          className="block text-center text-[12px] text-[#2962ff] hover:text-[#004ee8] mt-2 py-1 transition-colors cursor-pointer w-full font-medium"
        >
          See all actively traded
        </button>
      </div>
    </section>
  );
};
