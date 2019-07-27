import React, { useState, useEffect } from 'react';
import Tone from 'tone';

class Volume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: 0,
      mute: true,
      inputConnection: null,
      volumeNode: new Tone.Volume({ volume: 0, mute: true }).toMaster()
    };

    this.handleSlide = this.handleSlide.bind(this);
    this.handleMute = this.handleMute.bind(this);
  }

  handleSlide(e) {
    const { value } = e.target;
    this.setState({ volume: value, mute: false });
    const scaled = Math.log(value) * 24;
    this.state.volumeNode.volume.value = scaled;
  }

  handleMute(e) {
    const { mute } = this.state;
    this.setState({ mute: !mute });
    this.state.volumeNode.mute = !mute;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.input !== state.inputConnection) {
      if (state.inputConnection !== null)
        state.inputConnection.disconnect(state.volumeNode);
      if (props.input !== null) props.input.connect(state.volumeNode);
      return {
        inputConnection: props.input
      };
    }

    return null;
  }

  render() {
    const { mute, volume } = this.state;

    return (
      <div className="volume-container">
        <label htmlFor="mute" className="control-label">
          Mute
        </label>
        <input
          type="checkbox"
          id="mute"
          name="mute"
          onChange={this.handleMute}
          checked={mute}
        />
        <label htmlFor="volume-control" className="control-label">
          Volume Control
        </label>
        <input
          type="range"
          id="volume-control"
          name="volume-control"
          min={0}
          max={1}
          step={0.01}
          onChange={this.handleSlide}
          defaultValue={volume}
        />
      </div>
    );
  }
}

export default Volume;
