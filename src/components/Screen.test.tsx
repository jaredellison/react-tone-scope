import React from 'react';
import { create } from 'react-test-renderer';

import Screen, { IProps } from './Screen';

let container: HTMLElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
});

const defaultProps: IProps = {
  samples: new Float32Array([0, 0, 0, 0, 0]),
  verticalScale: 4,
  divsV: 10,
  divsH: 8,
  triggerValue: 0
};

jest.useFakeTimers();

describe('Screen Component', () => {
  it('Should render a trace string', () => {
    const component = create(<Screen {...defaultProps} />);
    const instance = component.root;
    const pathString = instance.findByType('path').props.d;
    // Screen's default dimensions are: height 280, width 350.
    expect(pathString).toBe('M 0, 140 L 70, 140 L 140, 140 L 210, 140 L 280, 140 ');
  });

  it('Should render a trigger line initially', () => {
    const component = create(<Screen {...defaultProps} />);
    const instance = component.root;
    const triggerLine = instance.findByProps({ stroke: 'red' });
    expect(triggerLine).toBeTruthy();
  });
});
