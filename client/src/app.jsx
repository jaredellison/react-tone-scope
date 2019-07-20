import React from 'react';
import ReactDOM from 'react-dom';
import Tone from 'tone';

import Oscilloscope from './components/Oscilloscope.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sources : [
        {signal: new Tone.Oscillator(440, 'sine').start().toMaster(), name:'Sine Generator'},
        {signal: new Tone.Oscillator(440, 'sawtooth').start(), name:'Sawtooth Generator'}
      ]
    };
  }

  render() {
    return <Oscilloscope sources={this.state.sources}/>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
