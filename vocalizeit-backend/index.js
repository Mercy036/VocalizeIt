require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ttsRoutes = require('./routes/tts');
const { ElevenLabsClient } = require("elevenlabs");

// Validate API key exists
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("❌ ELEVENLABS_API_KEY is not set in environment variables");
  process.exit(1);
}

console.log("✅ API Key loaded successfully");
console.log("Key starts with:", apiKey.substring(0, 5));
console.log("Key length:", apiKey.length);

// Create the client with explicit configuration
const elevenlabs = new ElevenLabsClient({
  apiKey: apiKey.trim(), // Trim any whitespace
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Middleware to attach the client to each request
app.use((req, res, next) => {
  req.elevenlabs = elevenlabs;
  next();
});

// Use the TTS routes
app.use('/api/tts', ttsRoutes);

// Enhanced debug route
app.get('/debug-env', (req, res) => {
  res.json({
    keyExists: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    firstFourChars: apiKey ? apiKey.substring(0, 4) : null,
    lastFourChars: apiKey ? apiKey.substring(apiKey.length - 4) : null,
    nodeEnv: process.env.NODE_ENV || 'not set'
  });
});

// Test ElevenLabs connection
app.get('/test-elevenlabs', async (req, res) => {
  try {
    console.log("Testing ElevenLabs connection...");
    
    // Try to fetch voices as a simple test
    const voices = await elevenlabs.voices.getAll();
    
    res.json({
      success: true,
      message: "ElevenLabs connection successful",
      voiceCount: voices.voices ? voices.voices.length : 0
    });
  } catch (error) {
    console.error("ElevenLabs test failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      statusCode: error.statusCode || 'unknown'
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});