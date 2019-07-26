import React from 'react';

const Control = ({ setterFunction, id, label, upperLimit, lowerLimit, initialValue, step }) => {
  step = step || 1;
  return (
    <div className="control-container">
      <label htmlFor={id}>{label}</label>
      <div className="control-input-container">
      <button>⇦</button>
      <input type="text" id={id}  minLength="4" maxLength="8" size="10" value={initialValue}></input>
      <button>⇨</button>
      </div>
    </div>
  );
};

export default Control;
