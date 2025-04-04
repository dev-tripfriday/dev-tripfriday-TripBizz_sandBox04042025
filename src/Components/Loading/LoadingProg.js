import React, { useContext, useEffect, useState } from "react";
import MyContext from "../Context";
import { PulseLoader } from "react-spinners";
import "./LoadingProg.css";

function LoadingProg(props) {
  var { loadingText, condition, progEnd, progTime, progMax } = props;

  var { actions } = useContext(MyContext);

  var [progPercent, setProgPercent] = useState(0);
  var [mounted, setMounted] = useState(true);
  var [progText, setProgText] = useState("");

  const progressCheck = async () => {
    // return new Promise(async (res, rej) => {
    //   console.log("Progress starting!!");
    //   var maxProgress = progMax ? progMax : 90;
    //   var totalTime = progTime ? progTime : 25;
    //   var progressDelta = maxProgress / (totalTime * 2);

    //   var currProgPercent = progressDelta;
    //   console.log(progressDelta);
    //   setProgPercent(currProgPercent);
    //   setProgText("Sending requests");

    //   // console.log(
    //   //   progEnd,
    //   //   currProgPercent,
    //   //   maxProgress,
    //   //   progEnd && currProgPercent < maxProgress
    //   // );

    //   while (progEnd && currProgPercent < maxProgress) {
    //     currProgPercent += progressDelta;
    //     console.log('it is getting called', currProgPercent);
    //     setProgPercent(currProgPercent);

    //     if (progPercent >= 30) {
    //       setProgText("Waiting for the response!!");
    //     }

    //     //console.log(currProgPercent, progEnd);

    //     await actions.delay(500);
    //   }

    //   res("Resolved!!");
    // });

    console.log("Progress starting!!");

    const maxProgress = progMax ? progMax : 90;
    const totalTime = progTime ? progTime : 25;
    const progressDelta = maxProgress / (totalTime * 2);

    let currProgPercent = progressDelta;
    setProgPercent(currProgPercent);
    setProgText("Sending requests");

    while (progEnd && currProgPercent < maxProgress) {
      currProgPercent += progressDelta;
      setProgPercent(currProgPercent);
      if (currProgPercent >= 30) {
        setProgText("Waiting for the response!!");
      }
      await actions.delay(500);
    }

    if (currProgPercent >= maxProgress) {
      console.log("Progress completed!!");
      return "Resolved!!";
    } else {
      console.log("Progress interrupted!!");
      throw new Error("Progress interrupted!!");
    }
  };

  useEffect(() => {
    if (mounted) {
      var fetchData = async () => {
        const result = await progressCheck();
      };
      fetchData();
    }
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <div className="loadingProg-block">
      <div className="loadingProg-section">
        <div className="loadingProg-loader">
          <div className="loadingProg-loader-text-section">
            <div className="loadingProg-loader-text">
              <span className="">
                <span>{loadingText}</span>
              </span>
            </div>
          </div>
          <PulseLoader
            // css={override}
            sizeUnit={"px"}
            size={17}
            color={"#94D2BD"}
            loading={condition}
          />
        </div>
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar progress-bar-striped"
            role="progressbar"
            style={{
              width: `${progPercent ? progPercent : 0}%`,
              backgroundColor: "#001219",
            }}
            aria-valuenow={progPercent ? progPercent : 0}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingProg;
