import React, { useState } from "react";
import "./HiddenSelect.css";

function HiddenSelect(props) {
  const [display, setDisplay] = useState(false);

  var { selectOnChange, selectValue, selectType, options } = props;

  return (
    <div className="hiddenSelect-block">
      {display ? (
        <select
          type={selectType ? selectType : "text"}
          value={selectValue}
          onChange={(e) => selectOnChange(e.target.value)}
          autoFocus={display}
          onBlur={() => setDisplay(false)}
        >
          {options.map((option, o) => {
            return <option>{option}</option>;
          })}
        </select>
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

export default HiddenSelect;
