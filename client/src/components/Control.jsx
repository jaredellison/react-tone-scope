import React, { useState } from 'react';

const Control = ({
  setterFunction,
  id,
  label,
  upperLimit,
  lowerLimit,
  value,
  step
}) => {
  step = step || 1;

  return (
    <div className="control-container">
      <label className="control-label" htmlFor={id}>{label}</label>
      <div className="control-input-container">
        <button
          onClick={() => {
            const newValue = value - step;
            if (newValue < lowerLimit) return;
            setterFunction(newValue);
          }}
        >
          ⇦
        </button>
        <input
          class="control-input"
          type="text"
          id={id}
          minLength="4"
          maxLength="8"
          size="10"
          value={value.toFixed(4)}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (typeof value !== 'number') return;
            if (value < lowerLimit) {
              setterFunction(lowerLimit);
            }
            else if (value > upperLimit) {
              setterFunction(upperLimit);
            } else {
              setterFunction(value);
            }
          }}
        />
        <button
          onClick={() => {
            const newValue = value + step;
            if (newValue > upperLimit) return;
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
