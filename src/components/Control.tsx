import React, { useState } from 'react';

interface IProps {
  id: string;
  label: string;
  unit: string;
  value: number;
  setValue: Function;
  step: number;
  handleStepDown: Function;
  handleStepUp: Function;
}

const Control: React.FC<IProps> = ({
  id,
  label,
  unit,
  value,
  setValue,
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

    setValue(newValue);
  }

  function handleIncrementClick() {
    let newValue;

    if (handleStepUp) {
      newValue = handleStepUp(value);
    } else {
      newValue = value + step;
    }

    setValue(newValue);
  }

  function handleEnterEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === 'Enter') {
      const value = Number(e.currentTarget.value);
      if (!isNaN(value) && e.currentTarget.value.length > 0) {
        setValue(value);
      }
      e.currentTarget.blur();
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value
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
          minLength={4}
          maxLength={8}
          size={10}
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
