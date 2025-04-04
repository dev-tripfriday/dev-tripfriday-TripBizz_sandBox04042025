import React from "react";
import "./InputComponent.css";

const InputComponent = ({ condition, close, type, children }) => {
  return (
    <>
      <div
        className={
          condition ? "popup-select-block active" : "popup-select-block"
        }
      >
        <div className="popup-select-header">
          <button className="close" type="button" onClick={close}>
            <span aria-hidden="true">&times;</span>
          </button>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </div>
        </div>
        {/* <div className='popup-select-list-box'>
                    <input type={type} placeholder='Enter the details' />
                </div> */}
      </div>
      <div
        className={condition ? "talk-to-us-modal open" : "talk-to-us-modal"}
        onClick={close}
      ></div>
    </>
  );
};

export default InputComponent;
