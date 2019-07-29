import React from 'react';
import ReactDOM from 'react-dom';
import Tone from 'tone';

import Oscilloscope from './components/Oscilloscope.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sources : [
        {signal: new Tone.Oscillator(440, 'sine').start(), name:'Sine Generator'},
        {signal: new Tone.Oscillator(440, 'sawtooth').start(), name:'Sawtooth Generator'},
        {signal: new Tone.Oscillator(440, 'square').start(), name:'Square Wave Generator'},
        {signal: new Tone.Player({
          "url" : "/audio/chirp.mp3",
          "autostart" : true,
          "loop": true
        }), name:'Sweep Sample'},
        {signal: new Tone.Player({
          "url" : "/audio/hello.mp3",
          "autostart" : true,
          "loop": true
        }), name:'Voice Sample'}
      ]
    };
  }

  render() {
    return <Oscilloscope sources={this.state.sources}/>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
