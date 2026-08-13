import React from "react";
import { TopNavTab } from "../types";

interface HeaderProps {
  activeTab: TopNavTab;
  setActiveTab: (tab: TopNavTab) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: (live: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenSettings,
  onOpenNotifications,
  isLiveStreaming,
  setIsLiveStreaming,
}) => {
  const tabs: TopNavTab[] = ["Markets", "Screener", "Heatmap", "News", "Brokers"];

  return (
    <header className="bg-[#131722] text-[#b6c4ff] font-sans text-sm flex justify-between items-center w-full px-4 h-[48px] border-b border-[#2A2E39] sticky top-0 z-50">
      {/* Brand & Search */}
      <div className="flex items-center gap-6">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("Markets");
          }}
          className="text-lg font-bold text-[#e0e2ed] flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[#2962ff]">
            waterfall_chart
          </span>
          MarketPulse Pro
        </a>

        {/* Global Search Bar */}
        <button
          onClick={onOpenSearch}
          className="relative hidden md:flex items-center bg-[#1E222D] border border-[#2A2E39] text-[#e0e2ed] rounded-full pl-9 pr-4 py-1.5 text-xs hover:border-[#434656] w-[220px] transition-colors cursor-pointer text-left"
        >
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c3c5d8] text-[18px]">
            search
          </span>
          <span className="text-[#c3c5d8]">Search (Ctrl+K)</span>
        </button>
      </div>

      {/* Primary Top Navigation Tabs */}
      <nav className="hidden md:flex items-center h-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 h-full flex items-center font-medium transition-colors duration-200 border-b-2 cursor-pointer ${
                isActive
                  ? "text-[#b6c4ff] border-[#2962ff]"
                  : "text-[#c3c5d8] border-transparent hover:text-[#e0e2ed] hover:bg-[#31353d]/20"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Right Action Tools & Live Ticker */}
      <div className="flex items-center gap-3">
        {/* Live Ticker Toggle */}
        <button
          onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          title={isLiveStreaming ? "Pause Live Updates" : "Resume Live Updates"}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
            isLiveStreaming
              ? "bg-[#089981]/15 text-[#089981] border-[#089981]/40"
              : "bg-[#31353d]/40 text-[#c3c5d8] border-[#2A2E39]"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveStreaming ? "bg-[#089981] animate-ping" : "bg-[#8d90a2]"
            }`}
          />
          <span className="hidden sm:inline">
            {isLiveStreaming ? "LIVE" : "PAUSED"}
          </span>
        </button>

        {/* Icons */}
        <div className="flex gap-1 items-center">
          <button
            onClick={onOpenNotifications}
            className="text-[#c3c5d8] hover:text-[#e0e2ed] transition-colors p-1.5 rounded-full hover:bg-[#31353d]/40 relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#2962ff] rounded-full" />
          </button>

          <button
            onClick={onOpenSettings}
            className="text-[#c3c5d8] hover:text-[#e0e2ed] transition-colors p-1.5 rounded-full hover:bg-[#31353d]/40"
            title="Settings"
          >
            <span className="material-symbols-outlined text-[20px]">
              settings
            </span>
          </button>
        </div>

        {/* Pro Trading Desk */}
        <button
          onClick={onOpenSettings}
          className="bg-[#2962ff] hover:bg-[#004ee8] text-[#f7f5ff] px-4 py-1.5 rounded-full font-semibold transition-colors text-xs shadow-sm cursor-pointer"
        >
          Pro Terminal
        </button>
      </div>
    </header>
  );
};
