import React from 'react';
import { shallow, mount } from 'enzyme';
import * as Tone from 'tone';

jest.mock('tone');

import Oscilloscope from './Oscilloscope.js';

describe('Oscilloscope Component', () => {
  test('Renders 1 select element, 3 control components and 1 volume component ', () => {
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

  test('Renders names of signal sources', () => {
    const sources = [
      {
        signal: new Tone.Oscillator(440, 'sine').start(),
        name: 'Sine Generator'
      }
    ];

    const wrapper = mount(<Oscilloscope sources={sources} />);

    expect(wrapper.find('option').at(1).text()).toBe('Sine Generator');
  });

  xtest('animate method acquires samples and schedules a future invocation with requestAnimation frame', () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => {});

    const sources = [
      {
        signal: new Tone.Oscillator(440, 'sine').start(),
        name: 'Sine Generator'
      }
    ];

    const wrapper = shallow(<Oscilloscope sources={sources} />);
    const instance = wrapper.instance();
    const getValueMock = jest.fn(() => new Array(10).fill(0));
    instance.waveform.getValue = getValueMock;

    instance.animate();

    expect(getValueMock.mock.calls.length).toBe(1);
    expect(window.requestAnimationFrame.mock.calls[0][0]).toBe(instance.animate);
    window.requestAnimationFrame.mockRestore();
  });

  xtest('bindInput method sets state with new input', () => {
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

    const wrapper = shallow(<Oscilloscope sources={sources} />);
    const instance = wrapper.instance();

    // null is default
    expect(wrapper.state('input')).toBe(null);

    // Select input 0
    instance.bindInput(0);
    expect(wrapper.state('input')).toBe(sources[0].signal);
    expect(mockSignalA.connect.mock.calls.length).toBe(2);

    // Select input 1
    instance.bindInput(1);
    expect(wrapper.state('input')).toBe(sources[1].signal);
    expect(mockSignalA.disconnect.mock.calls.length).toBe(2);
    expect(mockSignalB.connect.mock.calls.length).toBe(2);

    // set back to null with -1
    instance.bindInput(-1);
    expect(mockSignalA.disconnect.mock.calls.length).toBe(2);
    expect(wrapper.state('input')).toBe(null);
  });

  xtest('handleSelect method causes audio context to resume', () => {
    const mockResume = jest.fn(() => {});
    const mockContext = { state: 'not-running', resume: mockResume };
    Tone.context = mockContext;

    const sources = [
      {
        signal: new Tone.Oscillator(440, 'sine').start(),
        name: 'Sine Generator'
      }
    ];

    const wrapper = shallow(<Oscilloscope sources={sources} />);
    const instance = wrapper.instance();
    const getValueMock = jest.fn(() => new Array(10).fill(0));
    instance.waveform.getValue = getValueMock;

    expect(wrapper.state('audioStarted')).toBe(false);

    instance.handleSelect({ target: { value: 1 } });

    expect(Tone.context.resume.mock.calls.length).toBe(1);
    expect(wrapper.state('audioStarted')).toBe(true);
  });
});
