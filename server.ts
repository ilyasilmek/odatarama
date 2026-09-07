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
