import React, { useState } from "react";
import "./InfoWindow.css";

const InfoWindow = ({ condition, close, children }) => {
  const [touchFirst, setTouchFirst] = useState(0);
  const [touchMove, setTouchMove] = useState(0);
  const [diff, setDiff] = useState(0);
  const onTouchStart = (e) => {
    setTouchFirst(e.touches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchMove(e.touches[0].clientY);
    const divElement = document.getElementById("main-popup");
    var topValue = touchMove - touchFirst + 60 + "px";
    divElement.style.setProperty("top", topValue);
    setDiff(touchMove - touchFirst);

    if (diff > 200) {
      divElement.style.setProperty("transform", "translate(-50%, -50%)");
      divElement.style.setProperty("transform", "scale(0)");
      close();
    }
  };

  const onTouchEnd = (e) => {
    const divElement = document.getElementById("main-popup");
    var diff = touchMove - touchFirst;
    if (diff < 200) {
      divElement.style.setProperty("top", "60px");
    }
  };

  return (
    <>
      <div
        className={
          condition
            ? "sample-popup itinerary-popup-bottom active"
            : "sample-popup itinerary-popup-bottom"
        }
        id="main-popup"
        onTouchStart={(e) => onTouchStart(e)}
        onTouchMove={(e) => onTouchMove(e)}
        onTouchEnd={(e) => {
          onTouchEnd(e);
        }}
        style={
          condition ? { transform: "scale(1)" } : { transform: "scale(0)" }
        }
      >
        <div className="sample-popup-header">
          <button className="close" type="button" onClick={close}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        {children}
      </div>
    </>
  );
};

export default InfoWindow;
