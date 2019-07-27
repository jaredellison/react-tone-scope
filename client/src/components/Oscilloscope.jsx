import React from 'react';
import Tone from 'tone';

import Control from './Control.jsx';
import Screen from './Screen.jsx';

const MAX_SAMPLES = 2 ** 14;
const SAMPLE_RATE = 44100;
const VERTICAL_DIVISIONS = 10;
const HORIZONTAL_DIVISIONS = 8;

class Oscilloscope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      samples: [],
      verticalScale: 4,
      horizontalScale: 1, // milliseconds per division
      triggerLevel: 0,
      divsH: HORIZONTAL_DIVISIONS,
      divsV: VERTICAL_DIVISIONS,
      showTriggerLine: false,
      triggerClearTimeout: null
    };

    this.waveform = new Tone.Waveform(MAX_SAMPLES);

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

  trimSamples(samples, sampleCount, triggerLevel) {
    // Bitwise shift twice because samples are stereo pairs
    let halfTotalSamples = MAX_SAMPLES >> 2;
    let halfTrimmedSamples = sampleCount >> 2;
    // Start upper and lower around midpoint of totalSamples
    let lower = halfTotalSamples;
    let upper = 1 + halfTotalSamples;

    while (lower >= 0 && upper <= MAX_SAMPLES) {
      if (
        samples[lower] <= triggerLevel &&
        samples[lower + 1] >= triggerLevel
      ) {
        return samples.slice(
          lower - halfTrimmedSamples,
          lower + halfTrimmedSamples
        );
      }
      if (
        samples[upper] <= triggerLevel &&
        samples[upper + 1] >= triggerLevel
      ) {
        return samples.slice(
          upper - halfTrimmedSamples,
          upper + halfTrimmedSamples
        );
      }
      lower--;
      upper++;
    }

    // No match found, a chunk of samples around the midpoint
    return samples.slice(
      halfTrimmedSamples / 2,
      halfTotalSamples + halfTrimmedSamples / 2
    );
  }

  animate() {
    const totalSamples = this.waveform.getValue();
    const { triggerLevel } = this.state;
    const sampleCount =
      SAMPLE_RATE * VERTICAL_DIVISIONS * this.state.horizontalScale / 1000;
    const samples = this.trimSamples(totalSamples, sampleCount, triggerLevel);

    this.setState({
      samples: samples
    });
    requestAnimationFrame(this.animate);
  }

  bindInput(index) {
    // Find signal source
    const currentInput = this.state.input;
    const newInput = this.props.sources[index] || null;

    // Remove previous input
    if (currentInput !== null && currentInput !== newInput) {
      currentInput.disconnect(this.waveform);
    }

    if (newInput !== null) {
      // Connect input
      newInput.signal.connect(this.waveform);
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
    }
    this.bindInput(e.target.value);
  }

  render() {
    const {
      samples,
      verticalScale,
      horizontalScale,
      divsV,
      divsH,
      showTriggerLine,
      triggerLevel
    } = this.state;

    return (
      <div id="oscilloscope-container">
        <Screen
          samples={samples}
          verticalScale={verticalScale}
          horizontalScale={horizontalScale}
          divsV={divsV}
          divsH={divsH}
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
            setterFunction={value => {
              this.setState({ verticalScale: value });
            }}
            id="vertical-scale-control"
            label="Vertical Scale"
            unit="Divs / Unit"
            step={0.1}
            value={verticalScale}
          />

          <Control
            setterFunction={value => {
              this.setState({ horizontalScale: value });
            }}
            id="horizontal-scale-control"
            label="Horizontal Scale"
            unit="ms / Div"
            step={0.1}
            value={horizontalScale}
          />

          <Control
            setterFunction={value => {
              // Reset timer if it has already been set
              const { triggerClearTimeout } = this.state;
              if (triggerClearTimeout !== null) clearTimeout(triggerClearTimeout);
              const id = setTimeout(() => {this.setState({ showTriggerLine: false, triggerClearTimeout: null })}, 1000);
              this.setState({ triggerLevel: value, showTriggerLine: true, triggerClearTimeout: id });
            }}
            id="trigger-level-control"
            label="Trigger Level"
            unit="Units"
            step={0.1}
            value={triggerLevel}
          />
        </div>
      </div>
    );
  }
}

export default Oscilloscope;
