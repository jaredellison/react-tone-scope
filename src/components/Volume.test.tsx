import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import TestUtils from 'react-dom/test-utils';

import Volume from './Volume';

let container: HTMLElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
});

describe('Volume Component', () => {
  test('Toggling mute calls muteSetter', () => {
    const muteSetter = jest.fn(() => {});
    const volumeSetter = jest.fn(() => {});
    let muteValue = true;
    let volumeValue = 0;

    act(() => {
      ReactDOM.render(
        <Volume
          mute={muteValue}
          value={volumeValue}
          setMute={muteSetter}
          setValue={volumeSetter}
        />,
        container
      );
    });

    const muteInput = document.getElementById('mute');
    if (!muteInput) fail();

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
        <Volume
          mute={muteValue}
          value={volumeValue}
          setMute={muteSetter}
          setValue={volumeSetter}
        />,
        container
      );
    });

    const volumeInput = document.getElementById('volume-control') as HTMLInputElement;
    if (!volumeInput) fail();
    act(() => {
      const changeEvent = {
        target: { value: '0.5' }
      } as React.ChangeEvent<HTMLInputElement>;

      TestUtils.Simulate.change(volumeInput, changeEvent as any);
    });

    expect(muteSetter).toHaveBeenCalledTimes(0);
    expect(volumeSetter).toHaveBeenCalledTimes(1);
    expect(volumeSetter).toHaveBeenCalledWith(0.5);
  });
});
