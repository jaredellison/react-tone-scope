import React from 'react';
import Tone from 'tone';

import Control from './Control.jsx';

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
      horizontalScale: .001, // seconds per division
      triggerLevel: 0
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
      if (samples[lower] <= triggerLevel && samples[lower + 1] >= triggerLevel) {
        return samples.slice(lower - halfTrimmedSamples, lower + halfTrimmedSamples);
      }
      if (samples[upper] <= triggerLevel && samples[upper + 1] >= triggerLevel) {
        return samples.slice(upper - halfTrimmedSamples, upper + halfTrimmedSamples);
      }
      lower--;
      upper++;
    }

    // No match found, a chunk of samples around the midpoint
    return samples.slice(halfTrimmedSamples/2, halfTotalSamples + (halfTrimmedSamples/2));
  }

  animate() {
    const totalSamples = this.waveform.getValue();
    const { triggerLevel } = this.state;
    const sampleCount = SAMPLE_RATE * VERTICAL_DIVISIONS * this.state.horizontalScale;
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
    const { samples, verticalScale, horizontalScale, triggerLevel } = this.state;

    return (
      <div id="oscilloscope-container">
        <Screen samples={samples} verticalScale={verticalScale} horizontalScale={horizontalScale}/>
        <div id="controls">
        <p>Oscilloscope</p>
          <label className="control-label">Input Source</label>

          <select onChange={this.handleSelect}>
            <option value={-1}> - none -</option>
            {this.props.sources.map((source, i) => (
              <option key={i} value={i}>
                {source.name}
              </option>
            ))}
          </select>

          <Control
          setterFunction={(value) => {
            this.setState({verticalScale: value});
          }}
          id="vertical-scale-control"
          label="Vertical Scale"
          step={0.1}
          value={verticalScale}
          />

          <Control
          setterFunction={(value) => {
            this.setState({horizontalScale: value});
          }}
          id="horizontal-scale-control"
          label="Horizontal Scale"
          step={0.0001}
          value={horizontalScale}
          />

          <Control
          setterFunction={(value) => {
            this.setState({triggerLevel: value});
          }}
          id="trigger-level-control"
          label="Trigger Level"
          step={0.1}
          value={triggerLevel}
          />

        </div>
      </div>
    );
  }
}

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 280,
      width: 350,
      divsV: VERTICAL_DIVISIONS,
      divsH: HORIZONTAL_DIVISIONS
    };
  }

  scale(n, inMin, inMax, outMin, outMax, factor = 1) {
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;
    const ratio = (n * factor - inMin) / inRange;
    return ratio * outRange + outMin;
  }

  render() {
    const { width, height, divsV, divsH } = this.state;
    const { samples, verticalScale, horizontalScale } = this.props;

    const traceString = samples.reduce((a, v, i) => {
      const x = this.scale(i, 0, samples.length, 0, width);
      const y = this.scale(-1 * v, -1, 1, 0, height, verticalScale / 4);

      // Set starting position
      if (i === 0) {
        return a + `M ${x}, ${y} `;
      } else {
        return a + `L ${x}, ${y} `;
      }
    }, '');

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        stroke="black"
        fill="white"
      >
        <rect width={width} height={height} rx="5" />
        <Divisions
          orientation={'vertical'}
          total={10}
          width={width}
          height={height}
        />
        <Divisions
          orientation={'horizontal'}
          total={8}
          width={width}
          height={height}
        />
        <path
          d={traceString}
          stroke="blue"
          strokeWidth="2"
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
    );
  }
}

const Divisions = ({ orientation, total, width, height }) => {
  let divs = new Array(total).fill(null);

  if (orientation === 'vertical') {
    divs = divs.map((v, i) => {
      const position = (i / total) * width;
      return (
        <line
          key={i}
          x1={position}
          y1="0"
          x2={position}
          y2={height}
          stroke={i === total / 2 ? 'grey' : 'lightgrey'}
        />
      );
    });
  } else if (orientation === 'horizontal') {
    divs = divs.fill(null).map((v, i) => {
      const position = (i / total) * height;
      return (
        <line
          key={i}
          x1="0"
          y1={position}
          x2={width}
          y2={position}
          stroke={i === total / 2 ? 'grey' : 'lightgrey'}
        />
      );
    });
  }

  return divs;
};

export default Oscilloscope;
