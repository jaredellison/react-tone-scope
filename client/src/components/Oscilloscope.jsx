import React from 'react';
import Tone from 'tone';

class Oscilloscope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      samples: [0],
      verticalScale: 1
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
    const { samples, verticalScale } = this.state;

    return (
      <div id="oscilloscope-container">
        <p>Oscilloscope</p>
        <Screen samples={samples} verticalScale={verticalScale} />
        <div id="controls">
          <select onChange={this.handleSelect}>
            <option value={-1} />
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
      height: 280,
      width: 350,
      divsV: 10,
      divsH: 8
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
    const { samples, verticalScale } = this.props;

    const traceString = samples.reduce((a, v, i) => {
      const x = this.scale(i, 0, samples.length, 0, width);
      const y = this.scale(v, -1, 1, 0, height, verticalScale / 4);

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
