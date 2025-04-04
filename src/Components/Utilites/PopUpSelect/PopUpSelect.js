import React from "react";
import "./PopUpSelect.css";

const data = [
  {
    postId: 1,
    id: 4,
    name: "alias odio sit",
    email: "Lew@alysha.tv",
    body: "non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati",
  },
  {
    postId: 1,
    id: 5,
    name: "vero eaque aliquid doloribus et culpa",
    email: "Hayden@althea.biz",
    body: "harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et",
  },
  {
    postId: 2,
    id: 6,
    name: "et fugit eligendi deleniti quidem qui sint nihil autem",
    email: "Presley.Mueller@myrl.com",
    body: "doloribus at sed quis culpa deserunt consectetur qui praesentium\naccusamus fugiat dicta\nvoluptatem rerum ut voluptate autem\nvoluptatem repellendus aspernatur dolorem in",
  },
];

const PopUpSelect = ({ condition, close, getData }) => {
  return (
    <div className="popup-select-container">
      {condition && (
        <div className="popup-list-block">
          <p
            className="popup-select-option"
            onClick={() => {
              getData("No Excess Baggage");
              close();
            }}
          >
            No Excess Baggage
          </p>
          {data.map((option) => (
            <p
              className="popup-select-option"
              onClick={() => {
                getData(option.name);
                close();
              }}
            >
              {option.name}
            </p>
          ))}
        </div>
      )}
      <div
        className={condition ? "talk-to-us-modal active" : "talk-to-us-modal"}
        onClick={() => {
          close();
        }}
      ></div>
    </div>
  );
};

export default PopUpSelect;
