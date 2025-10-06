// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { recyclingData } from "./recyclingData.js";

dotenv.config();

const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://35.202.126.253:5173";
app.use(cors({ origin: FRONTEND_URL }));


const conversations = {};

const SYSTEM_PROMPT = `
You are an expert recycling assistant on Mars.

You already know how to recycle the following materials: ${Object.keys(recyclingData).join(", ")}.  
(If the user asks about these, respond ONLY with the information you already have).

If the user asks about an unlisted material, create 2 or 3 plausible recycling ideas 
adapted to Martian conditions. Respond in a brief list and use 1 or 2 emojis.

⚠️ Important: if the user replies with something short like "yes," "no," or "ok," 
interpret that response in the context of your last question or suggestion.

If someone asks about other topics, kindly reply that you only talk about Martian recycling.
`;


app.post("/api/assistant", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Falta el mensaje del usuario" });
    }

    const userMessage = message.toLowerCase();

    // Crear sesión si no existe
    if (!conversations[sessionId]) {
      conversations[sessionId] = [];
    }

    
    for (const [material, data] of Object.entries(recyclingData)) {
      if (
        (data.keywords ?? [material]).some(k =>
          userMessage.includes(k.toLowerCase())
        )
      ) {
        const reply = `♻️ On Mars, **${material}** can be recycled like this:\n\n👉 ${data.uso}\n🔧 You’ll need: ${data.requerimientos.join(", ")}`;


        conversations[sessionId].push({ role: "user", content: message });
        conversations[sessionId].push({ role: "assistant", content: reply });

        return res.json({ reply });
      }
    }

   
    conversations[sessionId].push({ role: "user", content: message });

    
    const history = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversations[sessionId].slice(-10) // solo últimos 10 mensajes para no sobrecargar
    ];

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: history,
        max_completion_tokens: 200,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("OpenAI error:", text);
      return res.status(500).json({ error: "Error desde OpenAI", detail: text });
    }

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content ?? "No recibí respuesta.";

   
    conversations[sessionId].push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});


app.get("/api/welcome", (req, res) => {
  res.json({
    reply: "👋 Welcome to the Martian Recycling Assistant. Ask me how to recycle materials on Mars, and I’ll tell you how to do it."
  });
});

const port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0", () =>
  console.log(`Assistant proxy running on http://0.0.0.0:${port}`)
);
