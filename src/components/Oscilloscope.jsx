import React from 'react';
import Tone from 'tone';

import Control from './Control.jsx';
import Screen from './Screen.jsx';
import Volume from './Volume.jsx';

import { trimSamples, trimSampleArray, findCrossover } from '../utils/utils.js';

// MAX_SAMPLES Must be a power of 2
// Increasing MAX_SAMPLES will increase horizontal resolution but also the
// latency of rendering.
// 2 ** 10 or 1024 samples has good latency and is okay for most of audio range.
// 2 ** 14 or 16,384 samples provides better resolution for low frequencies but
//  show may noticable latency in rendering.
const MAX_SAMPLES = 2 ** 10;

const SAMPLE_RATE = 44100;
const VERTICAL_DIVISIONS = 10;
const HORIZONTAL_DIVISIONS = 8;

class Oscilloscope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      samples: [],
      verticalScale: 0.25,
      horizontalScale: 1, // milliseconds per division
      triggerLevel: 0,
      showTriggerLine: false,
      triggerClearTimeout: null,
      volumeMute: true,
      volumeValue: 0,
      audioStarted: false
    };

    this.waveform = new Tone.Waveform(MAX_SAMPLES);
    this.volume = new Tone.Volume({ volume: 0, mute: true }).toMaster();

    this.animate = this.animate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.bindInput = this.bindInput.bind(this);
  }

  componentDidMount() {
    this.animationId = requestAnimationFrame(this.animate);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationId);
  }

  animate() {
    const totalSamples = this.waveform.getValue();
    const { triggerLevel, horizontalScale } = this.state;
    const trimLength = (SAMPLE_RATE * VERTICAL_DIVISIONS * horizontalScale) / 1000;

    if (totalSamples.length > 0) {
      const crossover = findCrossover(totalSamples, triggerLevel);
      const samples = trimSamples(totalSamples, crossover, trimLength);
      this.setState({
        samples: samples
      });
    }
    requestAnimationFrame(this.animate);
  }

  bindInput(index) {
    // Find signal source
    const currentInput = this.state.input;
    const newInput = this.props.sources[index] || null;

    // Remove previous input
    if (currentInput !== null && currentInput !== newInput) {
      currentInput.disconnect(this.waveform);
      currentInput.disconnect(this.volume);
    }

    if (newInput !== null) {
      // Connect input
      newInput.signal.connect(this.waveform);
      newInput.signal.connect(this.volume);
      this.setState({
        input: newInput.signal
      });
    } else {
      this.setState({
        input: newInput
      });
    }
  }

  handleSelect(e) {
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
      this.setState({ audioStarted: true });
    }
    this.bindInput(e.target.value);
  }

  render() {
    const {
      samples,
      verticalScale,
      horizontalScale,
      showTriggerLine,
      triggerLevel,
      volumeMute,
      volumeValue
    } = this.state;

    return (
      <div id="oscilloscope-container">
        <Screen
          samples={samples}
          verticalScale={verticalScale}
          divsV={VERTICAL_DIVISIONS}
          divsH={HORIZONTAL_DIVISIONS}
          renderTiggerLine={showTriggerLine}
          triggerValue={triggerLevel}
        />
        <div id="controls">
          <p>Oscilloscope</p>

          <label className="control-label">Input Source</label>
          <select onChange={this.handleSelect}>
            <option value={-1}> - none - </option>
            {this.props.sources.map((source, i) => (
              <option key={i} value={i}>
                {source.name}
              </option>
            ))}
          </select>

          <Control
            setValue={(value) => {
              this.setState({ verticalScale: value });
            }}
            id="vertical-scale-control"
            label="Vertical Scale"
            unit="Units / Div"
            value={verticalScale}
            handleStepUp={(value) => value * 2}
            handleStepDown={(value) => value / 2}
          />

          <Control
            setValue={(value) => {
              this.setState({ horizontalScale: value });
            }}
            id="horizontal-scale-control"
            label="Horizontal Scale"
            unit="ms / Div"
            step={0.1}
            value={horizontalScale}
          />

          <Control
            setValue={(value) => {
              // Reset timer if it has already been set
              const { triggerClearTimeout } = this.state;
              if (triggerClearTimeout !== null) clearTimeout(triggerClearTimeout);
              const id = setTimeout(() => {
                this.setState({
                  showTriggerLine: false,
                  triggerClearTimeout: null
                });
              }, 1000);
              this.setState({
                triggerLevel: value,
                showTriggerLine: true,
                triggerClearTimeout: id
              });
            }}
            id="trigger-level-control"
            label="Trigger Level"
            unit="Units"
            step={0.1}
            value={triggerLevel}
          />

          <Volume
            mute={volumeMute}
            value={volumeValue}
            setMute={(value) => {
              this.setState({ volumeMute: value });
              this.volume.mute = value;
            }}
            setValue={(value) => {
              const scaled = Math.log(value) * 24;
              this.setState({ volumeValue: value, volumeMute: false });
              this.volume.mute = false;
              this.volume.volume.value = scaled;
            }}
          />
        </div>
      </div>
    );
  }
}

export default Oscilloscope;
