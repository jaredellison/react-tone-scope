import React, { FunctionComponent } from 'react';

interface IProps {
  mute: boolean;
  value: number;
  setMute: Function;
  setValue: Function;
}

const Volume: FunctionComponent<IProps> = ({ mute, value, setMute, setValue }) => (
  <div className="volume-container">
    <label htmlFor="mute" className="control-label">
      Mute
    </label>
    <input
      type="checkbox"
      id="mute"
      name="mute"
      onChange={() => setMute(!mute)}
      checked={mute}
    />
    <label htmlFor="volume-control" className="control-label">
      Volume Control
    </label>
    <input
      type="range"
      id="volume-control"
      name="volume-control"
      min={0}
      max={1}
      step={0.01}
      onChange={(e) => {
        const value = Number(e.target.value);
        setValue(value);
      }}
      defaultValue={value}
    />
  </div>
);

export default Volume;
