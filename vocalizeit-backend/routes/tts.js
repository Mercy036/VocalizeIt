const express = require('express');
const router = express.Router();

router.post('/synthesize', async (req, res) => {
  const { text } = req.body;

  try {
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('Synthesizing text:', text.substring(0, 50) + '...');
    
    // Use Rachel's voice ID directly with HTTP API
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      
      if (response.status === 401) {
        return res.status(401).json({ 
          error: 'Authentication failed',
          details: 'API key authentication failed during synthesis'
        });
      } else if (response.status === 402) {
        return res.status(402).json({ 
          error: 'Insufficient credits',
          details: 'Please add credits to your ElevenLabs account'
        });
      } else {
        return res.status(response.status).json({ 
          error: 'ElevenLabs API error',
          details: errorText
        });
      }
    }

    const audioBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);
    
    console.log('Successfully generated audio, buffer size:', buffer.length);
    res.json({ audioContent: buffer.toString('base64') });

  } catch (error) {
    console.error('Synthesis error:', error);
    res.status(500).json({ 
      error: 'Failed to synthesize speech',
      details: error.message
    });
  }
});

module.exports = router;