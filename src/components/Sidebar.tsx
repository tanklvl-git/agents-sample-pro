import React from "react";
import { SidebarTab } from "../types";

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  watchlistCount: number;
  alertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  alertsCount,
}) => {
  const topButtons: { id: SidebarTab; icon: string; title: string; badge?: number }[] = [
    { id: "watchlist", icon: "list_alt", title: "Watchlist", badge: watchlistCount },
    { id: "paper_trading", icon: "account_balance_wallet", title: "Paper Trading Terminal" },
    { id: "data_window", icon: "grid_view", title: "Markets Overview" },
    { id: "screener", icon: "filter_alt", title: "Stock Screener" },
    { id: "heatmap", icon: "view_compact", title: "S&P 500 Heatmap" },
    { id: "calendar", icon: "calendar_today", title: "Economic Calendar" },
    { id: "ideas", icon: "lightbulb", title: "AI Ideas & Intelligence" },
  ];

  const bottomButtons: { id: SidebarTab; icon: string; title: string }[] = [
    { id: "help", icon: "help", title: "Help & Shortcuts" },
    { id: "settings", icon: "settings", title: "Settings" },
  ];

  return (
    <aside className="hidden md:flex bg-[#1E222D] text-[#b6c4ff] flex-col items-center py-2 gap-4 h-[calc(100vh-48px)] w-[52px] border-r border-[#2A2E39] sticky top-[48px] shrink-0 z-40">
      {/* Top Icons */}
      <div className="flex flex-col gap-1 w-full pt-1">
        {topButtons.map((btn) => {
          const isActive = activeTab === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              title={btn.title}
              className={`w-full aspect-square flex flex-col items-center justify-center transition-all duration-150 relative group cursor-pointer ${
                isActive
                  ? "text-[#2962ff] border-l-2 border-[#2962ff] bg-[#2962ff]/10"
                  : "text-[#c3c5d8] hover:bg-[#31353d]/40 hover:text-[#e0e2ed]"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {btn.icon}
              </span>
              {btn.badge !== undefined && btn.badge > 0 && (
                <span className="absolute top-1 right-1 bg-[#2962ff] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {btn.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Utility Icons */}
      <div className="mt-auto flex flex-col gap-1 w-full pb-2">
        {bottomButtons.map((btn) => {
          const isActive = activeTab === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              title={btn.title}
              className={`w-full aspect-square flex flex-col items-center justify-center transition-all duration-150 relative group cursor-pointer ${
                isActive
                  ? "text-[#2962ff] border-l-2 border-[#2962ff] bg-[#2962ff]/10"
                  : "text-[#c3c5d8] hover:bg-[#31353d]/40 hover:text-[#e0e2ed]"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {btn.icon}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
