import React from 'react';
import Tone from 'tone';

class Oscilloscope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      samples: new Array(256).fill(0),
      angle: 0
    };
    this.waveform = new Tone.Waveform(256);

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

  bindInput(sourceName) {
    // Find signal source
    const { sources } = this.props;
    const currentIntput = this.state.input;
    let option;

    for (let i = 0; i < sources.length; i++) {
      if (sourceName === sources[i].name) {
        option = sources[i];
        break;
      }
      if (i === sources.length - 1) {
        return;
      }
    }

    // Remove previous input
    if (currentIntput !== null && currentIntput !== option.signal) {
      currentIntput.disconnect(this.waveform);
    }

    // Connect input
    option.signal.connect(this.waveform);
    this.setState({
      input: option.signal
    });
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
              <option></option>
            {this.props.sources.map((source, i) => (
              <option key={i}>{source.name}</option>
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
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    const { samples } = this.props;
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const lineWidth = 2;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'lightyellow';

    samples.forEach((v, i) => {
      const x = this.scale(i, 0, samples.length, 0, width);
      const y = this.scale(v, -1, 1, 0, width);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }

  scale(n, inMin, inMax, outMin, outMax) {
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;
    const ratio = (n - inMin) / inRange;
    return ratio * outRange + outMin;
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        id="oscilloscope-screen"
        width="300"
        height="300"
      >
        signal visualization
      </canvas>
    );
  }
}

export default Oscilloscope;
