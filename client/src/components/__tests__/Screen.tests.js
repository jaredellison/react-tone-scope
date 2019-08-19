import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { create } from "react-test-renderer";

import Screen from '../Screen.jsx';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('Screen Component', () => {
  test('Renders sensible trace string', () => {
    const props = {
      samples: [0, 0, 0, 0, 0],
      verticalScale: 4,
      divsV: 10,
      divsH: 8,
      renderTiggerLine: false,
      triggerValue: 0
    };


    const component = create(<Screen {...props} />);
    const instance = component.root;
    const pathString = instance.findByType('path').props.d;
    // Screen's default dimensions are: height 280, width 350.
    expect(pathString).toBe('M 0, 140 L 70, 140 L 140, 140 L 210, 140 L 280, 140 ')
  });

  test('Renders triggerLine when renderTriggerLine prop is true', () => {
    const props = {
      samples: [0, 0, 0, 0, 0],
      verticalScale: 4,
      divsV: 10,
      divsH: 8,
      renderTiggerLine: true,
      triggerValue: 0
    };

    const component = create(<Screen {...props} />);
    const instance = component.root;
    const triggerLine = instance.findByProps({stroke:'red'});
    expect(triggerLine).toBeTruthy();
  });

  test('Doesn\'t render triggerLine when renderTriggerLine prop is fase', () => {
    const props = {
      samples: [0, 0, 0, 0, 0],
      verticalScale: 4,
      divsV: 10,
      divsH: 8,
      renderTiggerLine: false,
      triggerValue: 0
    };

    const component = create(<Screen {...props} />);
    const instance = component.root;
    expect(() => {
      const triggerLine = instance.findByProps({stroke:'red'});
    }).toThrow();
  });
});
