import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBolt,
  faChartArea,
  faChartBar,
  faCheck,
  faCreditCard,
  faFileContract,
  faGlobe,
  faPlane,
  faStar,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Header from "./Header";
import Hero from "./Hero";

const Home = () => {
  return (
    // <>
    //   <div className="landingApp-bg-aura1">
    //     <img src="/logo/image.png" alt="Aura1" />
    //   </div>
    //   <div className="landingApp-bg-aura2">
    //     <img src="/logo/image2.png" alt="Aura2" />
    //   </div>
    //   <div className="landingApp-bg-aura3">
    //     <img src="/logo/image2.png" alt="Aura2" />
    //   </div>
    //   <Navbar />
    //   <div className="homepage-block">
    //     <div className="homepage-hero-block">
    //       <div className="homepage-hero-text">
    //         <div className="homepage-hero-mainText">
    //           Simplify business travel with TripBizz
    //         </div>
    //         <div className="homepage-hero-subtext">
    //           book at B2B rates, manage expenses effortlessly, and save time on
    //           reimbursements for SMEs and Corporates.
    //         </div>
    //         <div className="homepage-hero-btn">
    //           <Link to="/login">
    //             <button>Log in Now</button>
    //           </Link>
    //         </div>
    //       </div>
    //       <div className="homepage-hero-image">
    //         <img src="/logo/hero_image.svg" alt="Hero" />
    //       </div>
    //     </div>
    //     <div className="homepage-benefits-block">
    //       <div className="homepage-benefits-header">🌟 TripBizz Benefits:</div>
    //       <div className="homepage-benefits-desc">
    //         <div className="homepage-benefits-desc-header">
    //           Seamless Travel Plans &nbsp;
    //           <FontAwesomeIcon
    //             icon={faPlane}
    //             style={{ color: "#3498db" }}
    //           />{" "}
    //         </div>
    //         <div className="homepage-benefits-desc-text">
    //           Configure system to organizational policies for savings.
    //           Customized policies for each department streamline expenses.
    //         </div>
    //       </div>
    //       <div className="homepage-benefits-desc">
    //         <div className="homepage-benefits-desc-header">
    //           Expense Tracking Made Easy &nbsp;
    //           <FontAwesomeIcon
    //             icon={faCreditCard}
    //             style={{ color: "#27ae60" }}
    //           />{" "}
    //         </div>
    //         <div className="homepage-benefits-desc-text">
    //           Save time with automated reports. Unreported costs compiled,
    //           including additional expenses, sent for approval automatically.
    //         </div>
    //       </div>
    //       <div className="homepage-benefits-desc">
    //         <div className="homepage-benefits-desc-header">
    //           Approval in a Blink &nbsp;
    //           <FontAwesomeIcon
    //             icon={faBolt}
    //             style={{ color: "#f39c12" }}
    //           />{" "}
    //         </div>
    //         <div className="homepage-benefits-desc-text">
    //           Rule-based processes reduce manual work. Set criteria for
    //           approvals and rejections, speeding up the process.
    //         </div>
    //       </div>
    //       <div className="homepage-benefits-desc">
    //         <div className="homepage-benefits-desc-header">
    //           Smart Analytics, Sharp Decisions &nbsp;
    //           <FontAwesomeIcon
    //             icon={faChartArea}
    //             style={{ color: "#9b59b6" }}
    //           />{" "}
    //         </div>
    //         <div className="homepage-benefits-desc-text">
    //           Real-time analytics reveal spending insights. Track every rupee
    //           spent by location, division, employee, or category for informed
    //           decision-making..
    //         </div>
    //       </div>
    //       <div className="homepage-benefits-desc">
    //         <div className="homepage-benefits-desc-header">
    //           Elevate Employee Journeys &nbsp;
    //           <FontAwesomeIcon icon={faGlobe} style={{ color: "#2ecc71" }} />
    //           &nbsp;
    //           <FontAwesomeIcon icon={faStar} style={{ color: "#f39c12" }} />
    //         </div>
    //         <div className="homepage-benefits-desc-text">
    //           Replace paper-based tracking for a smoother employee experience.
    //           Digital T&E system eases the burden of receipts and policy
    //           adherence.
    //         </div>
    //       </div>
    //     </div>
    //     <div className="homepage-stats-block">
    //       <div className="homepage-stat">
    //         <div className="homepage-stat-num">10-20%</div>
    //         <div className="homepage-stat-text">Savings in Travel bookings</div>
    //       </div>
    //       <div className="homepage-stat">
    //         <div className="homepage-stat-num">10-15 hrs</div>
    //         <div className="homepage-stat-text">
    //           saved by Employees and Finance teams every week
    //         </div>
    //       </div>
    //       <div className="homepage-stat">
    //         <div className="homepage-stat-num">90%</div>
    //         <div className="homepage-stat-text">reduction in cash leakages</div>
    //       </div>
    //       <div className="homepage-stat">
    //         <div className="homepage-stat-num">95%</div>
    //         <div className="homepage-stat-text">
    //           policy compliance in all Travel and Expense reports
    //         </div>
    //       </div>
    //     </div>
    //     <div className="homepage-features-block-mobile">
    //       <div className="homepage-feature">
    //         <div className="homepage-feature-block">
    //           <div className="homepage-feature-index">1</div>
    //           <div className="homepage-feature-image">
    //             <img src="\logo\stepImg1.svg" alt="steps" />
    //           </div>
    //           <div className="homepage-feature-text">
    //             Add flights, hotels, cabs and bus to your trip.
    //           </div>
    //         </div>
    //         <div className="homepage-feature-arrow">
    //           <img src="/logo/stepArrow1.svg" alt="arrow" />
    //         </div>
    //       </div>
    //       <div className="homepage-feature">
    //         <div className="homepage-feature-arrow">
    //           <img src="/logo/stepArrow2.svg" alt="arrow" />
    //         </div>
    //         <div className="homepage-feature-block">
    //           <div className="homepage-feature-index">2</div>
    //           <div className="homepage-feature-image">
    //             <img
    //               src="\logo\stepImg2.svg"
    //               alt="steps"
    //               className="homepage-img"
    //             />
    //           </div>
    //           <div className="homepage-feature-text">
    //             Add money to the TripBizz Wallet
    //           </div>
    //         </div>
    //       </div>
    //       <div className="homepage-feature">
    //         <div className="homepage-feature-block">
    //           <div className="homepage-feature-index">3</div>
    //           <div className="homepage-feature-image">
    //             <img
    //               src="\logo\stepImg3.png"
    //               alt="steps"
    //               className="homepage-img"
    //             />
    //           </div>
    //           <div className="homepage-feature-text">
    //             Submit the Trip for Booking (and receive your tickets via email,
    //             also visible in the app)
    //           </div>
    //         </div>
    //         <div className="homepage-feature-arrow">
    //           <img src="/logo/stepArrow1.svg" alt="arrow" />
    //         </div>
    //       </div>
    //       <div className="homepage-feature">
    //         <div className="homepage-feature-arrow">
    //           <img src="/logo/stepArrow2.svg" alt="arrow" />
    //         </div>
    //         <div className="homepage-feature-block">
    //           <div className="homepage-feature-index">4</div>
    //           <div className="homepage-feature-image">
    //             <img
    //               src="\logo\stepImg4.png"
    //               alt="steps"
    //               className="homepage-img"
    //             />
    //           </div>
    //           <div className="homepage-feature-text">
    //             While on your trip, add other expenses to the Trip via the app
    //             such as meals, local transport and other miscellaneous expenses
    //           </div>
    //         </div>
    //       </div>
    //       <div className="homepage-feature">
    //         <div className="homepage-feature-block">
    //           <div className="homepage-feature-index">5</div>
    //           <div className="homepage-feature-image">
    //             <img
    //               src="\logo\stepImg5.jpg"
    //               alt="steps"
    //               className="homepage-img"
    //             />
    //           </div>
    //           <div className="homepage-feature-text">
    //             After finishing your trip, download and submit your Trip details
    //             to Finance in a single click
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="homepage-features-block-desktop">
    //       <div className="homepage-features-desktop-1">
    //         <div className="homepage-feature">
    //           <div className="homepage-feature-block">
    //             <div className="homepage-feature-index">1</div>
    //             <div className="homepage-feature-image">
    //               <img src="\logo\stepImg1.svg" alt="steps" />
    //             </div>
    //             <div className="homepage-feature-text">
    //               Add flights, hotels, cabs and bus to your trip.
    //             </div>
    //           </div>
    //           <div className="homepage-feature-arrow-first">
    //             <img src="/logo/stepArrow1-desktop.svg" alt="arrow" />
    //           </div>
    //         </div>
    //         <div className="homepage-feature">
    //           <div className="homepage-feature-block">
    //             <div className="homepage-feature-index">2</div>
    //             <div className="homepage-feature-image">
    //               <img
    //                 src="\logo\stepImg2.svg"
    //                 alt="steps"
    //                 className="homepage-img"
    //               />
    //             </div>
    //             <div className="homepage-feature-text">
    //               Add money to the TripBizz Wallet
    //             </div>
    //           </div>
    //           <div className="homepage-feature-arrow">
    //             <img src="/logo/stepArrow2-desktop.svg" alt="arrow" />
    //           </div>
    //         </div>
    //         <div className="homepage-feature">
    //           <div className="homepage-feature-block">
    //             <div className="homepage-feature-index">3</div>
    //             <div className="homepage-feature-image">
    //               <img
    //                 src="\logo\stepImg3.png"
    //                 alt="steps"
    //                 className="homepage-img"
    //               />
    //             </div>
    //             <div className="homepage-feature-text">
    //               Submit the Trip for Booking (and receive your tickets via
    //               email, also visible in the app)
    //             </div>
    //           </div>
    //           <div className="homepage-feature-arrow-desktop">
    //             <img src="/logo/stepArrow1.svg" alt="arrow" />
    //           </div>
    //         </div>
    //       </div>
    //       <div className="homepage-features-desktop-2">
    //         <div className="homepage-feature">
    //           <div className="homepage-feature-block">
    //             <div className="homepage-feature-index">5</div>
    //             <div className="homepage-feature-image">
    //               <img
    //                 src="\logo\stepImg5.jpg"
    //                 alt="steps"
    //                 className="homepage-img"
    //               />
    //             </div>
    //             <div className="homepage-feature-text">
    //               After finishing your trip, download and submit your Trip
    //               details to Finance in a single click
    //             </div>
    //           </div>
    //           <div className="homepage-feature-arrow-last">
    //             <img src="/logo/stepArrow2-desktop.svg" alt="arrow" />
    //           </div>
    //         </div>
    //         <div className="homepage-feature">
    //           <div className="homepage-feature-block">
    //             <div className="homepage-feature-index">4</div>
    //             <div className="homepage-feature-image">
    //               <img
    //                 src="\logo\stepImg4.png"
    //                 alt="steps"
    //                 className="homepage-img"
    //               />
    //             </div>
    //             <div className="homepage-feature-text">
    //               While on your trip, add other expenses to the Trip via the app
    //               such as meals, local transport and other miscellaneous
    //               expenses
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <Footer />
    //   </div>
    // </>
    <>
      <Header />
      <Hero />
    </>
  );
};

export default Home;
