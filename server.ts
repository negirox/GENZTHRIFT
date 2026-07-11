/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini API client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for AI stylist recommendation based on browsing history
app.post("/api/ai/stylist", async (req, res) => {
  try {
    const { history, catalog, topCategory } = req.body;

    if (!history || history.length === 0) {
      return res.status(400).json({ error: "No browsing history logs received" });
    }

    // Build instructions for Gemini
    const prompt = `You are the ultimate street fashion stylist for "The GenZ's Thrift" store in Lucknow, India.
    Your style is extremely cool, slang-filled, friendly, funny, and 100% GenZ (use slangs like "no cap", "slay", "rent free", "main character", "vibe check", "cooked", "drippy", "rizz").
    
    You must analyze the user's local store browsing history:
    ${JSON.stringify(history)}
    
    The user's most-viewed category is: ${topCategory}.
    
    Based on this history, write a personalized style advice report for them. Your advice should suggest which aesthetics they match (e.g. Y2K Skater, Cottagecore sage, Cyberpunk anime, Grunge utility) and how to mix and match.
    
    You must ALSO suggest 1 to 3 actual product IDs from our Lucknow local store catalog to form a cohesive outfit:
    ${JSON.stringify(catalog)}
    
    Ensure your response conforms EXACTLY to this JSON format (do not wrap in markdown, output raw JSON):
    {
      "advice": "A paragraph or two of personalized styling tips with GenZ slang, addressing Lucknow street fashion vibes.",
      "vibeName": "A catchy 2-4 word aesthetic category name (e.g., Y2K Skater Gorpcore, Cyberpunk Grail Lord, Retro sage Minimalist)",
      "matchedSlang": "A GenZ slang of your choice that represents this vibe, with a short funny explanation",
      "suggestedOutfitIds": ["id1", "id2"]
    }`;

    // Call Gemini with schema definition
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.STRING,
              description: "The personalized street-style advice, written in highly engaging GenZ slang.",
            },
            vibeName: {
              type: Type.STRING,
              description: "A fun title for their customized fashion vibe (e.g., Cyberpunk Skater Grail).",
            },
            matchedSlang: {
              type: Type.STRING,
              description: "A cool GenZ slang word that perfectly represents this look.",
            },
            suggestedOutfitIds: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "The IDs of 1 to 3 products from the store catalog that match this look.",
            },
          },
          required: ["advice", "vibeName", "matchedSlang", "suggestedOutfitIds"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini model");
    }

    const stylingResponse = JSON.parse(text.trim());
    res.json(stylingResponse);
  } catch (error: any) {
    console.error("Gemini Stylist Error:", error);
    res.status(500).json({
      error: "Failed to generate styling advice. No cap, the stylist server got cooked.",
      details: error.message,
    });
  }
});

// API endpoint for generating a styling suggestion for a single product in context of browsing history
app.post("/api/ai/styling-suggestion", async (req, res) => {
  try {
    const { product, historyProducts } = req.body;

    if (!product) {
      return res.status(400).json({ error: "No product data received" });
    }

    const prompt = `You are the ultimate street fashion stylist for "The GenZ's Thrift" store in Lucknow, India.
    Your style is extremely cool, slang-filled, friendly, funny, and 100% GenZ (use slangs like "no cap", "slay", "rent free", "main character", "vibe check", "cooked", "drippy", "rizz").
    
    The user is currently viewing this apparel piece:
    Product Name: ${product.title}
    Category: ${product.category}
    Description: ${product.description}
    Tags: ${product.tags?.join(", ") || "none"}

    The user's browsing history in this session includes these other store items they checked out:
    ${JSON.stringify(historyProducts || [])}

    Write a personalized text-based 'Styling Suggestion' for the current product. 
    If they have checked out other items in their browsing history, reference those items specifically to suggest a complete Lucknow street-style outfit combination (e.g. "Since you checked out [history product], this would go insanely hard with it..."). If their browsing history is empty or sparse, suggest standard items that fit the Lucknow vibe (like gedi at Hazratganj or kebabs at Chowk).
    
    Keep it punchy, short (2 to 3 sentences), highly engaging, and authentic Lucknow-themed GenZ slang.

    Ensure your response conforms EXACTLY to this JSON format:
    {
      "suggestion": "Personalized styling advice for this item.",
      "vibeName": "A catchy 2-3 word aesthetic theme (e.g., Nawabi Cyberpunk, Hazratganj Grunge, Kebabs & Cargoes)"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: {
              type: Type.STRING,
              description: "A short, engaging styling suggestion using Lucknow GenZ style slang, incorporating their browsing history if available.",
            },
            vibeName: {
              type: Type.STRING,
              description: "A fun aesthetic vibe name representing the look.",
            },
          },
          required: ["suggestion", "vibeName"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini model");
    }

    const suggestionResponse = JSON.parse(text.trim());
    res.json(suggestionResponse);
  } catch (error: any) {
    console.error("Gemini Product Styling Suggestion Error:", error);
    res.status(500).json({
      error: "No cap, our styling brain got a little cooked. Try again in a bit!",
      details: error.message,
    });
  }
});

// Serve frontend build / Vite Dev server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[The GenZ's Thrift] Server running on http://localhost:${PORT}`);
  });
}

startServer();
