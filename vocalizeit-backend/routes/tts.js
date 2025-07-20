const express = require('express');

const router = express.Router();

const { ElevenLabsClient } = require("elevenlabs");

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

console.log("API Key loaded:", process.env.ELEVENLABS_API_KEY ? "✅ Yes" : "❌ No");

// Initialize the ElevenLabs client with your API key


router.post('/synthesize', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const audio = await elevenlabs.generate({
      voice: "Rachel",
      text: text,
      model_id: "eleven_multilingual_v2" 
    });


    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Send the audio back as a base64 string, just like before.
    res.json({ audioContent: buffer.toString('base64') });

  } catch (error) {
    // Log the detailed error from the API
    console.error('ElevenLabs API Error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech with ElevenLabs' });
  }
});

module.exports = router;