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

    let cleanBase64 = imageBase64;
    let finalMimeType = mimeType || "image/jpeg";

    // Handle data URL extraction if present
    if (typeof cleanBase64 === "string" && cleanBase64.startsWith("data:")) {
      const match = cleanBase64.match(/^data:([^;]+);base64,(.+)$/s);
      if (match) {
        finalMimeType = match[1];
        cleanBase64 = match[2];
      } else {
        const commaIndex = cleanBase64.indexOf(",");
        if (commaIndex !== -1) {
          const header = cleanBase64.slice(0, commaIndex);
          const rawData = cleanBase64.slice(commaIndex + 1);
          if (header.includes("base64")) {
            cleanBase64 = rawData;
          } else {
            const decoded = decodeURIComponent(rawData);
            cleanBase64 = Buffer.from(decoded, "utf-8").toString("base64");
          }
        }
      }
    }

    // Gemini requires JPEG, PNG, WEBP, HEIC, or HEIF (SVG is not supported as raw inline image)
    if (finalMimeType.includes("svg")) {
      finalMimeType = "image/png";
    }

    // Clean whitespace
    cleanBase64 = cleanBase64.replace(/\s+/g, "");

    const promptText = `Sen dünya çapında uzman bir profesyonel organizatör, iç mekan tasarımcısı ve sadeleşme/düzen uzmanısın.
Bu oda fotoğrafını derinlemesine analiz et ve kullanıcıya empatik, uygulanabilir, motive edici ve adım adım yapılandırılmış bir düzenleme/sadeleştirme planı sun.

ÖNEMLİ KURAL: Tüm çıktı ve metinler (özetler, sorunlar, hızlı kazanım başlıkları, bölgeler, 4-kutu eylem planı adımları, profesyonel ipuçları, depolama önerileri ve alışkanlıklar) tamamen TÜRKÇE olmalıdır.

Bağlam:
- Seçilen Oda Türü: ${roomType}
- Kullanıcının Hedefi: ${goal}
${focusNotes ? `- Kullanıcının Özel Notları / Endişeleri: ${focusNotes}` : ""}

Lütfen şunları değerlendir:
1. Dağınıklık seviyesi puanı (1: Tertemiz/Minimalist - 10: Aşırı derecede tıkanmış/dağınık).
2. Bu sahnede görülen temel dağınıklık nedenleri (ör. yatay yüzeylerin taşması, kablo karmaşası, dikey alanların kullanılmaması, geçiş alanlarının tıkanması).
3. Kullanıcıya hemen moral ve ivme kazandıracak, 5 dakikadan kısa süren 3 adet "Hızlı Kazanım" (Quick Win).
4. Fotoğrafta tespit edilen spesifik fiziksel bölgeler (ör. Çalışma Masası Yüzeyi, Zemin Köşesi, Kitaplık, Gardırop, vb.).
5. 4-Kutu Yöntemini (Sakla, Bağışla / Sat, Yerini Değiştir, At / Geri Dönüştür) kullanan adım adım eylem planı.
6. Bu fotoğraftaki duruma uygun akıllı depolama ve düzenleme araçları (kablo toplayıcı, sepet, bölücü kutu, raf vb.).
7. Düzenin kalıcı olmasını sağlayacak günlük ve haftalık mikro alışkanlıklar.

MUTLAKA aşağıdaki JSON şablonuna birebir uyan geçerli bir JSON nesnesi döndür:
{
  "roomType": "${roomType}",
  "clutterScore": 7,
  "clutterLevel": "Orta",
  "summary": "Mevcut durum ve odanın potansiyeli hakkında 2 cümlelik samimi Türkçe özet.",
  "keyIssues": [
    "1. Tespit edilen sorun",
    "2. Tespit edilen sorun",
    "3. Tespit edilen sorun"
  ],
  "quickWins": [
    {
      "task": "Hemen yapılabilecek küçük görev",
      "duration": "3 dk",
      "impact": "Neden hemen ferahlık sağlayacağı"
    }
  ],
  "zones": [
    {
      "zoneName": "Fotoğrafta Görülen Bölge Adı",
      "currentObservation": "Burada neyin dağınık olduğu",
      "recommendation": "Spesifik düzenleme çözümü",
      "suggestedProducts": ["Önerilen araç / ürün 1", "Önerilen araç / ürün 2"]
    }
  ],
  "actionPlan": [
    {
      "id": "step-1",
      "title": "Ana Yatay Yüzeyi Temizle",
      "category": "declutter",
      "timeEstimate": "15 dk",
      "boxMethodCategory": "Yerini Değiştir",
      "description": "Neler yapılması gerektiğine dair adım adım açıklama.",
      "proTip": "Uzmandan pratik bir püf noktası"
    }
  ],
  "storageSolutions": [
    {
      "title": "Çözüm / Ürün Adı",
      "purpose": "Bu alanda hangi problemi çözdüğü",
      "placement": "Odanın neresine yerleştirileceği"
    }
  ],
  "maintenanceHabits": [
    {
      "habit": "Alışkanlık Adı",
      "frequency": "Her Gün (2 dk)",
      "description": "Alışkanlığın kısa ve motive edici açıklaması"
    }
  ]
}

SADECE geçerli ham JSON döndür, markdown kod bloğu veya ekstra metin ekleme.`;

    const imagePart = {
      inlineData: {
        mimeType: finalMimeType || "image/jpeg",
        data: cleanBase64,
      },
    };

    let responseText = "";
    // Priority order: gemini-3.1-flash-lite (fast & robust), then gemini-flash-latest, then gemini-3.8-flash
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [imagePart, { text: promptText }],
          },
          config: {
            responseMimeType: "application/json",
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed, trying next fallback:`, err?.message || err);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("Yapay zeka modellerinden yanıt alınamadı");
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

    let systemInstruction = `Sen "Düzen Koçu"sun (Coach ClutterClear); empatik, cesaretlendirici, motive edici ve son derece pratik bir profesyonel oda düzenleme, sadeleşme ve mekan optimizasyonu uzmanısın.

Görevin ve Kuralların:
- HER ZAMAN TÜRKÇE konuş ve yanıt ver.
- Kullanıcıya odasını ayıklama, sadeleştirme ve organize etme sürecinde adım adım rehberlik et.
- Dilin daima sıcak, yapıcı, yargısız ve motive edici olsun. Dağınıklık duygusal bir yüktür ve yorucudur; kullanıcının emeğini ve küçük adımlarını takdir et.
- Göz korkutucu büyük görevleri 5 ila 15 dakikalık ufak, lokma büyüklüğünde mikro adımlara böl.
- Somut teknikler öner: 4 Kutu Yöntemi (Sakla, Bağışla, Yerini Değiştir, At), "Biri Gelirse Biri Gider" kuralı, dikey alan kullanımı, kutulama/sepetleme sistemleri ve kablo gizleme yöntemleri.
- Manevi değeri olan eşyalar sorulduğunda: Anı kutusu yapma, eşyanın fotoğrafını çekip bağışlama veya fiziksel yer kaplamadan hatırayı yaşatma yollarını nazikçe tavsiye et.`;

    if (roomContext) {
      systemInstruction += `\n\nMEVCUT ODA ANALİZİ BAĞLAMI:
- Oda Türü: ${roomContext.roomType || "Bilinmiyor"}
- Dağınıklık Puanı: ${roomContext.clutterScore || "N/A"}/10 (${roomContext.clutterLevel || "N/A"})
- Özet: ${roomContext.summary || "N/A"}
- Tespit Edilen Temel Sorunlar: ${JSON.stringify(roomContext.keyIssues || [])}
- İncelenen Bölgeler: ${JSON.stringify((roomContext.zones || []).map((z: any) => z.zoneName))}
Tavsiyelerde bulunurken bu oda analizindeki detaylara doğal bir şekilde atıfta bulun.`;
    }

    // Format chat contents
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content || "" }],
    }));

    let replyText = "";
    const chatCandidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
    let lastChatError: any = null;

    for (const modelName of chatCandidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction,
          },
        });
        if (response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Chat model ${modelName} failed, trying next fallback:`, err?.message || err);
        lastChatError = err;
      }
    }

    if (!replyText) {
      throw lastChatError || new Error("Yapay zeka koçundan yanıt alınamadı");
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

// Global error handler ensuring all API errors return JSON instead of HTML
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Express Error:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Sunucuda beklenmeyen bir hata oluştu.",
  });
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
