import React, { useState, useEffect } from 'react';

import Divisions from './Divisions.js';
import { scaleCoordinate } from '../utils/utils.tsx';

const SCREEN_HEIGHT = 280;
const SCREEN_WIDTH = 350;

const Screen = ({ divsV, divsH, samples, verticalScale, triggerValue }) => {
  const [shouldRenderTriggerLine, setShouldRenderTriggerLine] = useState(false);

  useEffect(() => {
    setShouldRenderTriggerLine(true);

    const id = setTimeout(() => {
      setShouldRenderTriggerLine(false);
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [triggerValue]);

  const traceString = samples.reduce((a, v, i) => {
    const x = scaleCoordinate(i, 0, samples.length, 0, SCREEN_WIDTH);
    const y = scaleCoordinate(-1 * v, -1, 1, 0, SCREEN_HEIGHT, 0.25 / verticalScale);

    // Set starting position
    if (i === 0) {
      return a + `M ${x}, ${y} `;
    } else {
      return a + `L ${x}, ${y} `;
    }
  }, '');

  let triggerLine = null;
  if (shouldRenderTriggerLine) {
    const triggerY = scaleCoordinate(
      -1 * triggerValue,
      -1,
      1,
      0,
      SCREEN_HEIGHT,
      0.25 / verticalScale
    );
    triggerLine = (
      <line x1="0" y1={triggerY} x2={SCREEN_WIDTH} y2={triggerY} stroke={'red'} />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      xmlns="http://www.w3.org/2000/svg"
      stroke="black"
      fill="white"
    >
      <rect width={SCREEN_WIDTH} height={SCREEN_HEIGHT} rx="5" />
      <Divisions
        orientation={'vertical'}
        total={divsV}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
      />
      <Divisions
        orientation={'horizontal'}
        total={divsH}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
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
};

export default Screen;
