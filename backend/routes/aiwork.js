const express = require("express");
const router = express.Router();
const { OpenAI } = require('openai');
const fecthuer = require("../middleware/fecthuser");
const Chathistory = require("../models/Chathistory");
const axios = require("axios");
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const GEMINI_API_KEY = ;

router.post("/userquestion", async (req, res) => {
    try {
        const { question } = req.body;

        // Gemini API request
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    { role: "user", parts: [{ text: `Explain the following question step-by-step in a beginner-friendly way with examples if needed: ${question}` }] }
                ]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        // Extract response
        const geminiAnswer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response generated.";

        res.status(200).json({ answer: geminiAnswer });

    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong with the Gemini API" });
    }
});
// router.post("/userquestion", async (req, res) => {
//     const { question } = req.body;
//     const response = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//             {
//                 role: "system",
//                 content: "You are an experienced teacher who explains concepts in a simple, step-by-step manner. Your goal is to teach the user in an easy-to-understand way, providing examples and checking their understanding along the way."
//             },
//             {
//                 role: "user",
//                 content: `Explain the following question to me as if I am a beginner, step by step, with examples if needed: ${question}`
//             }
//         ],
//     });

//     return res.status(200).json({ answer: response.choices[0].message.content });
// })
router.post("/addchathistory", fecthuer, async (req, res) => {
    try {
        const { message, response } = req.body;
        const user = req.user;
        const chat = new Chathistory({ user, message, response });
        const sevchat = await chat.save();
        return res.status(200).json({ "message": sevchat })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": "Internal server error" })

    }


})
router.get("/viwehistory", fecthuer, async (req, res) => {
    try {
        const user = req.user;
        const history = await Chathistory.find({ user });
        return res.status(200).json({ "history": history })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": "Internal server error" })
    }
})
router.delete("/deletechathistory/:id", fecthuer, async (req, res) => {
    try {
        await Chathistory.findByIdAndDelete(req.params.id);
        return res.status(200).json({ "message": "The chat history is deleted." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": "Internal server error" })

    }
})

module.exports = router;
