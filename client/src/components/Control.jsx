import React, { Component } from 'react';

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      tempValue: ''
    };

    this.textInput = React.createRef();

    this.handleDecrementClick = this.handleDecrementClick.bind(this);
    this.handleIncrementClick = this.handleIncrementClick.bind(this);
    this.handleEnterEvent = this.handleEnterEvent.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleDecrementClick() {
    let newValue;
    const { value, setterFunction, step, handleStepDown } = this.props;

    if (handleStepDown) {
      newValue = handleStepDown(value);
    } else {
      newValue = value - step;
    }

    setterFunction(newValue);
  }

  handleIncrementClick() {
    let newValue;
    const { value, setterFunction, step, handleStepUp } = this.props;

    if (handleStepUp) {
      newValue = handleStepUp(value);
    } else {
      newValue = value + step;
    }

    setterFunction(newValue);
  }

  handleEnterEvent(e) {
    if (e.code === 'Enter') {
      const value = Number(e.target.value);
      if (!isNaN(value) && e.target.value.length > 0) {
        this.props.setterFunction(value);
      }
      e.target.blur();
    }
  }

  handleFocus() {
    if (!this.state.editing) {
      this.setState(
        {
          editing: true,
          tempValue: ''
        },
        () => {
          this.textInput.current.addEventListener(
            'keyup',
            this.handleEnterEvent
          );
        }
      );
    }
  }

  handleBlur() {
    if (this.state.editing) {
      this.setState({ editing: false }, () => {
        this.textInput.current.removeEventListener('keyup', this.enterEventHandler);
      });
    }
  }

  handleChange(e) {
    const value = e.target.value.split('').filter(e => {
      if (!isNaN(Number(e))) return true;
      if (['.', '-'].includes(e)) return true;
      return false;
    }).join('');
    this.setState({ tempValue: value });
  }

  render() {
    const { id, label, unit, value } = this.props;
    const { editing, tempValue } = this.state;

    return (
      <div className="control-container">
        <label className="control-label" htmlFor={id}>
          {label} <span className="control-label-unit">{unit}</span>
        </label>
        <div className="control-input-container">
          <button onClick={this.handleDecrementClick}>⇦</button>

          <input
            className="control-input"
            type="text"
            id={id}
            ref={this.textInput}
            minLength="4"
            maxLength="8"
            size="10"
            value={editing ? tempValue : value.toFixed(2)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />

          <button onClick={this.handleIncrementClick}>⇨</button>
        </div>
      </div>
    );
  }
}

export default Control;
