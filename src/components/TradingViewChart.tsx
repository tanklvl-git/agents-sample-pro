import React, { useState, useMemo } from "react";
import { CandlestickBar } from "../types";

interface TradingViewChartProps {
  data: CandlestickBar[];
  symbol: string;
  isDown: boolean;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  data,
  symbol,
  isDown,
}) => {
  const [chartType, setChartType] = useState<"candlestick" | "area" | "line">("candlestick");
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Price Extremes Calculation
  const { minPrice, maxPrice, priceRange, volumes, maxVolume } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minPrice: 100, maxPrice: 120, priceRange: 20, volumes: [], maxVolume: 1000000 };
    }
    const mins = data.map((d) => d.low);
    const maxs = data.map((d) => d.high);
    const minP = Math.min(...mins);
    const maxP = Math.max(...maxs);
    const range = maxP - minP || 1;
    const vols = data.map((d) => d.volume);
    const maxV = Math.max(...vols) || 1;

    return { minPrice: minP, maxPrice: maxP, priceRange: range, volumes: vols, maxVolume: maxV };
  }, [data]);

  // Calculate Simple Moving Averages (SMA 20 and SMA 50)
  const sma20Values = useMemo(() => {
    return data.map((_, idx) => {
      if (idx < 5) return null;
      const subset = data.slice(Math.max(0, idx - 19), idx + 1);
      const sum = subset.reduce((acc, curr) => acc + curr.close, 0);
      return sum / subset.length;
    });
  }, [data]);

  const sma50Values = useMemo(() => {
    return data.map((_, idx) => {
      if (idx < 10) return null;
      const subset = data.slice(Math.max(0, idx - 49), idx + 1);
      const sum = subset.reduce((acc, curr) => acc + curr.close, 0);
      return sum / subset.length;
    });
  }, [data]);

  // Calculate Relative Strength Index (RSI 14)
  const rsiValues = useMemo(() => {
    const period = 14;
    const rsi: (number | null)[] = [];
    let gains = 0;
    let losses = 0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        rsi.push(50);
        continue;
      }
      const change = data[i].close - data[i - 1].close;
      if (change >= 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }

      if (i < period) {
        rsi.push(50);
      } else {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const val = 100 - 100 / (1 + rs);
        rsi.push(Number(val.toFixed(1)));
        // Adjust sliding window
        const prevChange = data[i - period + 1].close - data[i - period].close;
        if (prevChange >= 0) gains -= prevChange;
        else losses -= Math.abs(prevChange);
      }
    }
    return rsi;
  }, [data]);

  const activeBar = hoveredBarIndex !== null ? data[hoveredBarIndex] : data[data.length - 1];

  const svgWidth = 600;
  const mainChartHeight = 160;
  const volumeChartHeight = 40;
  const rsiChartHeight = showRSI ? 60 : 0;
  const totalSvgHeight = mainChartHeight + volumeChartHeight + rsiChartHeight + 20;

  const getX = (idx: number) => {
    if (data.length <= 1) return 0;
    return (idx / (data.length - 1)) * (svgWidth - 60) + 10;
  };

  const getY = (price: number) => {
    return mainChartHeight - ((price - minPrice) / priceRange) * (mainChartHeight - 20) - 10;
  };

  return (
    <div className="bg-[#10131b] border border-[#2A2E39] rounded-lg p-4 space-y-3 font-mono text-xs">
      {/* Chart Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A2E39] pb-3 select-none">
        {/* Chart Style Switcher */}
        <div className="flex bg-[#1E222D] p-1 rounded border border-[#2A2E39] gap-1">
          <button
            onClick={() => setChartType("candlestick")}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
              chartType === "candlestick" ? "bg-[#2962ff] text-white" : "text-[#c3c5d8] hover:text-[#e0e2ed]"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">candlestick_chart</span>
            Candles
          </button>
          <button
            onClick={() => setChartType("area")}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
              chartType === "area" ? "bg-[#2962ff] text-white" : "text-[#c3c5d8] hover:text-[#e0e2ed]"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">show_chart</span>
            Area
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
              chartType === "line" ? "bg-[#2962ff] text-white" : "text-[#c3c5d8] hover:text-[#e0e2ed]"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">timeline</span>
            Line
          </button>
        </div>

        {/* Technical Indicators Checkboxes */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-[#c3c5d8] hover:text-[#e0e2ed]">
            <input
              type="checkbox"
              checked={showSMA20}
              onChange={(e) => setShowSMA20(e.target.checked)}
              className="accent-[#FFD700]"
            />
            <span className="text-[#FFD700] font-bold">SMA 20</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-[#c3c5d8] hover:text-[#e0e2ed]">
            <input
              type="checkbox"
              checked={showSMA50}
              onChange={(e) => setShowSMA50(e.target.checked)}
              className="accent-[#00E5FF]"
            />
            <span className="text-[#00E5FF] font-bold">SMA 50</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-[#c3c5d8] hover:text-[#e0e2ed]">
            <input
              type="checkbox"
              checked={showRSI}
              onChange={(e) => setShowRSI(e.target.checked)}
              className="accent-[#2962ff]"
            />
            <span className="text-[#b6c4ff] font-bold">RSI (14)</span>
          </label>
        </div>
      </div>

      {/* Active Bar HUD Information Header */}
      {activeBar && (
        <div className="flex flex-wrap items-center justify-between bg-[#1E222D]/60 p-2.5 rounded border border-[#2A2E39] text-[11px]">
          <div className="flex gap-4">
            <span>
              <span className="text-[#8d90a2]">O: </span>
              <span className="text-[#e0e2ed] font-bold">${activeBar.open.toFixed(2)}</span>
            </span>
            <span>
              <span className="text-[#8d90a2]">H: </span>
              <span className="text-[#089981] font-bold">${activeBar.high.toFixed(2)}</span>
            </span>
            <span>
              <span className="text-[#8d90a2]">L: </span>
              <span className="text-[#F23645] font-bold">${activeBar.low.toFixed(2)}</span>
            </span>
            <span>
              <span className="text-[#8d90a2]">C: </span>
              <span className="text-[#e0e2ed] font-bold">${activeBar.close.toFixed(2)}</span>
            </span>
          </div>
          <div className="flex gap-4">
            <span>
              <span className="text-[#8d90a2]">Vol: </span>
              <span className="text-[#b6c4ff]">{(activeBar.volume / 1000000).toFixed(2)}M</span>
            </span>
            {showRSI && hoveredBarIndex !== null && rsiValues[hoveredBarIndex] && (
              <span>
                <span className="text-[#8d90a2]">RSI: </span>
                <span className="text-[#2962ff] font-bold">{rsiValues[hoveredBarIndex]}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Interactive SVG Chart Workspace */}
      <div className="w-full relative overflow-hidden bg-[#0c0f17] border border-[#2A2E39] rounded p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredBarIndex(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDown ? "#F23645" : "#089981"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isDown ? "#F23645" : "#089981"} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
            const y = mainChartHeight * ratio;
            return (
              <line
                key={i}
                x1="0"
                y1={y}
                x2={svgWidth - 50}
                y2={y}
                stroke="#2A2E39"
                strokeDasharray="3,3"
                strokeWidth="0.8"
              />
            );
          })}

          {/* Price Axis Labels on Right */}
          {[minPrice, minPrice + priceRange * 0.5, maxPrice].map((p, idx) => (
            <text
              key={idx}
              x={svgWidth - 45}
              y={mainChartHeight - (idx * (mainChartHeight - 20)) / 2 - 5}
              fill="#8d90a2"
              fontSize="9"
              fontFamily="monospace"
            >
              ${p.toFixed(2)}
            </text>
          ))}

          {/* Area or Line View */}
          {chartType !== "candlestick" && (() => {
            const pointsStr = data
              .map((d, i) => `${getX(i).toFixed(1)},${getY(d.close).toFixed(1)}`)
              .join(" ");

            if (chartType === "area") {
              const areaPath = `${pointsStr} L ${getX(data.length - 1)},${mainChartHeight} L ${getX(0)},${mainChartHeight} Z`;
              return (
                <>
                  <path d={areaPath} fill="url(#areaGradient)" />
                  <polyline points={pointsStr} fill="none" stroke={isDown ? "#F23645" : "#089981"} strokeWidth="2" />
                </>
              );
            }
            return <polyline points={pointsStr} fill="none" stroke="#2962ff" strokeWidth="2" />;
          })()}

          {/* Candlestick Bars */}
          {chartType === "candlestick" &&
            data.map((bar, idx) => {
              const x = getX(idx);
              const yOpen = getY(bar.open);
              const yClose = getY(bar.close);
              const yHigh = getY(bar.high);
              const yLow = getY(bar.low);
              const isBull = bar.close >= bar.open;
              const barColor = isBull ? "#089981" : "#F23645";

              const candleHeight = Math.max(2, Math.abs(yClose - yOpen));
              const candleY = Math.min(yOpen, yClose);

              return (
                <g key={idx}>
                  {/* High/Low Wick Line */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={barColor} strokeWidth="1.2" />
                  {/* Open/Close Body Rectangle */}
                  <rect
                    x={x - 3}
                    y={candleY}
                    width="6"
                    height={candleHeight}
                    fill={barColor}
                    rx="0.5"
                  />
                </g>
              );
            })}

          {/* SMA 20 Overlay Line */}
          {showSMA20 && (() => {
            const pts = sma20Values
              .map((val, idx) => (val !== null ? `${getX(idx).toFixed(1)},${getY(val).toFixed(1)}` : null))
              .filter(Boolean)
              .join(" ");

            return <polyline points={pts} fill="none" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="4,2" />;
          })()}

          {/* SMA 50 Overlay Line */}
          {showSMA50 && (() => {
            const pts = sma50Values
              .map((val, idx) => (val !== null ? `${getX(idx).toFixed(1)},${getY(val).toFixed(1)}` : null))
              .filter(Boolean)
              .join(" ");

            return <polyline points={pts} fill="none" stroke="#00E5FF" strokeWidth="1.5" />;
          })()}

          {/* Volume Histogram Chart (Bottom Pane) */}
          <g transform={`translate(0, ${mainChartHeight + 5})`}>
            <line x1="0" y1="0" x2={svgWidth - 50} y2="0" stroke="#2A2E39" strokeWidth="1" />
            {data.map((bar, idx) => {
              const x = getX(idx);
              const vHeight = (bar.volume / maxVolume) * (volumeChartHeight - 5);
              const isBull = bar.close >= bar.open;
              return (
                <rect
                  key={idx}
                  x={x - 2.5}
                  y={volumeChartHeight - vHeight}
                  width="5"
                  height={vHeight}
                  fill={isBull ? "#089981" : "#F23645"}
                  opacity="0.4"
                />
              );
            })}
          </g>

          {/* RSI Pane (If Enabled) */}
          {showRSI && (
            <g transform={`translate(0, ${mainChartHeight + volumeChartHeight + 10})`}>
              <line x1="0" y1="0" x2={svgWidth - 50} y2="0" stroke="#2A2E39" strokeWidth="1" />
              {/* Overbought 70 & Oversold 30 Lines */}
              <line
                x1="0"
                y1={rsiChartHeight * 0.3}
                x2={svgWidth - 50}
                y2={rsiChartHeight * 0.3}
                stroke="#F23645"
                strokeDasharray="2,2"
                strokeWidth="0.8"
              />
              <line
                x1="0"
                y1={rsiChartHeight * 0.7}
                x2={svgWidth - 50}
                y2={rsiChartHeight * 0.7}
                stroke="#089981"
                strokeDasharray="2,2"
                strokeWidth="0.8"
              />
              <text x={svgWidth - 45} y={rsiChartHeight * 0.3 + 3} fill="#F23645" fontSize="8">
                70 OB
              </text>
              <text x={svgWidth - 45} y={rsiChartHeight * 0.7 + 3} fill="#089981" fontSize="8">
                30 OS
              </text>

              {/* RSI Polyline */}
              {(() => {
                const pts = rsiValues
                  .map((val, idx) => {
                    if (val === null) return null;
                    const rsiY = rsiChartHeight - (val / 100) * rsiChartHeight;
                    return `${getX(idx).toFixed(1)},${rsiY.toFixed(1)}`;
                  })
                  .filter(Boolean)
                  .join(" ");

                return <polyline points={pts} fill="none" stroke="#2962ff" strokeWidth="1.5" />;
              })()}
            </g>
          )}

          {/* Interactive Mouse Hover Crosshair Overlay */}
          {data.map((_, idx) => {
            const x = getX(idx);
            return (
              <rect
                key={idx}
                x={x - 10}
                y="0"
                width="20"
                height={totalSvgHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredBarIndex(idx)}
              />
            );
          })}

          {/* Crosshair Highlight Line */}
          {hoveredBarIndex !== null && (() => {
            const x = getX(hoveredBarIndex);
            const y = getY(data[hoveredBarIndex].close);
            return (
              <g pointerEvents="none">
                <line x1={x} y1="0" x2={x} y2={totalSvgHeight} stroke="#2962ff" strokeDasharray="3,3" strokeWidth="1" />
                <line x1="0" y1={y} x2={svgWidth - 50} y2={y} stroke="#2962ff" strokeDasharray="3,3" strokeWidth="1" />
                <circle cx={x} cy={y} r="4" fill="#2962ff" stroke="#ffffff" strokeWidth="1.5" />
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};
