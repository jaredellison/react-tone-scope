import React, { useState } from 'react';

const Control = ({
  id,
  label,
  unit,
  value,
  setterFunction,
  step,
  handleStepDown,
  handleStepUp
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');

  function handleDecrementClick() {
    let newValue;

    if (handleStepDown) {
      newValue = handleStepDown(value);
    } else {
      newValue = value - step;
    }

    setterFunction(newValue);
  }

  function handleIncrementClick() {
    let newValue;

    if (handleStepUp) {
      newValue = handleStepUp(value);
    } else {
      newValue = value + step;
    }

    setterFunction(newValue);
  }

  function handleEnterEvent(e) {
    if (e.code === 'Enter') {
      const value = Number(e.target.value);
      if (!isNaN(value) && e.target.value.length > 0) {
        setterFunction(value);
      }
      e.target.blur();
    }
  }

  function handleFocus() {
    if (!editing) {
      setEditing(true);
      setTempValue('');
    }
  }

  function handleBlur() {
    if (editing) {
      setEditing(false);
    }
  }

  function handleChange(e) {
    const value = e.target.value
      .split('')
      .filter((e) => {
        if (!isNaN(Number(e))) return true;
        if (['.', '-'].includes(e)) return true;
        return false;
      })
      .join('');
    setTempValue(value);
  }

  return (
    <div className="control-container">
      <label className="control-label" htmlFor={id}>
        {label} <span className="control-label-unit">{unit}</span>
      </label>
      <div className="control-input-container">
        <button onClick={handleDecrementClick}>⇦</button>

        <input
          className="control-input"
          type="text"
          id={id}
          minLength="4"
          maxLength="8"
          size="10"
          value={editing ? tempValue : value.toFixed(2)}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyUp={handleEnterEvent}
        />

        <button onClick={handleIncrementClick}>⇨</button>
      </div>
    </div>
  );
};

export default Control;
