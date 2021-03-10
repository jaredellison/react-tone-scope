import React, { useState, useLayoutEffect, useRef } from 'react';
import * as Tone from 'tone';

import { SourceOption } from '../app';
import Control from './Control';
import Screen from './Screen';
import Volume from './Volume';

import { trimSamples, findCrossover } from '../utils/utils';

// MAX_SAMPLES Must be a power of 2
// Increasing MAX_SAMPLES will increase horizontal resolution but also the
// latency of rendering.
// 2 ** 10 or 1024 samples has good latency and is okay for most of audio range.
// 2 ** 14 or 16,384 samples provides better resolution for low frequencies but
//  show may noticable latency in rendering.
const MAX_SAMPLES = 2 ** 10;

const SAMPLE_RATE = 44100;
const VERTICAL_DIVISIONS = 10;
const HORIZONTAL_DIVISIONS = 8;

interface IProps {
  sources: Array<SourceOption>;
}

type NullableAudioNode = Tone.ToneAudioNode | null;

const Oscilloscope: React.FC<IProps> = ({ sources }) => {
  // Control Values
  const [input, setInput] = useState<NullableAudioNode>(null);
  const [verticalScale, setVerticalScale] = useState(0.25);
  const [horizontalScale, setHorizontalScale] = useState(1); // milliseconds per division
  const [triggerLevel, setTriggerLevel] = useState(0);
  const [volumeMute, setVolumeMute] = useState(true);
  const [volumeValue, setVolumeValue] = useState(0);

  // Audio Data
  const [samples, setSamples] = useState(new Float32Array(0));

  // Tone Object Refs
  const waveformRef = useRef(new Tone.Waveform(MAX_SAMPLES));
  const volumeRef = useRef(new Tone.Volume({ volume: 0, mute: true }).toDestination());

  useLayoutEffect(() => {
    let animationId: number;

    const trimLength = (SAMPLE_RATE * VERTICAL_DIVISIONS * horizontalScale) / 1000;

    function animate() {
      const totalSamples = waveformRef.current.getValue();

      if (totalSamples.length > 0) {
        const crossover = findCrossover(totalSamples, triggerLevel);
        const newSamples = trimSamples(totalSamples, crossover, trimLength);
        setSamples(newSamples);
      }

      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [horizontalScale, triggerLevel]);

  function connectInput(index: number) {
    // Find signal source
    const currentInput: NullableAudioNode = input;
    const newInput = sources[index] || null;

    // Remove previous input
    if (currentInput !== null && currentInput !== newInput.signal) {
      currentInput.disconnect(waveformRef.current);
      currentInput.disconnect(volumeRef.current);
    }

    if (newInput !== null) {
      // Connect input
      newInput.signal.connect(waveformRef.current);
      newInput.signal.connect(volumeRef.current);
      setInput(newInput.signal);
    } else {
      setInput(newInput);
    }
  }

  function handleSelect(e: React.SyntheticEvent<HTMLSelectElement>) {
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
    connectInput(parseInt(e.currentTarget.value));
  }

  return (
    <div id="oscilloscope-container">
      <Screen
        samples={samples}
        verticalScale={verticalScale}
        divsV={VERTICAL_DIVISIONS}
        divsH={HORIZONTAL_DIVISIONS}
        triggerValue={triggerLevel}
      />
      <div id="controls">
        <p>Oscilloscope</p>

        <label className="control-label">Input Source</label>
        <select onChange={handleSelect}>
          <option value={-1}> - none - </option>
          {sources.map((source, i) => (
            <option key={i} value={i}>
              {source.name}
            </option>
          ))}
        </select>

        <Control
          setValue={setVerticalScale}
          id="vertical-scale-control"
          label="Vertical Scale"
          unit="Units / Div"
          value={verticalScale}
          handleStepUp={(value: number) => value * 2}
          handleStepDown={(value: number) => value / 2}
        />

        <Control
          setValue={setHorizontalScale}
          id="horizontal-scale-control"
          label="Horizontal Scale"
          unit="ms / Div"
          step={0.1}
          value={horizontalScale}
        />

        <Control
          setValue={setTriggerLevel}
          id="trigger-level-control"
          label="Trigger Level"
          unit="Units"
          step={0.1}
          value={triggerLevel}
        />

        <Volume
          mute={volumeMute}
          value={volumeValue}
          setMute={(value: boolean) => {
            setVolumeMute(value);
            volumeRef.current.mute = value;
          }}
          setValue={(value: number) => {
            setVolumeMute(false);
            volumeRef.current.mute = false;
            const scaled = Math.log(value) * 24;
            setVolumeValue(value);
            volumeRef.current.volume.value = scaled;
          }}
        />
      </div>
    </div>
  );
};

export default Oscilloscope;
