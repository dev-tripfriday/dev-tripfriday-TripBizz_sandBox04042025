import React from "react";
import Popup from "../../Popup";
import "./HotelDesc.css";

function HotelDesc(props) {
  return (
    <Popup condition={props.condition} close={props.close}>
      <div className="hotels-desc-block">
        {props.location ? (
          <div className="hotels-desc-row hotels-desc-location">
            <span>Location:</span>
            {props.location}
          </div>
        ) : null}
        {props.description ? (
          <div className="hotels-desc-row hotels-desc-description">
            <span>Description:</span>
            <div dangerouslySetInnerHTML={{ __html: props.description }} />
          </div>
        ) : null}
      </div>
    </Popup>
  );
}

export default HotelDesc;
