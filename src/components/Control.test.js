import React from 'react';
import { shallow, mount } from 'enzyme';

import Control from './Control.jsx';

describe('Control Component', () => {
  test('Should increment and decrement using arrow buttons', () => {
    const setterFunction = jest.fn(() => {});
    let controlValue = 0;

    const wrapper = shallow(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );

    const buttons = wrapper.find('button');
    const decrementButton = buttons.at(0);
    const incrementButton = buttons.at(1);

    decrementButton.simulate('click');
    incrementButton.simulate('click');

    expect(setterFunction.mock.calls[0][0]).toBe(-0.1);
    expect(setterFunction.mock.calls[1][0]).toBe(0.1);
  });

  test('Should increment and decrement using stepUp and stepDown functions', () => {
    const setterFunction = jest.fn(() => {});
    const handleStepDown = jest.fn(x => x / 2);
    const handleStepUp = jest.fn(x => x * 2);
    let controlValue = 1;

    const wrapper = shallow(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
        handleStepUp={handleStepUp}
        handleStepDown={handleStepDown}
      />
    );

    const buttons = wrapper.find('button');
    const decrementButton = buttons.at(0);
    const incrementButton = buttons.at(1);

    decrementButton.simulate('click');
    incrementButton.simulate('click');

    expect(setterFunction.mock.calls[0][0]).toBe(0.5);
    expect(setterFunction.mock.calls[1][0]).toBe(2);
    expect(handleStepUp.mock.calls.length).toBe(1);
    expect(handleStepDown.mock.calls.length).toBe(1);
  });

  test('handleChange method should accept integer input', () => {
    const setterFunction = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = shallow(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );
    const instance = wrapper.instance();

    expect(wrapper.state('tempValue')).toBe('');
    instance.handleChange({ target: { value: '5' } });
    expect(wrapper.state('tempValue')).toBe('5');
  });

  test('handleChange method should filter non-integer input', () => {
    const setterFunction = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = shallow(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );
    const instance = wrapper.instance();

    expect(wrapper.state('tempValue')).toBe('');
    instance.handleChange({ target: { value: '5abcd' } });
    expect(wrapper.state('tempValue')).toBe('5');
  });

  test('handleChange method should accept negative and float input', () => {
    const setterFunction = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = shallow(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );
    const instance = wrapper.instance();

    expect(wrapper.state('tempValue')).toBe('');
    instance.handleChange({ target: { value: '-0.1' } });
    expect(wrapper.state('tempValue')).toBe('-0.1');
  });

  test('handleEnterEvent method should call setter function when value is a number', () => {
    const setterFunction = jest.fn(() => {});
    const mockBlur = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = shallow(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );
    const instance = wrapper.instance();

    const enterEvent = {
      code: 'Enter',
      target: {
        value: '999',
        blur: mockBlur,
      }
    };

    instance.handleEnterEvent(enterEvent);
    expect(setterFunction.mock.calls[0][0]).toBe(999);
  });

  test('handleEnterEvent method should not call setter function if value is not a number', () => {
    const setterFunction = jest.fn(() => {});
    const mockBlur = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = shallow(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );
    const instance = wrapper.instance();

    const enterEvent = {
      code: 'Enter',
      target: {
        value: 'abc',
        blur: mockBlur,
      }
    };

    instance.handleEnterEvent(enterEvent);
    expect(setterFunction.mock.calls.length).toBe(0);
  });

  test('handleEnterEvent should blur the target element', () => {
    const setterFunction = jest.fn(() => {});
    const mockBlur = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = shallow(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );
    const instance = wrapper.instance();

    const enterEvent = {
      code: 'Enter',
      target: {
        value: '1',
        blur: mockBlur,
      }
    };

    instance.handleEnterEvent(enterEvent);
    expect(mockBlur.mock.calls.length).toBe(1);
  });

  test('handleEnterEvent method should do nothing if code is not "Enter"', () => {
    const setterFunction = jest.fn(() => {});
    const mockBlur = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = shallow(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );
    const instance = wrapper.instance();

    const enterEvent = {
      code: 'Space',
      target: {
        value: 'abc',
        blur: mockBlur,
      }
    };

    instance.handleEnterEvent(enterEvent);
    expect(setterFunction.mock.calls.length).toBe(0);
    expect(mockBlur.mock.calls.length).toBe(0);
  });

  test('handleFocus method should trigger editing state', () => {
    const setterFunction = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );
    const instance = wrapper.instance();

    expect(wrapper.state('editing')).toBe(false);
    instance.handleFocus();
    expect(wrapper.state('tempValue')).toBe('');
    expect(wrapper.state('editing')).toBe(true);
  });

  test('handleBlur method should remove editing state', () => {
    const setterFunction = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setterFunction={setterFunction}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );
    const instance = wrapper.instance();

    expect(wrapper.state('editing')).toBe(false);
    instance.handleFocus();
    expect(wrapper.state('tempValue')).toBe('');
    expect(wrapper.state('editing')).toBe(true);
    instance.handleBlur();
    expect(wrapper.state('editing')).toBe(false);
  });
});
