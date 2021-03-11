import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as Tone from 'tone';

import Oscilloscope from './Oscilloscope';

const mockGetValue = jest.fn(() => new Float32Array(10).fill(0));

jest.mock('tone', () => ({
  Oscillator: class {
    start() {}
  },
  Waveform: class {
    getValue = mockGetValue;
  },
  Volume: class {
    toDestination() {}
  },
  context: { state: 'not-running', resume: jest.fn() }
}));

describe('Oscilloscope Component', () => {
  it('Should render 1 select element, 3 control components and 1 volume component ', () => {
    const sources = [
      {
        signal: new Tone.Oscillator(440, 'sine').start(),
        name: 'Sine Generator'
      }
    ];

    const wrapper = mount(<Oscilloscope sources={sources} />);

    expect(wrapper.find('select').length).toBe(1);
    expect(wrapper.find('.control-container').length).toBe(3);
    expect(wrapper.find('.volume-container').length).toBe(1);
  });

  it('Should render names of signal sources', () => {
    const sources = [
      {
        signal: new Tone.Oscillator(440, 'sine').start(),
        name: 'Sine Generator'
      }
    ];

    const wrapper = mount(<Oscilloscope sources={sources} />);

    expect(wrapper.find('option').at(1).text()).toBe('Sine Generator');
  });

  it('Should use requestAnimationFrame to acquire samples', () => {
    let callCount = 0;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      if (callCount < 1) {
        callCount++;
        callback(0);
      }
      return 0;
    });

    mockGetValue.mockClear();

    const sources = [
      {
        signal: new Tone.Oscillator(440, 'sine').start(),
        name: 'Sine Generator'
      }
    ];

    const wrapper = mount(<Oscilloscope sources={sources} />);

    expect(mockGetValue).toHaveBeenCalled();
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('Should allow users to select different sources', () => {
    const mockSignalA = {
      connect: jest.fn(() => {}),
      disconnect: jest.fn(() => {})
    };

    const mockSignalB = {
      connect: jest.fn(() => {}),
      disconnect: jest.fn(() => {})
    };

    const sources = [
      {
        signal: mockSignalA,
        name: 'Mock Signal A'
      },
      {
        signal: mockSignalB,
        name: 'Mock Signal B'
      }
    ];

    const wrapper = mount(<Oscilloscope sources={sources} />);

    expect(mockSignalA.connect).toHaveBeenCalledTimes(0);
    expect(mockSignalB.connect).toHaveBeenCalledTimes(0);

    let onChange;
    // Select input 0
    act(() => {
      const event = {
        currentTarget: { value: '0' }
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange = wrapper.find('select').prop('onChange');
      if (onChange) onChange(event);
    });

    wrapper.update();

    expect(mockSignalA.connect).toHaveBeenCalledTimes(2);
    expect(mockSignalB.connect).toHaveBeenCalledTimes(0);

    // Select input 1
    act(() => {
      const event = {
        currentTarget: { value: '1' }
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange = wrapper.find('select').prop('onChange');
      if (onChange) onChange(event);
    });

    wrapper.update();

    expect(mockSignalA.disconnect).toHaveBeenCalledTimes(2);
    expect(mockSignalB.connect).toHaveBeenCalledTimes(2);

    // set back to null with -1
    act(() => {
      const event = {
        currentTarget: { value: '-1' }
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange = wrapper.find('select').prop('onChange');
      if (onChange) onChange(event);
    });

    wrapper.update();
    expect(mockSignalB.disconnect).toHaveBeenCalledTimes(2);
  });

  it('Should resume the Tone audio context when a source is selected', () => {
    (Tone.context.resume as jest.Mock).mockClear();

    const mockSignal = {
      connect: jest.fn(() => {}),
      disconnect: jest.fn(() => {})
    };

    const sources = [
      {
        signal: mockSignal,
        name: 'Sine Generator'
      }
    ];

    const wrapper = shallow(<Oscilloscope sources={sources} />);

    let onChange;
    // Select input 0
    act(() => {
      const event = {
        currentTarget: { value: '0' }
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange = wrapper.find('select').prop('onChange');
      if (onChange) onChange(event);
    });

    expect(Tone.context.resume).toHaveBeenCalledTimes(1);
  });
});
