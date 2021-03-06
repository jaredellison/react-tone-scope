import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import Control from './Control.jsx';

describe('Control Component', () => {
  test('Should increment and decrement using arrow buttons', () => {
    const setValue = jest.fn(() => {});
    let controlValue = 0;

    const wrapper = mount(
      <Control
        setValue={setValue}
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

    expect(setValue.mock.calls[0][0]).toBe(-0.1);
    expect(setValue.mock.calls[1][0]).toBe(0.1);
  });

  test('Should increment and decrement using stepUp and stepDown functions', () => {
    const setValue = jest.fn(() => {});
    const handleStepDown = jest.fn((x) => x / 2);
    const handleStepUp = jest.fn((x) => x * 2);
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
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

    expect(setValue.mock.calls[0][0]).toBe(0.5);
    expect(setValue.mock.calls[1][0]).toBe(2);
    expect(handleStepUp.mock.calls.length).toBe(1);
    expect(handleStepDown.mock.calls.length).toBe(1);
  });

  test('handleChange method should accept integer input', () => {
    const setValue = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );

    const input = wrapper.find('input');

    act(() => {
      input.simulate('focus');
      input.simulate('change', { target: { value: '5' } });
    });

    wrapper.update();

    expect(wrapper.find('input').props().value).toBe('5');

    act(() => {
      input.simulate('focus');
      input.simulate('change', { target: { value: '6' } });
    });

    wrapper.update();

    expect(wrapper.find('input').props().value).toBe('6');
  });

  test('handleChange method should filter non-integer input', () => {
    const setValue = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );

    const input = wrapper.find('input');

    act(() => {
      input.simulate('focus');
      input.simulate('change', { target: { value: '5abcd' } });
    });

    wrapper.update();

    expect(wrapper.find('input').props().value).toBe('5');
  });

  test('handleChange method should accept negative and float input', () => {
    const setValue = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
        id="control-component"
        label="Label String"
        unit="ms / Div"
        step={0.1}
        value={controlValue}
      />
    );

    const input = wrapper.find('input');

    act(() => {
      input.simulate('focus');
      input.simulate('change', { target: { value: '-0.1' } });
    });

    wrapper.update();

    expect(wrapper.find('input').props().value).toBe('-0.1');
  });

  xtest('handleEnterEvent method should call setter function when value is a number', () => {
    const setValue = jest.fn(() => {});
    const mockBlur = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
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
        blur: mockBlur
      }
    };

    instance.handleEnterEvent(enterEvent);
    expect(setValue.mock.calls[0][0]).toBe(999);
  });

  xtest('handleEnterEvent method should not call setter function if value is not a number', () => {
    const setValue = jest.fn(() => {});
    const mockBlur = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
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
        blur: mockBlur
      }
    };

    instance.handleEnterEvent(enterEvent);
    expect(setValue.mock.calls.length).toBe(0);
  });

  xtest('handleEnterEvent should blur the target element', () => {
    const setValue = jest.fn(() => {});
    const mockBlur = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
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
        blur: mockBlur
      }
    };

    instance.handleEnterEvent(enterEvent);
    expect(mockBlur.mock.calls.length).toBe(1);
  });

  xtest('handleEnterEvent method should do nothing if code is not "Enter"', () => {
    const setValue = jest.fn(() => {});
    const mockBlur = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
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
        blur: mockBlur
      }
    };

    instance.handleEnterEvent(enterEvent);
    expect(setValue.mock.calls.length).toBe(0);
    expect(mockBlur.mock.calls.length).toBe(0);
  });

  xtest('handleFocus method should trigger editing state', () => {
    const setValue = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
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

  xtest('handleBlur method should remove editing state', () => {
    const setValue = jest.fn(() => {});
    let controlValue = 1;

    const wrapper = mount(
      <Control
        setValue={setValue}
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
