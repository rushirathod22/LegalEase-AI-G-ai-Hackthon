// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.post("/api/generate-draft", (req, res) => {
//   const { instructions, documentType } = req.body;
//   const draft = `This is a ${documentType} generated with instructions: "${instructions}"`;
//   res.json({ content: draft });
// });

// app.post("/api/summarize", (req, res) => {
//   const { content } = req.body;

//   const summary = {
//     overview: "This is a summary of the document.",
//     risks: ["Potential liability clause", "Termination risks"],
//     recommendations: ["Review indemnity section", "Clarify termination terms"],
//   };

//   res.json({ summary }); // wrap in "summary" key
// });


// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Initialize Gemini API client
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// app.post("/api/generate-draft", async (req, res) => {
//   const { instructions, documentType } = req.body;

//   try {
//     const prompt = `Generate a ${documentType} based on these instructions:\n${instructions}`;
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });
//     res.json({ content: response.text });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "AI draft generation failed" });
//   }
// });

// app.post("/api/summarize", async (req, res) => {
//   const { content } = req.body;

//   try {
//     const prompt = `Summarize the following legal document in plain language. Provide: overview, key points, risks, recommendations. Format output as JSON with keys: overview, keyPoints, risks, recommendations. Document: ${content}`;
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });

//     let summary;
//     try {
//       summary = JSON.parse(response.text);
//     } catch (e) {
//       summary = { overview: response.text, keyPoints: [], risks: [], recommendations: [] };
//     }

//     res.json({ summary });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "AI summarization failed" });
//   }
// });

// app.listen(5000, () => console.log("Server running on port 5000"));


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // required for Groq API calls

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/api/generate-draft", async (req, res) => {
    const { instructions, documentType } = req.body;

    try {
        const prompt = `Generate a ${documentType} based on these instructions:\n${instructions}`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b", // Groq chat model
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();

        // Groq chat responses are in data.choices[0].message.content
        const draft = data?.choices?.[0]?.message?.content;

        if (!draft) {
            console.log("Full Groq response:", JSON.stringify(data, null, 2));
            return res.status(500).json({ error: "No content returned from Groq" });
        }

        res.json({ content: draft });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI draft generation failed" });
    }
});




// Remove code block wrapper
function cleanGroqJson(text) {
    return text
        .replace(/^```json\s*/, '')  // Remove ```json at start
        .replace(/```$/, '')         // Remove ``` at end
        .trim();
}

app.post("/api/summarize", async (req, res) => {
    const { content } = req.body;

    try {
        const prompt = `
Summarize the following legal document in plain language.
Provide: overview, key points, risks, recommendations.
Format output as JSON with keys: overview, keyPoints, risks, recommendations.
Document:
${content}
`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5
            })
        });

        const data = await response.json();
        const outputText = data?.choices?.[0]?.message?.content;

        if (!outputText) {
            console.log("Full Groq response:", JSON.stringify(data, null, 2));
            return res.status(500).json({ error: "No content returned from Groq" });
        }

        // Strip ```json wrapper if present
        const cleanedText = cleanGroqJson(outputText);

        let summary;
        try {
            summary = JSON.parse(cleanedText);
        } catch (e) {
            summary = { overview: cleanedText, keyPoints: [], risks: [], recommendations: [] };
        }

        res.json({ summary });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI summarization failed" });
    }
});



app.listen(5000, () => console.log("Server running on port 5000"));
