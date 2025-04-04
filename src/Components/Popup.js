import React, { Component } from "react";
import MyContext from "./Context";

class Popup extends Component {
  static contextType = MyContext;
  render() {
    return (
      <React.Fragment>
        <div
          className={
            this.props.condition
              ? "sample-itinerary-popup itinerary-popup-bottom active"
              : "sample-itinerary-popup itinerary-popup-bottom"
          }
        >
          <div className="sample-popup-header">
            <button className="close" type="button" onClick={this.props.close}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {this.props.children}
        </div>
        <div
          className={
            this.props.condition
              ? "talk-to-us-modal active"
              : "talk-to-us-modal"
          }
          onClick={this.props.close}
        ></div>
      </React.Fragment>
    );
  }
}

export default Popup;
