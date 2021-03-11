import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import * as Tone from 'tone';

import Oscilloscope from './components/Oscilloscope';
import './style.css';
import './media/favicon.ico';

import voiceUrl from './media/audio/hello.mp3';
import sweepUrl from './media/audio/chirp.mp3';

export type SourceOption = {
  signal: any;
  name: string;
};

const App: React.FC = () => {
  const [sources, setSources] = useState<Array<SourceOption>>([
    { signal: new Tone.Oscillator(440, 'sine').start(), name: 'Sine Generator' },
    {
      signal: new Tone.Oscillator(440, 'sawtooth').start(),
      name: 'Sawtooth Generator'
    },
    {
      signal: new Tone.Oscillator(440, 'square').start(),
      name: 'Square Wave Generator'
    },
    {
      signal: new Tone.Player({
        url: sweepUrl,
        autostart: true,
        loop: true
      }),
      name: 'Sweep Sample'
    },
    {
      signal: new Tone.Player({
        url: voiceUrl,
        autostart: true,
        loop: true
      }),
      name: 'Voice Sample'
    }
  ]);

  return <Oscilloscope sources={sources} />;
};

ReactDOM.render(<App />, document.getElementById('oscilloscope-app'));
