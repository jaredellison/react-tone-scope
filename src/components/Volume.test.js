import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import TestUtils from 'react-dom/test-utils';

import Volume from './Volume.jsx';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('Volume Component', () => {
  test('Toggling mute calls muteSetter', () => {
    const muteSetter = jest.fn(() => {});
    const volumeSetter = jest.fn(() => {});
    let muteValue = true;
    let volumeValue = 0;

    act(() => {
      ReactDOM.render(
        <Volume mute={muteValue} value={volumeValue} setMute={muteSetter} setValue={volumeSetter} />,
        container
      );
    });

    const muteInput = document.getElementById('mute');
    act(() => {
      muteInput.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(muteSetter.mock.calls.length).toBe(1);
    expect(volumeSetter.mock.calls.length).toBe(0);
  });

  test('Changing volume passes number value to volume setter function', () => {
    const muteSetter = jest.fn(() => {});
    const volumeSetter = jest.fn(() => {});
    let muteValue = true;
    let volumeValue = 0;

    act(() => {
      ReactDOM.render(
        <Volume mute={muteValue} value={volumeValue} setMute={muteSetter} setValue={volumeSetter} />,
        container
      );
    });

    const volumeInput = document.getElementById('volume-control');
    act(() => {
      TestUtils.Simulate.change(volumeInput, { target: { value: '0.5' } });
    });

    expect(muteSetter.mock.calls.length).toBe(0);
    expect(volumeSetter.mock.calls.length).toBe(1);
    expect(volumeSetter.mock.calls[0][0]).toBe(0.5);
  });
});
