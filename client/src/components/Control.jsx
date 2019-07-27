import React, { useState, useRef } from 'react';

const Control = ({
  setterFunction,
  id,
  label,
  unit,
  value,
  step
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const inputEl = useRef(null);

  const enterEventHandler = e => {
    if (e.code === 'Enter') {
      const value = Number(e.target.value);
      if (!isNaN(value) && e.target.value.length > 0) {
        setterFunction(value);
      }
      e.target.blur();
    }
  };

  return (
    <div className="control-container">
      <label className="control-label" htmlFor={id}>
        {label} <span className="control-label-unit">{unit}</span>
      </label>
      <div className="control-input-container">

        <button
          onClick={() => {
            const newValue = value - step;
            setterFunction(newValue);
          }}
        >
          ⇦
        </button>

        <input
          className="control-input"
          type="text"
          id={id}
          ref={inputEl}
          minLength="4"
          maxLength="8"
          size="10"
          value={editing ? tempValue : value.toFixed(2)}

          onFocus={() => {
            if (!editing) setEditing(true);
            setTempValue('');
            inputEl.current.addEventListener('keyup', enterEventHandler);
          }}

          onBlur={() => {
            if (editing) setEditing(false);
            inputEl.current.removeEventListener('keyup', enterEventHandler);
          }}

          onChange={e => {
            const value = e.target.value.split('').filter(e => {
              if (!isNaN(Number(e))) return true;
              if (['.', '-'].includes(e)) return true;
              return false;
            });
            setTempValue(value.join(''));
          }}
        />

        <button
          onClick={() => {
            const newValue = value + step;
            setterFunction(newValue);
          }}
        >
          ⇨
        </button>

      </div>
    </div>
  );
};

export default Control;
