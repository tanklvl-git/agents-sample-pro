import React, { useEffect } from "react";

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    // Check if embed script already exists
    const embedScriptId = "disqus-embed-script";
    if (!document.getElementById(embedScriptId)) {
      const s = document.createElement("script");
      s.id = embedScriptId;
      s.src = "https://tank-m2.disqus.com/embed.js";
      s.setAttribute("data-timestamp", (+new Date()).toString());
      s.async = true;
      (document.head || document.body).appendChild(s);
    } else if ((window as unknown as { DISQUS?: { reset: (args: object) => void } }).DISQUS) {
      // If already loaded, reset DISQUS to reload for current route/page
      (window as unknown as { DISQUS: { reset: (args: object) => void } }).DISQUS.reset({
        reload: true,
      });
    }

    // Embed count script
    const countScriptId = "dsq-count-scr";
    if (!document.getElementById(countScriptId)) {
      const sCount = document.createElement("script");
      sCount.id = countScriptId;
      sCount.src = "//tank-m2.disqus.com/count.js";
      sCount.async = true;
      (document.head || document.body).appendChild(sCount);
    }
  }, []);

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg p-6 shadow-sm space-y-4 mt-8 select-none-off">
      <div className="flex items-center justify-between border-b border-[#2A2E39] pb-3">
        <h2 className="text-xl font-bold text-[#e0e2ed] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2962ff]">forum</span>
          Community Market Discussion & Analysis
        </h2>
        <span className="text-xs text-[#089981] bg-[#089981]/10 border border-[#089981]/30 px-2 py-0.5 rounded font-mono font-bold">
          LIVE DISQUS FORUM
        </span>
      </div>

      <p className="text-xs text-[#c3c5d8]">
        Join the discussion with active traders, share market outlooks, and comment on current market trends.
      </p>

      {/* Disqus Thread Container */}
      <div id="disqus_thread" className="min-h-[250px] bg-[#10131b] p-4 rounded border border-[#2A2E39] text-xs text-[#c3c5d8]">
        {/* Fallback text while Disqus initializes */}
        <noscript>
          Please enable JavaScript to view the{" "}
          <a href="https://disqus.com/?ref_noscript" className="text-[#2962ff] underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};
