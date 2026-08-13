import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const getAi = () => {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route: Gemini Market Analysis
  app.post("/api/gemini/market-analysis", async (req, res) => {
    try {
      const { symbol, query, context } = req.body;
      const ai = getAi();

      if (!ai) {
        return res.json({
          analysis: `Market Intelligence Report for ${symbol || "Market"}:\n\n` +
            `• Price Momentum: Current movement reflects steady institutional flow with a slight bullish bias.\n` +
            `• Technical Levels: Key support holding well above key moving averages.\n` +
            `• Macro Sentiment: Investors are closely observing inflation reports and central bank interest rate decisions.`,
          isFallback: true,
        });
      }

      const prompt = `You are a top-tier quantitative financial analyst and market analyst at MarketPulse.
User requested analysis for: ${symbol || "General Market"}
User Question/Query: ${query || "Provide a concise 3-bullet market pulse breakdown with key drivers, technical levels, and risks."}
Context data provided: ${JSON.stringify(context || {})}

Provide a sharp, authoritative, and structured market analysis. Include:
1. Executive Summary & Sentiment
2. Key Catalysts & Technical Outlook
3. Risk Factors & What to Watch

Keep formatting clean with bullet points and bold headers. Do not use conversational filler.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({
        analysis: response.text || "No response generated.",
        symbol,
      });
    } catch (error: any) {
      console.error("Gemini Market Analysis Error:", error);
      res.status(500).json({
        error: "Failed to generate market analysis.",
        details: error?.message || "Internal server error",
      });
    }
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MarketPulse Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
