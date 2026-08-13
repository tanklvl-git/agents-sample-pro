import React, { useState, useEffect } from "react";

interface OrderBookProps {
  currentPrice: number;
  symbol: string;
}

interface OrderRow {
  price: number;
  size: number;
  total: number;
}

export const OrderBook: React.FC<OrderBookProps> = ({ currentPrice, symbol }) => {
  const [bids, setBids] = useState<OrderRow[]>([]);
  const [asks, setAsks] = useState<OrderRow[]>([]);

  // Generate synthetic Level 2 order book depth based on current price
  useEffect(() => {
    const generateBook = () => {
      const newAsks: OrderRow[] = [];
      const newBids: OrderRow[] = [];

      let cumulativeAskTotal = 0;
      for (let i = 5; i >= 1; i--) {
        const price = Number((currentPrice + i * 0.05).toFixed(2));
        const size = Math.floor(100 + Math.random() * 850);
        cumulativeAskTotal += size;
        newAsks.push({ price, size, total: cumulativeAskTotal });
      }

      let cumulativeBidTotal = 0;
      for (let i = 1; i <= 5; i++) {
        const price = Number((currentPrice - i * 0.05).toFixed(2));
        const size = Math.floor(100 + Math.random() * 850);
        cumulativeBidTotal += size;
        newBids.push({ price, size, total: cumulativeBidTotal });
      }

      setAsks(newAsks);
      setBids(newBids);
    };

    generateBook();
    const timer = setInterval(generateBook, 2500);
    return () => clearInterval(timer);
  }, [currentPrice]);

  const maxTotal = Math.max(
    asks[0]?.total || 1,
    bids[bids.length - 1]?.total || 1,
    1000
  );

  return (
    <div className="bg-[#10131b] border border-[#2A2E39] rounded p-3 font-mono text-[11px] space-y-2 select-none">
      <div className="flex justify-between items-center border-b border-[#2A2E39] pb-1.5 text-xs font-bold text-[#e0e2ed]">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#2962ff]">table_rows</span>
          Level 2 Depth ({symbol})
        </span>
        <span className="text-[10px] text-[#089981] bg-[#089981]/10 border border-[#089981]/30 px-1.5 py-0.5 rounded font-sans">
          LIVE FEED
        </span>
      </div>

      <div className="grid grid-cols-3 text-[10px] font-bold text-[#c3c5d8] border-b border-[#2A2E39]/50 pb-1">
        <span>PRICE ($)</span>
        <text className="text-right">SIZE</text>
        <text className="text-right">DEPTH</text>
      </div>

      {/* Asks (Sell Side - Red) */}
      <div className="space-y-0.5">
        {asks.map((ask, idx) => {
          const depthPct = Math.min(100, (ask.total / maxTotal) * 100);
          return (
            <div key={`ask-${idx}`} className="relative flex justify-between h-5 items-center px-1">
              <div
                className="absolute right-0 top-0 bottom-0 bg-[#F23645]/15 pointer-events-none rounded-l"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-[#F23645] font-bold z-10">{ask.price.toFixed(2)}</span>
              <span className="text-[#e0e2ed] text-right z-10">{ask.size}</span>
              <span className="text-[#c3c5d8] text-right z-10">{ask.total}</span>
            </div>
          );
        })}
      </div>

      {/* Spread Mid Price */}
      <div className="my-1 py-1.5 bg-[#1E222D] border-y border-[#2A2E39] text-center font-bold text-xs text-[#e0e2ed] flex justify-between px-2">
        <span className="text-[#c3c5d8]">Spread: $0.05</span>
        <span className="text-[#2962ff] font-bold">${currentPrice.toFixed(2)}</span>
      </div>

      {/* Bids (Buy Side - Green) */}
      <div className="space-y-0.5">
        {bids.map((bid, idx) => {
          const depthPct = Math.min(100, (bid.total / maxTotal) * 100);
          return (
            <div key={`bid-${idx}`} className="relative flex justify-between h-5 items-center px-1">
              <div
                className="absolute right-0 top-0 bottom-0 bg-[#089981]/15 pointer-events-none rounded-l"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-[#089981] font-bold z-10">{bid.price.toFixed(2)}</span>
              <span className="text-[#e0e2ed] text-right z-10">{bid.size}</span>
              <span className="text-[#c3c5d8] text-right z-10">{bid.total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
