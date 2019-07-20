import React from 'react';
import ReactDOM from 'react-dom';
import Tone from 'tone';

import Oscilloscope from './components/Oscilloscope.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sources : [{source: new Tone.Oscillator(440, 'sine'), name:'Sine Generator'}]
    };
  }

  render() {
    return <Oscilloscope sources={this.state.sources}/>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
