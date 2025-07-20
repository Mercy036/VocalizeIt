const express = require('express');
const router = express.Router();

router.post('/synthesize', async (req, res) => {
  // Use the client attached from the middleware
  const elevenlabs = req.elevenlabs;
  const { text } = req.body;

  try {
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

    res.json({ audioContent: buffer.toString('base64') });

  } catch (error) {
    console.error('ElevenLabs API Error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech with ElevenLabs' });
  }
});

module.exports = router;