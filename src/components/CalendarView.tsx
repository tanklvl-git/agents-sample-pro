import React from "react";
import { EconomicEvent } from "../types";

interface CalendarViewProps {
  events: EconomicEvent[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-[#2A2E39] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#e0e2ed] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2962ff]">calendar_today</span>
            Economic & Earnings Calendar
          </h2>
          <p className="text-xs text-[#c3c5d8] mt-1">
            Real-time macroeconomic releases, central bank decisions, and CPI data.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2A2E39] text-xs font-bold text-[#c3c5d8] uppercase tracking-wider h-9">
              <th className="py-2 px-3">Date / Time</th>
              <th className="py-2 px-3">Country</th>
              <th className="py-2 px-3">Event</th>
              <th className="py-2 px-3">Impact</th>
              <th className="py-2 px-3 text-right">Actual</th>
              <th className="py-2 px-3 text-right">Forecast</th>
              <th className="py-2 px-3 text-right">Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2E39]">
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-[#31353d]/30 text-xs font-mono">
                <td className="py-3 px-3 text-[#e0e2ed]">
                  <div className="font-bold">{ev.date}</div>
                  <div className="text-[11px] text-[#c3c5d8]">{ev.time}</div>
                </td>
                <td className="py-3 px-3 text-[#e0e2ed] font-semibold">{ev.country}</td>
                <td className="py-3 px-3 text-[#e0e2ed] font-sans font-medium">{ev.event}</td>
                <td className="py-3 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ev.impact === "HIGH"
                        ? "bg-[#F23645]/15 text-[#F23645]"
                        : ev.impact === "MEDIUM"
                        ? "bg-[#2962ff]/15 text-[#2962ff]"
                        : "bg-[#31353d] text-[#c3c5d8]"
                    }`}
                  >
                    {ev.impact}
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-[#e0e2ed] font-bold">{ev.actual}</td>
                <td className="py-3 px-3 text-right text-[#c3c5d8]">{ev.forecast}</td>
                <td className="py-3 px-3 text-right text-[#c3c5d8]">{ev.previous}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
