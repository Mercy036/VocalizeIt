// App.jsx with Azure TTS features

import { useState, useEffect } from 'react';
import './index.css';
import Waveform from './components/Waveform';
import AddText from './components/Addtext';

function App() {
  const [text, setText] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('en-US-AriaNeural');
  const [speechRate, setSpeechRate] = useState('0%');
  const [speechPitch, setSpeechPitch] = useState('0%');

  // Load available voices on component mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const response = await fetch('https://vocalizeit-lc7l.onrender.com/api/tts/voices');
        if (response.ok) {
          const data = await response.json();
          setVoices(data.voices);
        }
      } catch (error) {
        console.error('Error loading voices:', error);
      }
    };
    
    loadVoices();
  }, []);

  const handleGenerateAudio = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setAudioSrc(null);

    try {
      const response = await fetch('https://vocalizeit-lc7l.onrender.com/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text,
          voice: selectedVoice,
          rate: speechRate,
          pitch: speechPitch
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Backend server error');
      }

      const data = await response.json();

      // Convert base64 to blob URL
      const byteCharacters = atob(data.audioContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      setAudioSrc(url);

    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="VocalizeIt-mainbody">
        <div className="VocalizeIt-title">VocalizeIt</div>
        <div className="slogan">Create. Manage and Conquer Your Stories</div>

        {/* Voice Controls */}
        <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Voice Settings</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Voice: </label>
            <select 
              value={selectedVoice} 
              onChange={(e) => setSelectedVoice(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="en-US-AriaNeural">Aria (Female, US)</option>
              <option value="en-US-DavisNeural">Davis (Male, US)</option>
              <option value="en-US-JennyNeural">Jenny (Female, US)</option>
              <option value="en-US-GuyNeural">Guy (Male, US)</option>
              <option value="en-GB-SoniaNeural">Sonia (Female, UK)</option>
              <option value="en-GB-RyanNeural">Ryan (Male, UK)</option>
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.displayName} ({voice.gender}, {voice.locale})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Speed: </label>
            <select 
              value={speechRate} 
              onChange={(e) => setSpeechRate(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="-50%">Very Slow</option>
              <option value="-25%">Slow</option>
              <option value="0%">Normal</option>
              <option value="+25%">Fast</option>
              <option value="+50%">Very Fast</option>
            </select>
          </div>

          <div>
            <label>Pitch: </label>
            <select 
              value={speechPitch} 
              onChange={(e) => setSpeechPitch(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="-20%">Lower</option>
              <option value="-10%">Slightly Lower</option>
              <option value="0%">Normal</option>
              <option value="+10%">Slightly Higher</option>
              <option value="+20%">Higher</option>
            </select>
          </div>
        </div>

        {isLoading ? <p>Generating Audio...</p> : <Waveform audioUrl={audioSrc} />}
        <AddText onGenerateClick={handleGenerateAudio} />

        <div className="texdisplay-wrap">
          <textarea
            className="text-display-box"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start your story here..."
          />
        </div>
        
        <div className="made-with-love">
          Made with Big <span className="red-heart">🍆</span> Energy by <b>Shourya</b> & <b>Ansh</b>
        </div>
      </div>
    </>
  );
}

export default App;