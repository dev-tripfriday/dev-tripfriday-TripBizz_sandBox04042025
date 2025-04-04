import React, { useState } from "react";
import "./HiddenInput.css";

function HiddenInput(props) {
  const [display, setDisplay] = useState(false);

  var { inputOnChange, inputValue, inputType, disabled } = props;

  return (
    <div className="hiddenInput-block">
      {display ? (
        <input
          type={inputType ? inputType : "text"}
          value={inputValue}
          onChange={(e) => inputOnChange(e.target.value)}
          autoFocus={display}
          onBlur={() => setDisplay(false)}
          disabled={disabled}
        />
      ) : (
        <div
          className="flightSearch-passenger-disp"
          onClick={() => setDisplay(true)}
        >
          {props.children}
        </div>
      )}
    </div>
  );
}

export default HiddenInput;
