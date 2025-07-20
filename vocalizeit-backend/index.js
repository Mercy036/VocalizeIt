require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ttsRoutes = require('./routes/tts');
const { ElevenLabsClient } = require("elevenlabs");

// Create the client a single time
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

console.log("API Key loaded:", process.env.ELEVENLABS_API_KEY ? "✅ Yes" : "❌ No");

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

// Add this temporary debug route
app.get('/debug-env', (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (apiKey) {
    res.json({
      keyExists: true,
      keyLength: apiKey.length,
      firstFourChars: apiKey.substring(0, 4),
      lastFourChars: apiKey.substring(apiKey.length - 4)
    });
  } else {
    res.json({
      keyExists: false,
      message: 'The ELEVENLABS_API_KEY environment variable was not found.'
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});