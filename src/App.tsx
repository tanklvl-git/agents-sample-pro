import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { TickerTape } from "./components/TickerTape";
import { IndicesSection } from "./components/IndicesSection";
import { UsStocksSection } from "./components/UsStocksSection";
import { MarketMoversSection } from "./components/MarketMoversSection";
import { StockDetailModal } from "./components/StockDetailModal";
import { SearchModal } from "./components/SearchModal";
import { WatchlistDrawer } from "./components/WatchlistDrawer";
import { CalendarView } from "./components/CalendarView";
import { NewsView } from "./components/NewsView";
import { GeminiMarketAnalyst } from "./components/GeminiMarketAnalyst";
import { SettingsModal } from "./components/SettingsModal";
import { StockScreener } from "./components/StockScreener";
import { MarketHeatmap } from "./components/MarketHeatmap";
import { TradeOrderTicket } from "./components/TradeOrderTicket";

import {
  INITIAL_INDICES,
  INITIAL_STOCKS,
  MARKET_MOVERS,
  NEWS_ARTICLES,
  ECONOMIC_CALENDAR,
  FEATURED_BROKERS,
  TICKER_TAPE_ITEMS,
} from "./data/marketData";

import {
  StockItem,
  IndexItem,
  SidebarTab,
  TopNavTab,
  PriceAlert,
  PaperPosition,
} from "./types";

