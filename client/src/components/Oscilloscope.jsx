import React from 'react';
import Tone from 'tone';

class Oscilloscope extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="oscilloscope-container">
        <h2>oscilloscope</h2>
        <Screen></Screen>
        <div id="controls">
        <select>
          {this.props.sources.map((source) => <option>{source.name}</option>)}
        </select>
        </div>
      </div>
    )
  }
}

class Screen extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div id="oscilloscope">screen</div>
    )
  }
}

export default Oscilloscope;
