import React, { useState } from "react";
import { PaperPosition, StockItem } from "../types";

interface TradeOrderTicketProps {
  stocks: StockItem[];
  positions: PaperPosition[];
  onExecuteOrder: (position: PaperPosition) => void;
  onClosePosition: (id: string) => void;
  cashBalance: number;
}

export const TradeOrderTicket: React.FC<TradeOrderTicketProps> = ({
  stocks,
  positions,
  onExecuteOrder,
  onClosePosition,
  cashBalance,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(stocks[0]?.symbol || "NVDA");
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [shares, setShares] = useState<number>(10);
  const [leverage, setLeverage] = useState<number>(1);
  const [useStopLoss, setUseStopLoss] = useState<boolean>(true);
  const [useTakeProfit, setUseTakeProfit] = useState<boolean>(true);

  const activeStock = stocks.find((s) => s.symbol === selectedSymbol) || stocks[0];
  const currentPrice = activeStock?.price || 100;

  const totalValue = shares * currentPrice;
  const marginRequired = totalValue / leverage;

  const stopLossPrice = orderType === "BUY" ? currentPrice * 0.95 : currentPrice * 1.05;
  const takeProfitPrice = orderType === "BUY" ? currentPrice * 1.10 : currentPrice * 0.90;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (shares <= 0) return;

    const newPosition: PaperPosition = {
      id: `pos-${Date.now()}`,
      symbol: selectedSymbol,
      type: orderType,
      shares,
      entryPrice: currentPrice,
      currentPrice,
      pnl: 0,
      pnlPercent: 0,
      stopLoss: useStopLoss ? Number(stopLossPrice.toFixed(2)) : undefined,
      takeProfit: useTakeProfit ? Number(takeProfitPrice.toFixed(2)) : undefined,
      timestamp: new Date().toLocaleTimeString(),
    };

    onExecuteOrder(newPosition);
  };

  const totalUnrealizedPnl = positions.reduce((acc, pos) => acc + pos.pnl, 0);

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded p-6 shadow-sm space-y-6">
      {/* Account Overview Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2E39] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#e0e2ed] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2962ff]">account_balance_wallet</span>
            Pro Paper Trading Desk
          </h2>
          <p className="text-xs text-[#c3c5d8] mt-1">
            Simulate live market orders, stop-loss protection, and margin leverage in real-time.
          </p>
        </div>

        <div className="flex gap-4 font-mono text-xs">
          <div className="bg-[#10131b] border border-[#2A2E39] p-3 rounded text-right">
            <span className="text-[#8d90a2] block uppercase text-[10px] font-bold">Account Equity</span>
            <span className="text-[#e0e2ed] text-base font-bold">${(cashBalance + totalUnrealizedPnl).toFixed(2)}</span>
          </div>
          <div className="bg-[#10131b] border border-[#2A2E39] p-3 rounded text-right">
            <span className="text-[#8d90a2] block uppercase text-[10px] font-bold">Open P&L</span>
            <span className={`text-base font-bold ${totalUnrealizedPnl >= 0 ? "text-[#089981]" : "text-[#F23645]"}`}>
              {totalUnrealizedPnl >= 0 ? `+$${totalUnrealizedPnl.toFixed(2)}` : `-$${Math.abs(totalUnrealizedPnl).toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Ticket Panel */}
        <form onSubmit={handlePlaceOrder} className="bg-[#10131b] border border-[#2A2E39] p-4 rounded space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-[#2A2E39] pb-2 font-bold text-[#e0e2ed]">
            <span>Order Entry Ticket</span>
            <span className="text-[#2962ff]">{selectedSymbol}</span>
          </div>

          {/* Asset Selector */}
          <div>
            <label className="text-[#8d90a2] block mb-1 uppercase font-bold text-[10px]">Select Ticker</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full bg-[#1E222D] border border-[#2A2E39] text-[#e0e2ed] p-2 rounded focus:outline-none focus:border-[#2962ff]"
            >
              {stocks.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} - ${s.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Side Switcher (Buy / Sell) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOrderType("BUY")}
              className={`py-2 rounded font-bold cursor-pointer transition-colors ${
                orderType === "BUY" ? "bg-[#089981] text-white" : "bg-[#1E222D] text-[#c3c5d8] border border-[#2A2E39]"
              }`}
            >
              BUY / LONG
            </button>
            <button
              type="button"
              onClick={() => setOrderType("SELL")}
              className={`py-2 rounded font-bold cursor-pointer transition-colors ${
                orderType === "SELL" ? "bg-[#F23645] text-white" : "bg-[#1E222D] text-[#c3c5d8] border border-[#2A2E39]"
              }`}
            >
              SELL / SHORT
            </button>
          </div>

          {/* Quantity Shares & Leverage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#8d90a2] block mb-1 uppercase font-bold text-[10px]">Quantity Shares</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={shares}
                onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#1E222D] border border-[#2A2E39] text-[#e0e2ed] p-2 rounded focus:outline-none focus:border-[#2962ff]"
              />
            </div>
            <div>
              <label className="text-[#8d90a2] block mb-1 uppercase font-bold text-[10px]">Leverage ({leverage}x)</label>
              <select
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full bg-[#1E222D] border border-[#2A2E39] text-[#e0e2ed] p-2 rounded focus:outline-none focus:border-[#2962ff]"
              >
                <option value={1}>1x (Cash)</option>
                <option value={2}>2x Margin</option>
                <option value={5}>5x Margin</option>
                <option value={10}>10x High Margin</option>
              </select>
            </div>
          </div>

          {/* Risk Management (Stop Loss / Take Profit) */}
          <div className="space-y-2 pt-2 border-t border-[#2A2E39]">
            <label className="flex items-center justify-between text-[#c3c5d8] cursor-pointer">
              <span>Auto Stop Loss (-5%)</span>
              <input
                type="checkbox"
                checked={useStopLoss}
                onChange={(e) => setUseStopLoss(e.target.checked)}
                className="accent-[#F23645]"
              />
            </label>
            <label className="flex items-center justify-between text-[#c3c5d8] cursor-pointer">
              <span>Auto Take Profit (+10%)</span>
              <input
                type="checkbox"
                checked={useTakeProfit}
                onChange={(e) => setUseTakeProfit(e.target.checked)}
                className="accent-[#089981]"
              />
            </label>
          </div>

          {/* Order Summary Breakdown */}
          <div className="bg-[#1E222D] p-3 rounded space-y-1 text-[11px] text-[#c3c5d8]">
            <div className="flex justify-between">
              <span>Notional Value:</span>
              <span className="text-[#e0e2ed] font-bold">${totalValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Margin Required:</span>
              <span className="text-[#2962ff] font-bold">${marginRequired.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded font-bold text-white transition-colors cursor-pointer ${
              orderType === "BUY" ? "bg-[#089981] hover:bg-[#067a67]" : "bg-[#F23645] hover:bg-[#c92a37]"
            }`}
          >
            Execute {orderType} Order ({shares} {selectedSymbol})
          </button>
        </form>

        {/* Active Open Positions Desk */}
        <div className="lg:col-span-2 bg-[#10131b] border border-[#2A2E39] p-4 rounded space-y-4">
          <div className="flex justify-between items-center border-b border-[#2A2E39] pb-2 font-bold text-xs text-[#e0e2ed]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#2962ff]">list_alt</span>
              Active Positions ({positions.length})
            </span>
          </div>

          {positions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2A2E39] text-[#c3c5d8] uppercase tracking-wider h-8">
                    <th className="py-2">Symbol</th>
                    <th className="py-2">Side</th>
                    <th className="py-2 text-right">Shares</th>
                    <th className="py-2 text-right">Entry</th>
                    <th className="py-2 text-right">Current</th>
                    <th className="py-2 text-right">P&L ($)</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2E39]">
                  {positions.map((pos) => {
                    const isWin = pos.pnl >= 0;
                    return (
                      <tr key={pos.id} className="hover:bg-[#31353d]/30 h-10">
                        <td className="py-2 font-bold text-[#e0e2ed]">{pos.symbol}</td>
                        <td className="py-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              pos.type === "BUY" ? "bg-[#089981]/15 text-[#089981]" : "bg-[#F23645]/15 text-[#F23645]"
                            }`}
                          >
                            {pos.type}
                          </span>
                        </td>
                        <td className="py-2 text-right text-[#e0e2ed]">{pos.shares}</td>
                        <td className="py-2 text-right text-[#c3c5d8]">${pos.entryPrice.toFixed(2)}</td>
                        <td className="py-2 text-right text-[#e0e2ed]">${pos.currentPrice.toFixed(2)}</td>
                        <td className={`py-2 text-right font-bold ${isWin ? "text-[#089981]" : "text-[#F23645]"}`}>
                          {isWin ? `+$${pos.pnl.toFixed(2)}` : `-$${Math.abs(pos.pnl).toFixed(2)}`}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => onClosePosition(pos.id)}
                            className="bg-[#31353d] hover:bg-[#F23645] text-white text-[10px] px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#c3c5d8] space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#434656] block">show_chart</span>
              <p>No open positions. Use the Order Ticket to launch your first paper position!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
