import React from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: (val: boolean) => void;
  currency: string;
  setCurrency: (curr: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isLiveStreaming,
  setIsLiveStreaming,
  currency,
  setCurrency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg w-full max-w-md shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center border-b border-[#2A2E39] pb-3">
          <h2 className="text-lg font-bold text-[#e0e2ed] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2962ff]">settings</span>
            MarketPulse Settings
          </h2>
          <button
            onClick={onClose}
            className="text-[#c3c5d8] hover:text-[#e0e2ed] p-1 rounded hover:bg-[#31353d] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Live Data Toggle */}
          <div className="flex justify-between items-center p-3 bg-[#10131b] border border-[#2A2E39] rounded">
            <div>
              <span className="font-semibold text-[#e0e2ed] block">Live Price Updates</span>
              <span className="text-[#c3c5d8]">Simulate real-time price ticks and sparklines</span>
            </div>
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isLiveStreaming ? "bg-[#2962ff]" : "bg-[#31353d]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isLiveStreaming ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Currency Preference */}
          <div className="flex justify-between items-center p-3 bg-[#10131b] border border-[#2A2E39] rounded">
            <div>
              <span className="font-semibold text-[#e0e2ed] block">Display Currency</span>
              <span className="text-[#c3c5d8]">Base currency for price display</span>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#1E222D] border border-[#2A2E39] text-[#e0e2ed] rounded px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          {/* Theme Note */}
          <div className="p-3 bg-[#10131b] border border-[#2A2E39] rounded text-[#c3c5d8]">
            <span className="font-semibold text-[#e0e2ed] block mb-1">Theme & Display Mode</span>
            Precision Markets Dark Obsidian theme is active for maximum contrast and low latency trading visual ergonomics.
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#2962ff] hover:bg-[#004ee8] text-white py-2 rounded text-xs font-bold transition-colors cursor-pointer"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
