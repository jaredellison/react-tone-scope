import React from 'react';
import Tone from 'tone';

class Oscilloscope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      samples: [0],
      angle: 0
    };

    this.waveform = new Tone.Waveform(2 ** 12);

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
    this.setState({
      samples: this.waveform.getValue()
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
    return (
      <div id="oscilloscope-container">
        <p>Oscilloscope</p>
        <Screen samples={this.state.samples} />
        <div id="controls">
          <select onChange={this.handleSelect}>
            <option value={-1}></option>
            {this.props.sources.map((source, i) => (
              <option key={i} value={i}>
                {source.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 350,
      width: 350,
      divsV: 8,
      divsH: 8
    };
  }

  scale(n, inMin, inMax, outMin, outMax) {
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;
    const ratio = (n - inMin) / inRange;
    return ratio * outRange + outMin;
  }

  render() {
    const { width, height, divsV, divsH } = this.state;
    const { samples } = this.props;

    const verticalDivs = new Array(divsV).fill(null).map((v, i) => {
      const position = (i / divsV) * width;
      return (
        <line
          x1={position}
          y1="0"
          x2={position}
          y2={height}
          stroke={i === divsV / 2 ? 'grey' : 'lightgrey'}
        />
      );
    });

    const horizontalDivs = new Array(divsH).fill(null).map((v, i) => {
      const position = (i / divsH) * width;
      return (
        <line
          x1="0"
          y1={position}
          x2={width}
          y2={position}
          stroke={i === divsH / 2 ? 'grey' : 'lightgrey'}
        />
      );
    });

    const traceString = samples.reduce((a, v, i) => {
      const x = this.scale(i, 0, samples.length, 0, width);
      const y = this.scale(v, -1, 1, 0, width);

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
        {verticalDivs}
        {horizontalDivs}
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

export default Oscilloscope;
