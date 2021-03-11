import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import Control from './Control';

describe('Control Component', () => {
  it('should increment and decrement using arrow buttons', () => {
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

    expect(setValue).toHaveBeenNthCalledWith(1, -0.1);
    expect(setValue).toHaveBeenNthCalledWith(2, 0.1);
  });

  it('should increment and decrement using stepUp and stepDown functions', () => {
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
    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenCalledWith(0.5);
    incrementButton.simulate('click');
    expect(setValue).toHaveBeenCalledTimes(2);
    expect(setValue).toHaveBeenCalledWith(2);

    expect(handleStepUp.mock.calls.length).toBe(1);
    expect(handleStepDown.mock.calls.length).toBe(1);
  });

  it('should accept typed integer input', () => {
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

    let onChange;
    act(() => {
      const event = {
        currentTarget: { value: '5' }
      } as React.ChangeEvent<HTMLInputElement>;

      input.simulate('focus');
      onChange = input.prop('onChange');

      if (onChange) onChange(event);
    });

    wrapper.update();

    expect(wrapper.find('input').props().value).toBe('5');

    act(() => {
      const event = {
        currentTarget: { value: '6' }
      } as React.ChangeEvent<HTMLInputElement>;

      input.simulate('focus');
      onChange = input.prop('onChange');

      if (onChange) onChange(event);
    });

    wrapper.update();

    expect(wrapper.find('input').props().value).toBe('6');
  });

  it('should filter non-integer typed input', () => {
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

    let onChange;

    act(() => {
      const event = {
        currentTarget: { value: '5abcd' }
      } as React.ChangeEvent<HTMLInputElement>;

      input.simulate('focus');
      onChange = input.prop('onChange');

      if (onChange) onChange(event);
    });

    wrapper.update();

    expect(wrapper.find('input').props().value).toBe('5');
  });

  it('should accept typed negative and float input', () => {
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

    let onChange;

    act(() => {
      const event = {
        currentTarget: { value: '-0.1' }
      } as React.ChangeEvent<HTMLInputElement>;

      input.simulate('focus');
      onChange = input.prop('onChange');

      if (onChange) onChange(event);
    });

    wrapper.update();

    expect(wrapper.find('input').props().value).toBe('-0.1');
  });

  it('should call setter function when the enter key is pressed and value is a number', () => {
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

    const input = wrapper.find('input');

    let onKeyUp;
    act(() => {
      const event = ({
        code: 'Enter',
        currentTarget: {
          value: '999',
          blur: mockBlur
        }
      } as any) as React.KeyboardEvent<HTMLInputElement>;

      input.simulate('focus');
      onKeyUp = input.prop('onKeyUp');

      if (onKeyUp) onKeyUp(event);
    });

    expect(setValue).toHaveBeenCalledWith(999);
  });

  it('should not call setter function if value is not a number', () => {
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

    const input = wrapper.find('input');

    let onKeyUp;
    act(() => {
      const event = ({
        code: 'Enter',
        currentTarget: {
          value: 'abc',
          blur: mockBlur
        }
      } as any) as React.KeyboardEvent<HTMLInputElement>;

      input.simulate('focus');
      onKeyUp = input.prop('onKeyUp');

      if (onKeyUp) onKeyUp(event);
    });

    expect(setValue).toHaveBeenCalledTimes(0);
  });

  it('should be blured after pressing enter', () => {
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

    const input = wrapper.find('input');

    let onKeyUp;
    act(() => {
      const event = ({
        code: 'Enter',
        currentTarget: {
          value: '999',
          blur: mockBlur
        }
      } as any) as React.KeyboardEvent<HTMLInputElement>;

      input.simulate('focus');
      onKeyUp = input.prop('onKeyUp');

      if (onKeyUp) onKeyUp(event);
    });

    expect(mockBlur).toHaveBeenCalledTimes(1);
  });

  it('should not call setValue if any keys besides "Enter" are pressed', () => {
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

    const input = wrapper.find('input');

    let onKeyUp;
    act(() => {
      const event = ({
        code: 'Space',
        currentTarget: {
          value: '999',
          blur: mockBlur
        }
      } as any) as React.KeyboardEvent<HTMLInputElement>;

      input.simulate('focus');
      onKeyUp = input.prop('onKeyUp');

      if (onKeyUp) onKeyUp(event);
    });

    expect(mockBlur).toHaveBeenCalledTimes(0);
  });
});
