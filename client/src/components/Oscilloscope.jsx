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

  bindInput(index) {
    // Find signal source
    const newInput = this.props.sources[index];
    const currentIntput = this.state.input;

    // Remove previous input
    if (currentIntput !== null && currentIntput !== newInput) {
      currentIntput.disconnect(this.waveform);
    }

    // Connect input
    newInput.signal.connect(this.waveform);
    this.setState({
      input: newInput.signal
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
              <option key={i} value={i}>{source.name}</option>
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
