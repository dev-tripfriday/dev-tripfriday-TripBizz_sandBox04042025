import React from "react";
import './DropDownButton.css'

const DropDownButton = (props) => {
  const { toggleOpen, toggleClose, open, name, children, transform } = props;


  return (
    <>
      <div className="dropDown-block" id="dropDown-block">
        <div className="dropDown-btn">
          <div
            className="dropDown-btn-block dropDown-btn-clicked"
            onClick={open ? toggleClose : toggleOpen}
          >
            {name}
          </div>
        </div>
        <div
          className={
            open
              ? "talk-to-us-modal activ"
              : "talk-to-us-modal"
          }
          onClick={toggleClose}
        ></div>
        {open ? (
          <div className="dropDown-menu" id="dropDown-menu" style={{ "transform": `translate(${transform}%)` }}>
            {children}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DropDownButton;