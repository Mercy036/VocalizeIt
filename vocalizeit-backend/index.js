require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ttsRoutes = require('./routes/tts');
const { ElevenLabs } = require("elevenlabs");

const { ElevenLabsClient } = require("elevenlabs");

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

console.log("API Key loaded:", process.env.ELEVENLABS_API_KEY ? "✅ Yes" : "❌ No");

const app = express();
const port = process.env.port || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
// Enable CORS for all origins
app.use(cors());

// Use the TTS routes
app.use('/api/tts', ttsRoutes);

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});