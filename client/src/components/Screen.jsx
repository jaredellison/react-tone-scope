import React from 'react';

import Divisions from './Divisions.jsx';

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 280,
      width: 350
    };
  }

  scale(n, inMin, inMax, outMin, outMax, factor = 1) {
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;
    const ratio = (n * factor - inMin) / inRange;
    return ratio * outRange + outMin;
  }

  render() {
    const { width, height } = this.state;
    const {
      divsV,
      divsH,
      samples,
      verticalScale,
      horizontalScale,
      renderTiggerLine,
      triggerValue
    } = this.props;

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

    let triggerLine = null;
    if (renderTiggerLine) {
      const triggerY = this.scale(-1 * triggerValue, -1, 1, 0, height, verticalScale / 4);
      triggerLine = (
        <line
          x1="0"
          y1={triggerY}
          x2={width}
          y2={triggerY}
          stroke={'red'}
        />
      );
    }

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
          total={divsV}
          width={width}
          height={height}
        />
        <Divisions
          orientation={'horizontal'}
          total={divsH}
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
        {triggerLine}
      </svg>
    );
  }
}

export default Screen;
