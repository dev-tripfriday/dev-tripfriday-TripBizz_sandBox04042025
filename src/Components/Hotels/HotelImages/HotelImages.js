import React, { useState } from "react";
import "./HotelImages.css";
import Popup from "../../Popup";

function HotelImages(props) {
  var [mainImgIdx, setMainImgIdx] = useState(0);

  var { images, condition, close } = props;
  return (
    <Popup condition={condition} close={close}>
      <div className="hotelImages-block">
        <div className="hotelImages-mainImg">
          <img src={images[mainImgIdx]} alt="mainImg" />
        </div>
        <div className="hotelImages-imgThumb-list">
          {
            images.length > 0 ? (
              <>
                {images.map((img, i) => {
                  return (
                    <div
                      className={
                        mainImgIdx === i
                          ? "hotelImages-imgThumb hotelImages-imgThumb-selected"
                          : "hotelImages-imgThumb"
                      }
                      onClick={() => setMainImgIdx(i)}
                    >
                      <div className="hotelImages-imgThumb-overlay" ></div>
                      <img src={img} alt="img" />
                    </div>
                  );
                })}
              </>
            ) : (null)
          }

        </div>
      </div>
    </Popup>
  );
}

export default HotelImages;
