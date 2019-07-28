import React from 'react';

const Volume = props => {
  const { mute, value, setMute, setValue } = props;

  return (
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
        onChange={e => {
          setValue(e.target.value);
        }}
        defaultValue={value}
      />
    </div>
  );
};

export default Volume;
