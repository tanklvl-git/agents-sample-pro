import React from "react";
import { IndexItem } from "../types";

interface IndicesSectionProps {
  indices: IndexItem[];
  onSelectIndex: (indexItem: IndexItem) => void;
  onExpandAll: () => void;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  indices,
  onSelectIndex,
  onExpandAll,
}) => {
  // Display primary 3 indices
  const primaryIndices = indices.slice(0, 3);

  return (
    <section className="col-span-1 md:col-span-2 lg:col-span-3 mb-4">
      {/* Section Header */}
      <div
        onClick={onExpandAll}
        className="flex items-center gap-1 mb-4 group cursor-pointer w-max select-none"
      >
        <h2 className="font-semibold text-[20px] text-[#e0e2ed] group-hover:text-[#2962ff] transition-colors">
          Indices
        </h2>
        <span className="material-symbols-outlined text-[#c3c5d8] group-hover:text-[#2962ff] transition-colors text-[20px]">
          chevron_right
        </span>
      </div>

      {/* Indices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {primaryIndices.map((idx) => {
          const isDown = !idx.isUp;
          return (
            <div
              key={idx.symbol}
              onClick={() => onSelectIndex(idx)}
              className="bg-[#1E222D] border border-[#2A2E39] rounded p-4 hover:border-[#434656] transition-all group cursor-pointer flex justify-between items-center h-[72px] shadow-sm select-none"
            >
              <div className="flex items-center gap-3">
                {/* Badge Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border font-mono font-bold text-xs ${
                    isDown
                      ? "bg-[#F23645]/10 border-[#F23645]/20 text-[#F23645]"
                      : "bg-[#2962ff]/10 border-[#2962ff]/20 text-[#2962ff]"
                  }`}
                >
                  {idx.badgeNumber}
                </div>

                {/* Name & Rate */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#e0e2ed]">
                    {idx.name}
                  </span>
                  <span
                    className={`font-mono text-[11px] flex items-center ${
                      isDown ? "text-[#F23645]" : "text-[#089981]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px] mr-0.5">
                      {isDown ? "arrow_drop_down" : "arrow_drop_up"}
                    </span>
                    {idx.changePercent > 0 ? `+${idx.changePercent.toFixed(2)}%` : `${idx.changePercent.toFixed(2)}%`}
                  </span>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="w-24 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                  <path
                    className={isDown ? "sparkline-down" : "sparkline-up"}
                    d={
                      isDown
                        ? "M0,15 L10,12 L20,18 L30,10 L40,15 L50,8 L60,20 L70,25 L80,18 L90,22 L100,28"
                        : "M0,25 L10,22 L20,28 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,4"
                    }
                  />
                  <path
                    className={isDown ? "sparkline-area-down" : "sparkline-area-up"}
                    d={
                      isDown
                        ? "M0,15 L10,12 L20,18 L30,10 L40,15 L50,8 L60,20 L70,25 L80,18 L90,22 L100,28 L100,30 L0,30 Z"
                        : "M0,25 L10,22 L20,28 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,4 L100,30 L0,30 Z"
                    }
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
