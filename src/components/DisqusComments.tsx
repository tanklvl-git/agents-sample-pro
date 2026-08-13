import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from "react";

interface DisqusErrorBoundaryProps {
  children: ReactNode;
}

interface DisqusErrorBoundaryState {
  hasError: boolean;
}

// Error Boundary to isolate Disqus runtime errors
class DisqusErrorBoundary extends Component<DisqusErrorBoundaryProps, DisqusErrorBoundaryState> {
  constructor(props: DisqusErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): DisqusErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Disqus error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-[#10131b] text-xs text-[#c3c5d8] border border-[#2A2E39] rounded flex flex-col gap-2">
          <p className="font-semibold text-[#e0e2ed]">Discussion Forum Temporarily Unavailable</p>
          <p>
            The live comments widget encountered a cross-origin script restriction. You can view or post comments directly on the Disqus platform.
          </p>
          <a
            href="https://tank-m2.disqus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2962ff] hover:underline font-bold self-start mt-1"
          >
            Open MarketPulse Forum on Disqus &rarr;
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

const DisqusContent: React.FC = () => {
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // Configure window.disqus_config safely
    try {
      (window as any).disqus_config = function (this: any) {
        this.page.url = window.location.href;
        this.page.identifier = "marketpulse-pro-disqus-thread";
      };
    } catch (e) {
      console.warn("Failed setting disqus_config:", e);
    }

    // Load embed script
    const embedScriptId = "disqus-embed-script";
    if (!document.getElementById(embedScriptId)) {
      const s = document.createElement("script");
      s.id = embedScriptId;
      s.src = "https://tank-m2.disqus.com/embed.js";
      s.setAttribute("data-timestamp", (+new Date()).toString());
      s.async = true;
      s.onerror = (e) => {
        console.warn("Disqus embed script load failed:", e);
        setScriptError(true);
      };
      (document.head || document.body).appendChild(s);
    } else if ((window as any).DISQUS) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: (window as any).disqus_config,
        });
      } catch (err) {
        console.warn("Disqus reset notice:", err);
      }
    }

    // Load count script
    const countScriptId = "dsq-count-scr";
    if (!document.getElementById(countScriptId)) {
      const sCount = document.createElement("script");
      sCount.id = countScriptId;
      sCount.src = "https://tank-m2.disqus.com/count.js";
      sCount.async = true;
      sCount.onerror = (e) => {
        console.warn("Disqus count script load failed:", e);
      };
      (document.head || document.body).appendChild(sCount);
    }
  }, []);

  return (
    <div id="disqus_thread" className="min-h-[250px] bg-[#10131b] p-4 rounded border border-[#2A2E39] text-xs text-[#c3c5d8]">
      {scriptError ? (
        <div className="py-8 text-center text-[#c3c5d8]">
          <p>Disqus forum could not be loaded directly. Click below to view discussions on Disqus:</p>
          <a
            href="https://tank-m2.disqus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-[#2962ff] hover:underline font-semibold"
          >
            Open MarketPulse Forum on Disqus &rarr;
          </a>
        </div>
      ) : (
        <noscript>
          Please enable JavaScript to view the{" "}
          <a href="https://disqus.com/?ref_noscript" className="text-[#2962ff] underline">
            comments powered by Disqus.
          </a>
        </noscript>
      )}
    </div>
  );
};

export const DisqusComments: React.FC = () => {
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

      <DisqusErrorBoundary>
        <DisqusContent />
      </DisqusErrorBoundary>
    </div>
  );
};
