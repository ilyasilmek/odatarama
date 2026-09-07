import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for room image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Enable CORS for external frontends (such as GitHub Pages)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Analyze room photo
app.post("/api/analyze-room", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", roomType = "Room", goal = "General decluttering", focusNotes = "" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image data provided" });
    }

    const ai = getGeminiClient();

    // Clean base64 string if it has data URL prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z0-9+]+;base64,/, "");

    const promptText = `You are a world-class professional organizer, spatial designer, and decluttering expert.
Analyze this room photo thoroughly to provide an empathetic, highly actionable, structured decluttering and organization plan.

Context:
- Specified Room Type: ${roomType}
- User's Goal: ${goal}
${focusNotes ? `- User's Specific Concerns / Notes: ${focusNotes}` : ""}

Please evaluate:
1. Clutter level assessment (score from 1 to 10 where 1 is pristine minimal, 10 is severe overload).
2. Root causes of clutter in this specific scene (e.g. lack of designated drop zones, overflow on horizontal surfaces, unused vertical space, cable hazards).
3. 3 "Quick Wins" that can be completed in 5 minutes or less to build immediate psychological momentum.
4. Specific physical zones identified in the picture (e.g. Desk Workstation, Floor Corner, Bed/Nightstand, Bookshelf, Storage Rack, Entry Pathway).
5. A comprehensive step-by-step action plan using the 4-Box Method (Keep, Donate/Sell, Relocate, Trash/Recycle).
6. Smart storage solutions and organizational tools specifically suitable for what you see in the photo (bins, vertical organizers, cable management, hooks, dividers).
7. Daily/weekly micro-habits to sustain the space effortlessly.

You MUST respond strictly with a valid JSON object matching this structure:
{
  "roomType": "${roomType}",
  "clutterScore": 7,
  "clutterLevel": "Moderate",
  "summary": "Short 2-sentence compassionate summary of current state and potential.",
  "keyIssues": [
    "Issue 1",
    "Issue 2",
    "Issue 3"
  ],
  "quickWins": [
    {
      "task": "Action title",
      "duration": "3 mins",
      "impact": "Why it helps immediately"
    }
  ],
  "zones": [
    {
      "zoneName": "Name of zone seen in photo",
      "currentObservation": "What is visible here",
      "recommendation": "Specific organizing solution",
      "suggestedProducts": ["Product / tool 1", "Product / tool 2"]
    }
  ],
  "actionPlan": [
    {
      "id": "step-1",
      "title": "Clear the Primary Flat Surface",
      "category": "declutter",
      "timeEstimate": "15 mins",
      "boxMethodCategory": "Relocate & Keep",
      "description": "Detailed instructions on what items to tackle and how.",
      "proTip": "Helpful insider tip for this step"
    }
  ],
  "storageSolutions": [
    {
      "title": "Solution Name",
      "purpose": "What problem it solves in this space",
      "placement": "Where to install or place it"
    }
  ],
  "maintenanceHabits": [
    {
      "habit": "Habit Name",
      "frequency": "Daily (2 mins)",
      "description": "Short explanation of the habit"
    }
  ]
}

Return ONLY the raw JSON without markdown code fences or backticks.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: cleanBase64,
      },
    };

    let responseText = "";
    // First try gemini-3.1-pro-preview as specified in prompt, fallback to gemini-3.8-flash if needed
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: {
          parts: [imagePart, { text: promptText }],
        },
        config: {
          responseMimeType: "application/json",
        },
      });
      responseText = response.text || "";
    } catch (proError: any) {
      console.warn("gemini-3.1-pro-preview error, falling back to gemini-3.8-flash:", proError?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: {
          parts: [imagePart, { text: promptText }],
        },
        config: {
          responseMimeType: "application/json",
        },
      });
      responseText = fallbackResponse.text || "";
    }

    // Clean JSON if needed
    const cleaned = responseText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsedData = JSON.parse(cleaned);

    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Room analysis failed:", error);
    res.status(500).json({
      error: error?.message || "Failed to analyze room photo",
      details: String(error),
    });
  }
});

// API: Multi-turn Chatbot with decluttering coach role
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, roomContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGeminiClient();

    let systemInstruction = `You are "ClutterClear", an empathetic, encouraging, and highly practical professional organizer, decluttering coach, and interior space optimizer.

Your mission:
- Guide the user step-by-step through sorting, purging, and organizing their space.
- Keep tone warm, constructive, and free of judgment or shame. Decluttering is emotional and exhausting; validate their efforts.
- Break overwhelming tasks down into bite-sized 5 to 15-minute micro-steps.
- Provide concrete tactics: the 4-Box Method (Keep, Donate, Relocate, Trash), the "One In, One Out" rule, Marie Kondo spark-joy decision filtering, containerizing, vertical space utilization, and cable management.
- When asked about sentimental items, suggest memory boxes, photographing items before donating, or honoring memories without hoarding bulk.`;

    if (roomContext) {
      systemInstruction += `\n\nCURRENT ROOM ANALYSIS CONTEXT:
- Room Type: ${roomContext.roomType || "Unknown"}
- Clutter Score: ${roomContext.clutterScore || "N/A"}/10 (${roomContext.clutterLevel || "N/A"})
- Summary: ${roomContext.summary || "N/A"}
- Key Issues Detected: ${JSON.stringify(roomContext.keyIssues || [])}
- Identified Zones: ${JSON.stringify((roomContext.zones || []).map((z: any) => z.zoneName))}
Reference these specific room details naturally when giving advice.`;
    }

    // Format chat contents
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content || "" }],
    }));

    let replyText = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
        },
      });
      replyText = response.text || "";
    } catch (flashError: any) {
      console.warn("gemini-3.5-flash chat error, trying gemini-3.8-flash:", flashError?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
        },
      });
      replyText = fallbackResponse.text || "";
    }

    res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error?.message || "Failed to process chat message",
      details: String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`Declutter AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
