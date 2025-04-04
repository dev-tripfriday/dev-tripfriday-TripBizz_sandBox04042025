import { faGripLines, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import MyContext from "../../Context";

class InfoWindow extends Component {
  static contextType = MyContext;
  state = {
    initialPosition: null,
    newPosition: null,
    firstPosition: null,
    diff: null,
    windowScroll: false,
  };
  componentDidMount = () => {
    var body = document.getElementsByTagName("body")[0];
    // body.style.overflow = "hidden";
    if (this.props.condition) {
      body.style.overflow = "hidden";
    }
    document
      .getElementById(`infoWindow-section-${this.props.type}`)
      .addEventListener("scroll", () => {
        console.log(
          "Scroll top :",
          document.getElementById(`infoWindow-section-${this.props.type}`)
            .scrollTop
        );
        if (
          !this.state.windowScroll &&
          document.getElementById(`infoWindow-section-${this.props.type}`)
            .scrollTop > 0
        ) {
          this.setState({
            windowScroll: true,
            firstPosition: null,
            initialPosition: null,
            newPosition: null,
          });
        } else if (
          this.state.windowScroll &&
          document.getElementById(`infoWindow-section-${this.props.type}`)
            .scrollTop === 0
        ) {
          this.setState({
            windowScroll: false,
          });
        }
      });
  };

  componentWillUnmount() {
    document
      .getElementById(`infoWindow-section-${this.props.type}`).removeEventListener("scroll", () => {
        console.log(
          "Scroll top :",
          document.getElementById(`infoWindow-section-${this.props.type}`)
            .scrollTop
        );
        if (
          !this.state.windowScroll &&
          document.getElementById(`infoWindow-section-${this.props.type}`)
            .scrollTop > 0
        ) {
          this.setState({
            windowScroll: true,
            firstPosition: null,
            initialPosition: null,
            newPosition: null,
          });
        } else if (
          this.state.windowScroll &&
          document.getElementById(`infoWindow-section-${this.props.type}`)
            .scrollTop === 0
        ) {
          this.setState({
            windowScroll: false,
          });
        }
      })
  }

  componentDidUpdate = () => {
    var body = document.getElementsByTagName("body")[0];
    if (this.props.condition) {
      console.log("Yess!!The condition!!", body);
      body.style.overflow = "hidden";
    }
  };

  handleTouchStart = (e, touches) => {
    if (!this.state.windowScroll) {
      if (this.state.firstPosition === null) {
        this.setState({
          initialPosition: touches[0].clientY,
          firstPosition: touches[0].clientY,
        });
      } else {
        this.setState({
          initialPosition: touches[0].clientY,
        });
      }
    }
  };
  handleTouchMove = (e, touches) => {
    if (!this.state.windowScroll) {
      if (true) {
        //touches[0].clientY > this.state.initialPosition
        this.setState(
          (prevState) => {
            if (this.state.firstPosition === null) {
              return {
                initialPosition: touches[0].clientY,
                newPosition: touches[0].clientY,
                firstPosition: touches[0].clientY,
              };
            } else {
              return {
                initialPosition: prevState.newPosition,
                newPosition: touches[0].clientY,
              };
            }
          },
          () => {
            console.log(
              "Difference :",
              this.state.newPosition,
              this.state.firstPosition,
              this.state.newPosition - this.state.firstPosition
            );
          }
        );
      } else {
        this.setState({
          firstPosition: null,
        });
      }
    }
  };

  handleTouchEnd = () => {
    if (!this.state.windowScroll) {
      var body = document.getElementsByTagName("body")[0];
      if (this.state.newPosition >= this.state.initialPosition) {
        if (this.state.newPosition - this.state.firstPosition > 100) {
          this.props.close();
          var timeout1 = setTimeout(() => {
            this.setState({
              newPosition: null,
              firstPosition: null,
              initialPosition: null,
            });
            body.style.overflow = "auto";
          }, 500);
          clearTimeout(timeout1)
        } else {
          this.setState({
            newPosition: null,
            initialPosition: null,
            firstPosition: null,
          });
        }
      } else {
        this.setState({
          newPosition: null,
          initialPosition: null,
          firstPosition: null,
        });
      }
    }
  };

  render() {
    return (
      <MyContext.Consumer>
        {({ actions, infoWindowContent }) => {
          return (
            <React.Fragment>
              {this.props.condition ? (
                <div
                  className="itineraryNew-infoWindow-overlay"
                  onClick={() => {
                    var body = document.getElementsByTagName("body")[0];
                    this.props.close();
                    var timeout2 = setTimeout(() => {
                      this.setState({
                        newPosition: null,
                        firstPosition: null,
                        initialPosition: null,
                      });
                    }, 500);
                    clearTimeout(timeout2)
                    body.style.overflow = "auto";
                  }}
                ></div>
              ) : null}
              <div
                id={`infoWindow-block-${this.props.type}`}
                className={
                  this.props.condition
                    ? this.state.newPosition !== null
                      ? "itineraryNew-infoWindow-block"
                      : "itineraryNew-infoWindow-block itineraryNew-infoWindow-block-up"
                    : "itineraryNew-infoWindow-block itineraryNew-infoWindow-block-down"
                }
                style={
                  this.props.condition && this.state.newPosition !== null
                    ? {
                      transform: `translate3d(0px,${this.state.newPosition - this.state.firstPosition
                        }px,0px)`,
                    }
                    : null
                }
                onTouchStart={(e) => this.handleTouchStart(e, e.touches)}
                onTouchMove={(e) => this.handleTouchMove(e, e.touches)}
                onTouchEnd={(e) => this.handleTouchEnd()}
              >
                <div
                  className="itineraryNew-infoWindow-section"
                  id={`infoWindow-section-${this.props.type}`}
                >
                  {this.props.condition ? (
                    <React.Fragment>
                      <div className="itineraryNew-infoWindow-header">
                        <FontAwesomeIcon
                          icon={faGripLines}
                          className="itineraryNew-infoWindow-header-grip"
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="itineraryNew-infoWindow-header-close"
                          onClick={() => {
                            var body = document.getElementsByTagName("body")[0];
                            this.props.close();
                            var timeout3 = setTimeout(() => {
                              this.setState({
                                newPosition: null,
                                firstPosition: null,
                                initialPosition: null,
                              });
                            }, 500);
                            clearTimeout(timeout3)
                            body.style.overflow = "auto";
                            document.getElementById(
                              `infoWindow-section-${this.props.type}`
                            ).style.overflow = "auto";
                          }}
                        />
                      </div>
                      {this.props.children}
                      {/* <div className="itineraryNew-infoWindow-body">
                                            
                                        </div> */}
                    </React.Fragment>
                  ) : null}
                </div>
              </div>
            </React.Fragment>
          );
        }}
      </MyContext.Consumer>
    );
  }
}

export default InfoWindow;
