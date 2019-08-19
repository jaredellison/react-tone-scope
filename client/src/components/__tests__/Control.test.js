import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import Control from '../Control.jsx';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('Control Component', () => {
  test('Should increment and decrement using arrow buttons', () => {
    const setterFunction = jest.fn(() => {});
    let controlValue = 0;

    act(() => {
      ReactDOM.render(
        <Control
          setterFunction={setterFunction}
          id="control-component"
          label="Label String"
          unit="ms / Div"
          step={0.1}
          value={controlValue}
        />,
        container
      );
    });

    const buttons = container.getElementsByTagName('button');
    const decrementButton = buttons[0];
    const incrementButton = buttons[1];

    act(() => {
      decrementButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      incrementButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(setterFunction.mock.calls[0][0]).toBe(-0.1);
    expect(setterFunction.mock.calls[1][0]).toBe(0.1);
  });

  test('Should increment and decrement using stepUp and stepDown functions', () => {
    const setterFunction = jest.fn(() => {});
    const handleStepDown = jest.fn(x => x / 2);
    const handleStepUp = jest.fn(x => x * 2);
    let controlValue = 1;

    act(() => {
      ReactDOM.render(
        <Control
          setterFunction={setterFunction}
          id="control-component"
          label="Label String"
          unit="ms / Div"
          step={0.1}
          value={controlValue}
          handleStepUp={handleStepUp}
          handleStepDown={handleStepDown}
        />,
        container
      );
    });

    const buttons = container.getElementsByTagName('button');
    const decrementButton = buttons[0];
    const incrementButton = buttons[1];

    act(() => {
      decrementButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      incrementButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(setterFunction.mock.calls[0][0]).toBe(0.5);
    expect(setterFunction.mock.calls[1][0]).toBe(2);
    expect(handleStepUp.mock.calls.length).toBe(1);
    expect(handleStepDown.mock.calls.length).toBe(1);
  });
});