export default function App() {
  // Application Data States
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [indices, setIndices] = useState<IndexItem[]>(INITIAL_INDICES);
  const [marketCategory, setMarketCategory] = useState<string>("US Markets");

  // Navigation & Drawer States
  const [topNavTab, setTopNavTab] = useState<TopNavTab>("Markets");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("data_window");

  // Selection Modals & Drawers
  const [selectedItem, setSelectedItem] = useState<StockItem | IndexItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAllMoversOpen, setIsAllMoversOpen] = useState<boolean>(false);

  // User Preferences & Live Ticker
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(true);
  const [currency, setCurrency] = useState<string>("USD");

  // Persistent Watchlist, Alerts & Paper Trading Portfolio
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    const saved = localStorage.getItem("marketpulse_watchlist");
    return saved ? JSON.parse(saved) : ["NVDA", "AAPL", "MSFT"];
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [cashBalance, setCashBalance] = useState<number>(100000.0);
  const [paperPositions, setPaperPositions] = useState<PaperPosition[]>([]);

  // Sync Watchlist to localStorage
  useEffect(() => {
    localStorage.setItem("marketpulse_watchlist", JSON.stringify(watchlistSymbols));
  }, [watchlistSymbols]);

  // Global Keyboard Shortcut Listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Live Price Ticker Simulation Engine & Paper Trading PnL Update
  useEffect(() => {
    if (!isLiveStreaming || !isMarketOpen) return;

    const interval = setInterval(() => {
      // Simulate small price changes for stocks
      setStocks((prev) =>
        prev.map((stock) => {
          const deltaPct = (Math.random() - 0.49) * 0.4;
          const newPrice = Math.max(1, stock.price * (1 + deltaPct / 100));
          const newChange = newPrice - stock.previousClose;
          const newChangePct = (newChange / stock.previousClose) * 100;

          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            change: Number(newChange.toFixed(2)),
            changePercent: Number(newChangePct.toFixed(2)),
            isUp: newChangePct >= 0,
            history: stock.history.map((bar, i) =>
              i === stock.history.length - 1
                ? { ...bar, close: Number(newPrice.toFixed(2)), high: Math.max(bar.high, newPrice), low: Math.min(bar.low, newPrice) }
                : bar
            ),
          };
        })
      );

      // Simulate small price changes for indices
      setIndices((prev) =>
        prev.map((idx) => {
          const deltaPct = (Math.random() - 0.49) * 0.2;
          const newPrice = Math.max(1, idx.price * (1 + deltaPct / 100));
          const newChangePct = idx.changePercent + deltaPct * 0.1;

          return {
            ...idx,
            price: Number(newPrice.toFixed(2)),
            changePercent: Number(newChangePct.toFixed(2)),
            isUp: newChangePct >= 0,
          };
        })
      );

      // Update Paper Positions P&L
      setPaperPositions((prev) =>
        prev.map((pos) => {
          const matchStock = stocks.find((s) => s.symbol === pos.symbol);
          if (!matchStock) return pos;
          const currentP = matchStock.price;
          const diff = pos.type === "BUY" ? currentP - pos.entryPrice : pos.entryPrice - currentP;
          const pnl = diff * pos.shares;
          const pnlPercent = (diff / pos.entryPrice) * 100;

          return {
            ...pos,
            currentPrice: currentP,
            pnl: Number(pnl.toFixed(2)),
            pnlPercent: Number(pnlPercent.toFixed(2)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, isMarketOpen, stocks]);

  // Handlers for Watchlist
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Handlers for Price Alerts
  const handleSetAlert = (symbol: string, targetPrice: number) => {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbol,
      targetPrice,
      condition: targetPrice > 200 ? "ABOVE" : "BELOW",
      createdAt: new Date().toLocaleTimeString(),
      active: true,
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
  };

  const handleSelectSymbolByName = (symbol: string) => {
    const foundStock = stocks.find((s) => s.symbol === symbol);
    if (foundStock) {
      setSelectedItem(foundStock);
      return;
    }
    const foundIndex = indices.find((i) => i.symbol === symbol);
    if (foundIndex) {
      setSelectedItem(foundIndex);
    }
  };

  const handleExecutePaperOrder = (newPosition: PaperPosition) => {
    setPaperPositions((prev) => [newPosition, ...prev]);
  };

  const handleClosePaperPosition = (id: string) => {
    setPaperPositions((prev) => {
      const pos = prev.find((p) => p.id === id);
      if (pos) {
        setCashBalance((c) => c + pos.pnl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col bg-[#10131b] text-[#e0e2ed]">
      {/* Top Real-time Ticker Tape */}
      <TickerTape items={TICKER_TAPE_ITEMS} onSelectItem={handleSelectSymbolByName} />

      {/* Primary Navigation Header */}
      <Header
        activeTab={topNavTab}
        setActiveTab={(tab) => {
          setTopNavTab(tab);
          if (tab === "Screener") setSidebarTab("screener");
          if (tab === "Heatmap") setSidebarTab("heatmap");
          if (tab === "Markets") setSidebarTab("data_window");
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isLiveStreaming={isLiveStreaming}
        setIsLiveStreaming={setIsLiveStreaming}
      />

      {/* Notifications Popover Dropdown */}
      {isNotificationsOpen && (
        <div className="fixed top-16 right-12 z-50 w-80 bg-[#1E222D] border border-[#2A2E39] rounded-lg shadow-2xl p-4 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex justify-between items-center border-b border-[#2A2E39] pb-2 font-bold text-[#e0e2ed]">
            <span>Notifications & Terminal Alerts</span>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="text-[#c3c5d8] hover:text-[#e0e2ed]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <div className="p-2 bg-[#10131b] border border-[#2A2E39] rounded">
              <span className="text-[#089981] font-bold block mb-0.5">Bullish Surge Alert</span>
              NVIDIA (NVDA) crossed $118.00 (+4.38%) on institutional volume.
            </div>
            <div className="p-2 bg-[#10131b] border border-[#2A2E39] rounded">
              <span className="text-[#2962ff] font-bold block mb-0.5">Macro Release</span>
              US CPI MoM came in at 0.2%, matching consensus expectations.
            </div>
            {priceAlerts.map((a) => (
              <div key={a.id} className="p-2 bg-[#10131b] border border-[#2A2E39] rounded flex justify-between">
                <span>Alert set for {a.symbol} at ${a.targetPrice.toFixed(2)}</span>
                <span className="text-[#089981] font-mono">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Container Shell */}
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-[1920px] mx-auto relative">
        {/* Left Side Toolbar Navigation */}
        <Sidebar
          activeTab={sidebarTab}
          setActiveTab={(tab) => {
            setSidebarTab(tab);
            if (tab === "screener") setTopNavTab("Screener");
            if (tab === "heatmap") setTopNavTab("Heatmap");
            if (tab === "data_window") setTopNavTab("Markets");
          }}
          watchlistCount={watchlistSymbols.length}
          alertsCount={priceAlerts.length}
        />

        {/* Main Content Workspace */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto min-h-[calc(100vh-80px)]">
          {/* VIEW SWITCHING */}

          {topNavTab === "News" ? (
            <NewsView
              articles={NEWS_ARTICLES}
              onSelectSymbol={handleSelectSymbolByName}
            />
          ) : topNavTab === "Brokers" ? (
            <div className="bg-[#1E222D] border border-[#2A2E39] rounded p-6 space-y-6">
              <h2 className="text-xl font-bold text-[#e0e2ed] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2962ff]">partner_exchange</span>
                Verified Institutional Market Brokers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FEATURED_BROKERS.map((b) => (
                  <div key={b.id} className="bg-[#10131b] border border-[#2A2E39] p-5 rounded space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-base text-[#e0e2ed]">{b.name}</h3>
                      {b.badge && (
                        <span className="bg-[#2962ff]/15 text-[#b6c4ff] border border-[#2962ff]/30 text-[10px] font-bold px-2 py-0.5 rounded">
                          {b.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#c3c5d8] space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span>Min Deposit:</span>
                        <span className="text-[#e0e2ed] font-bold">{b.minDeposit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Spread:</span>
                        <span className="text-[#e0e2ed]">{b.spread}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Leverage:</span>
                        <span className="text-[#e0e2ed]">{b.leverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Regulation:</span>
                        <span className="text-[#089981]">{b.regulation}</span>
                      </div>
                    </div>
                    <button className="w-full bg-[#2962ff] hover:bg-[#004ee8] text-white py-1.5 rounded text-xs font-bold transition-colors cursor-pointer mt-3">
                      Visit Broker
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : sidebarTab === "watchlist" ? (
            <WatchlistDrawer
              watchlistSymbols={watchlistSymbols}
              stocks={stocks}
              onRemoveFromWatchlist={handleToggleWatchlist}
              onSelectStock={setSelectedItem}
              onClose={() => setSidebarTab("data_window")}
            />
          ) : sidebarTab === "paper_trading" ? (
            <TradeOrderTicket
              stocks={stocks}
              positions={paperPositions}
              onExecuteOrder={handleExecutePaperOrder}
              onClosePosition={handleClosePaperPosition}
              cashBalance={cashBalance}
            />
          ) : sidebarTab === "screener" ? (
            <StockScreener stocks={stocks} onSelectStock={setSelectedItem} />
          ) : sidebarTab === "heatmap" ? (
            <MarketHeatmap stocks={stocks} onSelectStock={setSelectedItem} />
          ) : sidebarTab === "calendar" ? (
            <CalendarView events={ECONOMIC_CALENDAR} />
          ) : sidebarTab === "ideas" ? (
            <GeminiMarketAnalyst />
          ) : (
            /* PRIMARY DASHBOARD VIEW ("Markets, everywhere") */
            <>
              {/* Page Header */}
              <div className="flex items-center gap-2 mb-8 select-none">
                <h1 className="text-3xl font-bold text-[#e0e2ed] tracking-tight">
                  Markets, everywhere
                </h1>
                <div className="relative group">
                  <button
                    onClick={() => {
                      const next =
                        marketCategory === "US Markets"
                          ? "Global Indices"
                          : marketCategory === "Global Indices"
                          ? "Crypto"
                          : "US Markets";
                      setMarketCategory(next);
                    }}
                    title="Switch Market Scope"
                    className="text-[#c3c5d8] hover:text-[#e0e2ed] transition-colors mt-1 cursor-pointer flex items-center"
                  >
                    <span className="material-symbols-outlined text-[32px] font-bold">
                      expand_more
                    </span>
                  </button>
                </div>
              </div>

              {/* Bento Grid Layout for Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
                {/* INDICES SECTION */}
                <IndicesSection
                  indices={indices}
                  onSelectIndex={setSelectedItem}
                  onExpandAll={() => setIsSearchOpen(true)}
                />

                {/* US STOCKS (Bento Box) */}
                <UsStocksSection
                  stocks={stocks}
                  onSelectStock={setSelectedItem}
                  onExpandStocks={() => setIsSearchOpen(true)}
                  isMarketOpen={isMarketOpen}
                  onToggleMarketOpen={() => setIsMarketOpen(!isMarketOpen)}
                />

                {/* MARKET MOVERS (Tabs / Tables) */}
                <MarketMoversSection
                  movers={MARKET_MOVERS}
                  onSelectMoverSymbol={handleSelectSymbolByName}
                  onSeeAll={() => setIsAllMoversOpen(true)}
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* MODALS AND DRAWERS */}

      {/* Stock / Index Detail Modal */}
      {selectedItem && (
        <StockDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isInWatchlist={watchlistSymbols.includes(selectedItem.symbol)}
          onToggleWatchlist={handleToggleWatchlist}
          onSetAlert={handleSetAlert}
        />
      )}

      {/* Ctrl+K Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stocks={stocks}
        indices={indices}
        onSelectItem={setSelectedItem}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isLiveStreaming={isLiveStreaming}
        setIsLiveStreaming={setIsLiveStreaming}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* See All Actively Traded Modal */}
      {isAllMoversOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#2A2E39] pb-3">
              <h2 className="text-lg font-bold text-[#e0e2ed]">Actively Traded Market Movers</h2>
              <button
                onClick={() => setIsAllMoversOpen(false)}
                className="text-[#c3c5d8] hover:text-[#e0e2ed]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#2A2E39] text-[#c3c5d8] uppercase tracking-wider font-bold h-8">
                  <th className="py-2">Symbol</th>
                  <th className="py-2">Company</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Volume</th>
                  <th className="py-2 text-right">Change %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2E39]">
                {MARKET_MOVERS.map((m) => (
                  <tr
                    key={`${m.symbol}-${m.category}`}
                    onClick={() => {
                      handleSelectSymbolByName(m.symbol);
                      setIsAllMoversOpen(false);
                    }}
                    className="hover:bg-[#31353d]/30 cursor-pointer h-10"
                  >
                    <td className="py-2 font-mono font-bold text-[#e0e2ed]">{m.symbol}</td>
                    <td className="py-2 text-[#c3c5d8]">{m.name}</td>
                    <td className="py-2 text-right font-mono text-[#e0e2ed]">{m.price}</td>
                    <td className="py-2 text-right font-mono text-[#c3c5d8]">{m.volume}</td>
                    <td className="py-2 text-right font-mono">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          m.changePercent < 0
                            ? "bg-[#F23645]/15 text-[#F23645]"
                            : m.changePercent > 0
                            ? "bg-[#089981]/15 text-[#089981]"
                            : "bg-[#31353d] text-[#c3c5d8]"
                        }`}
                      >
                        {m.changePercent > 0 ? `+${m.changePercent}%` : `${m.changePercent}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
