import React from "react";
import "../Timeline/Timeline.css";
import trip from "../assets/6216261.jpg";
import manager from "../assets/Sandy_Ppl-30_Single-05.jpg";
import wallet from "../assets/Wavy_Tech-31_Single-01.jpg";
import ticket from "../assets/10112781.jpg";
import expenses from "../assets/Wavy_Bus-33_Single-07.jpg";
import summary from "../assets/8799349.jpg";
const Timeline = () => {
  return (
    <div>
      <h1 className="font-bold text-center text-[25px] py-3 md:text-[30px] pt-3">
        HOW IT WORKS
      </h1>
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="main-timeline">
              <div class="timeline">
                <span class="timeline-icon"></span>
                <span class="year">Step-1</span>
                <div class="timeline-content">
                  {/* <span class="icon fa fa-globe"></span>
                  <h3 class="title">Create Trip</h3> */}
                  <img src={trip} alt="" className="image" />
                  <p class="description">
                    Create a trip with flights, hotels, cabs, bus & trains
                  </p>
                </div>
              </div>
              <div class="timeline">
                <span class="timeline-icon"></span>
                <span class="year">Step-2</span>
                <div class="timeline-content">
                  {/* <span class="icon fa fa-rocket"></span>
                  <h3 class="title">Send the Details</h3> */}
                  <img src={manager} alt="" className="image" />
                  <p class="description">
                    Send the trip details for Manager approval (if required)
                  </p>
                </div>
              </div>
              <div class="timeline">
                <span class="timeline-icon"></span>
                <span class="year">Step-3</span>
                <div class="timeline-content">
                  {/* <span class="icon fa fa-rocket"></span>
                  <h3 class="title">Add Money</h3> */}
                  <img src={wallet} alt="" className="image" />
                  <p class="description">Add money to the Wallet</p>
                </div>
              </div>
              <div class="timeline">
                <span class="timeline-icon"></span>
                <span class="year">Step-4</span>
                <div class="timeline-content">
                  {/* <span class="icon fa fa-rocket"></span>
                  <h3 class="title">Submit</h3> */}
                  <img src={ticket} alt="" className="image" />
                  <p class="description">
                    Submit trip for booking & view your tickets / vouchers
                  </p>
                </div>
              </div>
              <div class="timeline">
                <span class="timeline-icon"></span>
                <span class="year">Step-5</span>
                <div class="timeline-content">
                  {/* <span class="icon fa fa-rocket"></span>
                  <h3 class="title">Capture</h3> */}
                  <img src={expenses} alt="" className="image" />
                  <p class="description">
                    Capture expenses while on trip using Tripbizz mobile app
                  </p>
                </div>
              </div>
              <div class="timeline">
                <span class="timeline-icon"></span>
                <span class="year">Step-6</span>
                <div class="timeline-content">
                  {/* <span class="icon fa fa-rocket"></span>
                  <h3 class="title">Download & Submit</h3> */}
                  <img src={summary} alt="" className="image" />
                  <p class="description">
                    Effortlessly download & submit expense report for
                    reimbursements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
