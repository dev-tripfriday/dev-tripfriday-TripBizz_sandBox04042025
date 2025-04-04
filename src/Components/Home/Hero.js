import React from "react";
import play from "../Home/assets/market-button.png";
import liveexchange from "../Home/assets/exchange-rate.png";
import automation from "../Home/assets/automation.png";
import travel from "../Home/assets/travel.png";
import inventory from "../Home/assets/inventory.png";
import budget from "../Home/assets/budget.png";
import taxes from "../Home/assets/taxes.png";
import report from "../Home/assets/report.png";
import help from "../Home/assets/help-desk.png";
import main from "../Home/assets/main.jpeg";
import background from "../Home/assets/background.jpg";
import lp from "../Home/assets/WhatsApp Image 2024-05-09 at 4.53.14 PM.jpeg";
import { Link } from "react-router-dom";
import { FaPassport } from "react-icons/fa";
import { PiAirplaneTiltDuotone } from "react-icons/pi";
import { RiHotelFill } from "react-icons/ri";
import { FaTaxi } from "react-icons/fa6";
import { FaBus } from "react-icons/fa";
import { FaTrainSubway } from "react-icons/fa6";
import { LiaLanguageSolid } from "react-icons/lia";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { FaBusinessTime } from "react-icons/fa6";
import { GrVisa } from "react-icons/gr";
import { RiGlobalLine } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import Timeline from "./Timeline/Timeline";
import Callback from "./Callback";
const Hero = () => {
  return (
    <div>
      <div className="md:pt-[100px] pt-[50px] max-w-full">
        <div className="w-[90%] overflow-hidden m-auto pt-10 flex flex-col lg:flex-row items-center justify-evenly">
          <div className="max-w-[520px] w-full pt-[25px] mb-8 lg:mb-0">
            <h1 className="text-black text-[1.5rem] sm:text-[25px] text-center lg:!text-left md:[2.5rem] lg:text-[30px] xl:text-[40px] xl:leading-[52px] font-bold md:leading-[52px]">
              ONE-STOP TRAVEL & EXPENSE MANAGEMENT
            </h1>
            <p className="text-black font-semibold text-[14px] text-center lg:!text-left md:text-[20px] xl:text-[20px] lg:text-[18px] mt-4">
              We make business travel simple & efficient, while significantly
              reducing costs!
            </p>
            <Link to="/login">
              <button className="block mx-auto lg:!mx-0 border border-black p-2 px-4 mt-4 focus:outline-none">
                Login
              </button>
            </Link>
          </div>
          <img
            src={main}
            alt="hero"
            className="w-[300px] md:w-[500px] object-contain"
          />
        </div>
      </div>
      <Callback />
      <div className="bg-gradient-to-r from-[#ee9b00] to-[#ca6702]  py-6">
        <h1 className="text-white font-bold text-center py-4 md:text-[30px] text-[17px]">
          SAVE MONEY ON EVERY BUSINESS TRIP
          <br /> WITH THESE BENEFITS
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <div className="md:w-[200px] w-[150px] border border-solid rounded-md shadow-lg p-2 bg-white">
            <h1 className="font-bold text-black text-center md:text-[30px] pt-2">
              28%
            </h1>
            <p className="text-black font-semibold text-center text-[13px] md:text-[16px] pt-2">
              SAVINGS IN TRAVEL COSTS
            </p>
          </div>
          <div className="md:w-[200px] w-[150px] border border-solid rounded-md shadow-lg p-2 bg-white">
            <h1 className="font-bold text-black text-center md:text-[30px] pt-2">
              100%
            </h1>
            <p className="text-black font-semibold text-center text-[13px] md:text-[16px] pt-2">
              COMPLIANCE TO TRAVEL POLICY
            </p>
          </div>
          <div className="md:w-[200px] w-[150px] border border-solid rounded-md shadow-lg p-2 bg-white">
            <h1 className="font-bold text-black text-center md:text-[30px] pt-2">
              5-10
            </h1>
            <p className="text-black font-semibold text-center text-[13px] md:text-[16px] pt-2">
              HOURS SAVED PER EMPLOYEE PER MONTH
            </p>
          </div>
        </div>
      </div>
      <div className=" flex items-center justify-center mt-6 mb-6">
        <div className="p-8 w-[100%] lg:flex lg:flex-row flex-col items-center justify-evenly">
          <div className="">
            <img
              src={lp}
              alt="Person"
              className="w-[500px] h-auto rounded-lg m-auto"
            />
          </div>
          <div className="">
            <h1 className="md:text-3xl text-[18px] font-bold md:mb-6 my-4 text-yellow-800">
              Key benefits of using TRIPBIZZ
            </h1>
            <ul className="space-y-4 text-gray-700 pl-6">
              <li className="flex items-center gap-2 text-[14px] md:text-[18px]">
                <FaCheckCircle className="text-green-500" />
                Lowest rates for Flights, Hotels, Cabs & more
              </li>
              <li className="flex items-center gap-2 text-[14px] md:text-[18px]">
                <FaCheckCircle className="text-green-500" />
                Price match guarantee
              </li>
              <li className="flex items-center gap-2 text-[14px] md:text-[18px]">
                <FaCheckCircle className="text-green-500" />
                Get benefits like free meals, free cancellation etc.
              </li>
              <li className="flex items-center gap-2 text-[14px] md:text-[18px]">
                <FaCheckCircle className="text-green-500" />
                Claim GST Input on all your business travel expenses
              </li>
              <li className="flex items-center gap-2 text-[14px] md:text-[18px]">
                <FaCheckCircle className="text-green-500" />
                Employees book within budget caps as per travel policy
              </li>
              <li className="flex items-center gap-2 text-[14px] md:text-[18px]">
                <FaCheckCircle className="text-green-500" />
                No platform subscription fees & No hidden charges
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Timeline />
      <Callback />
      <div>
        <div
          style={{
            backgroundImage: `url(${background})`,
          }}
          // className={` ${imgbg} bg-no-repeat bg-opacity-50 bg-center lg:h-[500px] bg-cover`}
          className="md:pb-[70px] pb-[20px]"
        >
          <h1 className="font-bold text-[20px] md:text-[40px] text-center md:pt-[80px] pt-[20px]">
            Travel the world with us
          </h1>
          <div className="flex flex-wrap md:gap-4 gap-2 justify-center mt-8">
            <div className="flex flex-col md:gap-4 gap-2">
              <div className="bg-white border-blue-300 border-solid border-[1px] flex gap-2 items-center max-w-[400px] w-[100%] rounded-md shadow-lg p-3">
                <FaBusinessTime size={40} />
                <p className="text-[13px] md:text-[17px]">
                  Access live B2B rates from over 1000 airlines from 100+
                  countries
                </p>
              </div>
              <div className="bg-white border-blue-300 border-solid border-[1px] flex gap-2 items-center max-w-[400px] w-[100%] rounded-md shadow-lg p-3">
                <GrVisa size={40} />
                <p className="text-[13px] md:text-[17px]">
                  Benefit from seamless Visa assistance services for 80+
                  countries
                </p>
              </div>
              <div className="bg-white border-blue-300 border-solid border-[1px] flex gap-2 items-center max-w-[400px] w-[100%] rounded-md shadow-lg p-3">
                <RiGlobalLine size={40} />
                <p className="text-[13px] md:text-[17px]">
                  Book Verified Cabs in 200+ cities around the world (outside
                  India)
                </p>
              </div>
            </div>
            <div className="flex flex-col md:gap-4 gap-2">
              <div className="bg-white border-blue-300 border-solid border-[1px] flex gap-2 items-center max-w-[400px] w-[100%] rounded-md shadow-lg p-3">
                <LiaLanguageSolid size={40} />
                <p className="text-[13px] md:text-[17px]">
                  Engage translators in
                  <br /> 30+ countries
                </p>
              </div>
              <div className="bg-white border-blue-300 border-solid border-[1px] flex gap-2 items-center max-w-[400px] w-[100%] rounded-md shadow-lg p-3">
                <AiOutlineGlobal size={40} />
                <p className="text-[13px] md:text-[17px]">
                  Access live rates for over a million hotels around the world
                </p>
              </div>
              <div className="bg-white border-blue-300 border-solid border-[1px] flex gap-2 items-center max-w-[400px] w-[100%] rounded-md shadow-lg p-3">
                {/* <img
                  src="https://via.placeholder.com/300"
                  alt="Flight Booking"
                  className="w-10 h-10 object-cover rounded-lg"
                /> */}
                <FaLocationDot size={30} />
                <p className="text-[13px] md:text-[17px]">
                  Book Verified Cabs in 100+ Indian cities & towns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mt-5 w-[90%] m-auto">
        <h1 className="font-bold text-[30px] text-center">How it works</h1>
        <div className="homepage-features--mobile">
          <div className="homepage-feature">
            <div className="homepage-feature-block">
              <div className="homepage-feature-index">1</div>
              <div className="homepage-feature-image">
                <img src="\logo\stepImg1.svg" alt="steps" />
              </div>
              <div className="homepage-feature-text">
                Add flights, hotels, cabs and bus to your trip.
              </div>
            </div>
            <div className="homepage-feature-arrow">
              <img src="/logo/stepArrow1.svg" alt="arrow" />
            </div>
          </div>
          <div className="homepage-feature">
            <div className="homepage-feature-arrow">
              <img src="/logo/stepArrow2.svg" alt="arrow" />
            </div>
            <div className="homepage-feature-block">
              <div className="homepage-feature-index">2</div>
              <div className="homepage-feature-image">
                <img
                  src="\logo\stepImg2.svg"
                  alt="steps"
                  className="homepage-img"
                />
              </div>
              <div className="homepage-feature-text">
                Add money to the TripBizz Wallet
              </div>
            </div>
          </div>
          <div className="homepage-feature">
            <div className="homepage-feature-block">
              <div className="homepage-feature-index">3</div>
              <div className="homepage-feature-image">
                <img
                  src="\logo\stepImg3.png"
                  alt="steps"
                  className="homepage-img"
                />
              </div>
              <div className="homepage-feature-text">
                Submit the Trip for Booking (and receive your tickets via email,
                also visible in the app)
              </div>
            </div>
            <div className="homepage-feature-arrow">
              <img src="/logo/stepArrow1.svg" alt="arrow" />
            </div>
          </div>
          <div className="homepage-feature">
            <div className="homepage-feature-arrow">
              <img src="/logo/stepArrow2.svg" alt="arrow" />
            </div>
            <div className="homepage-feature-block">
              <div className="homepage-feature-index">4</div>
              <div className="homepage-feature-image">
                <img
                  src="\logo\stepImg4.png"
                  alt="steps"
                  className="homepage-img"
                />
              </div>
              <div className="homepage-feature-text">
                While on your trip, add other expenses to the Trip via the app
                such as meals, local transport and other miscellaneous expenses
              </div>
            </div>
          </div>
          <div className="homepage-feature">
            <div className="homepage-feature-block">
              <div className="homepage-feature-index">5</div>
              <div className="homepage-feature-image">
                <img
                  src="\logo\stepImg5.jpg"
                  alt="steps"
                  className="homepage-img"
                />
              </div>
              <div className="homepage-feature-text">
                After finishing your trip, download and submit your Trip details
                to Finance in a single click
              </div>
            </div>
          </div>
        </div>
        <div className="homepage-features-block-desktop">
          <div className="homepage-features-desktop-1">
            <div className="homepage-feature">
              <div className="homepage-feature-block">
                <div className="homepage-feature-index">1</div>
                <div className="homepage-feature-image">
                  <img
                    src="\logo\stepImg1.svg"
                    alt="steps"
                    className="m-auto"
                  />
                </div>
                <div className="homepage-feature-text text-center">
                  Create a trip with flights, hotels, cabs, bus & trains
                </div>
              </div>
              <div className="homepage-feature-arrow-first">
                <img src="/logo/stepArrow1-desktop.svg" alt="arrow" />
              </div>
            </div>
            <div className="homepage-feature">
              <div className="homepage-feature-block">
                <div className="homepage-feature-index">2</div>
                <div className="homepage-feature-image">
                  <img
                    src="\logo\stepImg2.svg"
                    alt="steps"
                    className="homepage-img m-auto"
                  />
                </div>
                <div className="homepage-feature-text text-center">
                  Add money to the TripBizz Wallet
                </div>
              </div>
              <div className="homepage-feature-arrow">
                <img src="/logo/stepArrow2-desktop.svg" alt="arrow" />
              </div>
            </div>
            <div className="homepage-feature">
              <div className="homepage-feature-block">
                <div className="homepage-feature-index">3</div>
                <div className="homepage-feature-image">
                  <img
                    src="\logo\stepImg3.png"
                    alt="steps"
                    className="homepage-img m-auto"
                  />
                </div>
                <div className="homepage-feature-text text-center">
                  Submit trip for booking & view your your tickets / vouchers
                </div>
              </div>
              <div className="homepage-feature-arrow-desktop">
                <img src="/logo/stepArrow1.svg" alt="arrow" />
              </div>
            </div>
          </div>
          <div className="homepage-features-desktop-2">
            <div className="homepage-feature">
              <div className="homepage-feature-block">
                <div className="homepage-feature-index">5</div>
                <div className="homepage-feature-image">
                  <img
                    src="\logo\stepImg5.jpg"
                    alt="steps"
                    className="homepage-img m-auto"
                  />
                </div>
                <div className="homepage-feature-text text-center">
                  Capture expenses while on trip using Tripbizz mobile app
                </div>
              </div>
              <div className="homepage-feature-arrow-last">
                <img src="/logo/stepArrow2-desktop.svg" alt="arrow" />
              </div>
            </div>
            <div className="homepage-feature">
              <div className="homepage-feature-block">
                <div className="homepage-feature-index">4</div>
                <div className="homepage-feature-image">
                  <img
                    src="\logo\stepImg4.png"
                    alt="steps"
                    className="homepage-img m-auto"
                  />
                </div>
                <div className="homepage-feature-text text-center">
                  Effortlessly download & submit expense report for
                  reimbursements
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-gradient-to-b from-zinc-50 to-slate-50 py-[30px]">
        <div className="md:!mt-[3.5rem] mt-4 w-[90%] m-auto">
          <h1 className="font-bold md:text-[35px] text-[20px] text-center">
            Why book with us?
          </h1>
          <div className="mt-[40px] flex gap-4 flex-wrap justify-center">
            <div className="border-blue-200 border-solid border-[1px] p-3 rounded-md w-[300px] ">
              <img
                src={liveexchange}
                alt="Flight Booking"
                className="w-10 h-10 block m-auto object-cover rounded-lg"
              />
              <h1 className="font-semibold text-[20px] text-center pt-3">
                Live B2B rates
              </h1>
              <p className="text-[14px] leading-[20px] pt-2 text-center">
                Tripbizz web & mobile applications give you access to live B2B
                rates for Hotels, Flights, Cabs, Buses, Trains and Visa
              </p>
            </div>
            <div className=" border-blue-200 border-solid border-[1px] p-3 rounded-md w-[300px] shadow-md">
              <img
                src={automation}
                alt="Flight Booking"
                className="w-10 h-10 block m-auto object-cover rounded-lg"
              />
              <h1 className="font-semibold text-[20px] pt-3 text-center">
                Approval flow automation
              </h1>
              <p className="text-[14px] leading-[20px] pt-2 text-center">
                Request, track and record Trip approvals within the application
                itself
              </p>
            </div>
            <div className=" border-blue-200 border-solid border-[1px] p-3 rounded-md w-[300px] shadow-md">
              <img
                src={travel}
                alt="Flight Booking"
                className="w-10 h-10 block m-auto object-cover rounded-lg"
              />
              <h1 className="font-semibold text-[20px] text-center pt-3">
                Travel policy compliance
              </h1>
              <p className="text-[14px] leading-[20px] pt-2 text-center">
                Implement Budget caps and Booking timeline controls within
                Tripbizz application for your employees
              </p>
            </div>
            <div className=" border-blue-200 border-solid border-[1px] p-3 rounded-md w-[300px] shadow-md">
              <img
                src={inventory}
                alt="Flight Booking"
                className="w-10 h-10 block m-auto object-cover rounded-lg"
              />
              <h1 className="font-semibold text-[20px] text-center pt-3">
                Huge inventory
              </h1>
              <p className="text-[14px] leading-[20px] pt-2 text-center">
                We offer live rates for more than 1000 airlines and 1 million
                hotels across the world
              </p>
            </div>
            <div className=" border-blue-200 border-solid border-[1px] p-3 rounded-md w-[300px] shadow-md">
              <img
                src={budget}
                alt="Flight Booking"
                className="w-10 h-10 block m-auto object-cover rounded-lg"
              />
              <h1 className="font-semibold text-[20px] text-center pt-3">
                On-trip Expenses Recording
              </h1>
              <p className="text-[14px] leading-[20px] pt-2 text-center">
                Capture your on-trip expenses such as meals, cabs etc directly
                on the mobile app
              </p>
            </div>
            <div className=" border-blue-200 border-solid border-[1px] p-3 rounded-md w-[300px] shadow-md">
              <img
                src={taxes}
                alt="Flight Booking"
                className="w-10 h-10 block m-auto object-cover rounded-lg"
              />
              <h1 className="font-semibold text-[20px] text-center  pt-3">
                GST Compliance
              </h1>
              <p className="text-[14px] leading-[20px] pt-2 text-center">
                GST compliant invoices are automatically generated in the
                application
              </p>
            </div>
            <div className=" border-blue-200 border-solid border-[1px] p-3 rounded-md w-[300px] shadow-md">
              <img
                src={report}
                alt="Flight Booking"
                className="w-10 h-10 block m-auto object-cover rounded-lg"
              />
              <h1 className="font-semibold text-[20px] text-center pt-3">
                Reporting & Reimbursements
              </h1>
              <p className="text-[14px] leading-[20px] pt-2 text-center">
                Download comprehensive expense reports for Finance submission at
                the click of a button
              </p>
            </div>
            <div className=" border-blue-200 border-solid border-[1px] p-3 rounded-md w-[300px] shadow-md">
              <img
                src={help}
                alt="Flight Booking"
                className="w-10 h-10 block m-auto object-cover rounded-lg"
              />
              <h1 className="font-semibold text-[20px] text-center pt-3">
                Offline Call & Chat support
              </h1>
              <p className="text-[14px] leading-[20px] pt-2 text-center">
                Get dedicated offline support for all your transactions &
                queries
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <section className="bg-gray-100 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 md:mb-8">
            Streamline Your Business Travel with TripBizz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="https://via.placeholder.com/300"
                alt="Flight Booking"
                className="w-full h-40 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-2">Flight Booking</h3>
              <p className="text-gray-700">
                Book flights hassle-free and efficiently manage your travel
                itinerary.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="https://via.placeholder.com/300"
                alt="Hotel Booking"
                className="w-full h-40 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-2">Hotel Booking</h3>
              <p className="text-gray-700">
                Find and book accommodations tailored to your needs at the best
                rates.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="https://via.placeholder.com/300"
                alt="Ground Transportation"
                className="w-full h-40 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-2">
                Ground Transportation
              </h3>
              <p className="text-gray-700">
                Arrange seamless transportation options including cabs, buses,
                and trains.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="https://via.placeholder.com/300"
                alt="Visa Assistance"
                className="w-full h-40 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-2">Visa Assistance</h3>
              <p className="text-gray-700">
                Get help with visa applications and ensure smooth entry into
                your destination.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="https://via.placeholder.com/300"
                alt="Mobile & Web App"
                className="w-full h-40 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-2">Mobile & Web App</h3>
              <p className="text-gray-700">
                Access TripBizz conveniently from anywhere with our mobile and
                web applications.
              </p>
            </div>
          </div>
        </div>
      </section> */}
      <section className="bg-gray-100 md:py-16 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="md:text-lg text-gray-600 mb-8 text-[14px] font-semibold">
              Manage and optimize business travel & expense operations on a
              single platform. We make business travel simple & efficient, while
              significantly reducing costs!
            </p>
            <div className="mb-8">
              <div className="md:flex md:flex-col flex-row items-center gap-1 rounded-md">
                <div className="bg-[#ee9b00] md:w-[50%] w-[100%] rounded-md h-[250px] md:rounded-tl-md md:rounded-bl-md flex items-center justify-center shadow-md">
                  <PiAirplaneTiltDuotone className="text-[100px] transition duration-300 ease-in-out transform hover:scale-105" />
                </div>
                <div className="text-center md:w-[50%] w-[100%] transition duration-300 ease-in-out transform hover:scale-105 p-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Flight Booking
                  </h3>
                  <p className="text-gray-600">
                    We offer live rates for more than 1000 airlines around the
                    world.
                  </p>
                </div>
              </div>
              <div className="md:flex md:flex-col flex-row-reverse items-center gap-1 rounded-md">
                <div className="bg-[#ca6702] md:w-[50%] w-[100%] rounded-md h-[250px] md:rounded-tl-md md:rounded-bl-md flex items-center justify-center shadow-md">
                  <RiHotelFill className="text-[100px] transition duration-300 ease-in-out transform hover:scale-105" />
                </div>
                <div className="text-center md:w-[50%] w-[100%] transition duration-300 ease-in-out transform hover:scale-105 p-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Hotel Booking
                  </h3>
                  <p className="text-gray-600">
                    Book from a huge inventory of over 1 million hotels across
                    the globe.
                  </p>
                </div>
              </div>
              <div className="md:flex md:flex-col flex-row items-center gap-1 rounded-md">
                <div className="bg-[#94d2bd] md:w-[50%] w-[100%] rounded-md h-[250px] md:rounded-tl-md md:rounded-bl-md flex items-center justify-center shadow-md">
                  <FaTaxi className="text-[100px] transition duration-300 ease-in-out transform hover:scale-105" />
                </div>
                <div className="text-center md:w-[50%] w-[100%] transition duration-300 ease-in-out transform hover:scale-105 p-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Cab Booking
                  </h3>
                  <p className="text-gray-600">
                    Get reliable, clean and professional cab services from
                    verified providers.
                  </p>
                </div>
              </div>
              <div className="md:flex md:flex-col flex-row-reverse items-center gap-1 rounded-md">
                <div className="bg-[#e9d8a6] md:w-[50%] w-[100%] rounded-md h-[250px] md:rounded-tl-md md:rounded-bl-md flex items-center justify-center shadow-md">
                  <FaBus className="text-[100px] transition duration-300 ease-in-out transform hover:scale-105" />
                </div>
                <div className="text-center md:w-[50%] w-[100%] transition duration-300 ease-in-out transform hover:scale-105 p-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Bus Booking
                  </h3>
                  <p className="text-gray-600">
                    Book buses from over 2000 bus companies in all major cities
                    and towns in India.
                  </p>
                </div>
              </div>
              <div className="md:flex md:flex-col flex-row items-center gap-1 rounded-md">
                <div className="bg-[#ee9b00] md:w-[50%] w-[100%] rounded-md h-[250px] md:rounded-tl-md md:rounded-bl-md flex items-center justify-center shadow-md">
                  <FaTrainSubway className="text-[100px] transition duration-300 ease-in-out transform hover:scale-105" />
                </div>
                <div className="text-center md:w-[50%] w-[100%] transition duration-300 ease-in-out transform hover:scale-105 p-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Train Booking
                  </h3>
                  <p className="text-gray-600">
                    Check seat availability and get confirmed train tickets for
                    your travel within India.
                  </p>
                </div>
              </div>
              <div className="md:flex md:flex-col flex-row-reverse items-center gap-1 rounded-md">
                <div className="bg-[#ca6702] md:w-[50%] w-[100%] rounded-md h-[250px] md:rounded-tl-md md:rounded-bl-md flex items-center justify-center shadow-md">
                  <FaPassport className="text-[100px] transition duration-300 ease-in-out transform hover:scale-105" />
                </div>
                <div className="text-center md:w-[50%] w-[100%] transition duration-300 ease-in-out transform hover:scale-105 p-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Visa Services
                  </h3>
                  <p className="text-gray-600">
                    Avail timely and professional Visa assistance services for
                    80+ countries around the world.
                  </p>
                </div>
              </div>
              {/* <div className="text-center transition duration-300 ease-in-out transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Hotel Booking
                </h3>
                <p className="text-gray-600">
                  Find and book accommodations seamlessly.
                </p>
              </div>
              <div className="text-center transition duration-300 ease-in-out transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Cab Service
                </h3>
                <p className="text-gray-600">
                  Arrange transportation conveniently.
                </p>
              </div>
              <div className="text-center transition duration-300 ease-in-out transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Bus & Train Tickets
                </h3>
                <p className="text-gray-600">
                  Secure travel tickets hassle-free.
                </p>
              </div>
              <div className="text-center transition duration-300 ease-in-out transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Visa Assistance
                </h3>
                <p className="text-gray-600">
                  Simplify visa application processes.
                </p>
              </div> */}
            </div>
            {/* Additional content like images or CTAs can be added here */}
          </div>
        </div>
      </section>
      <Callback />
      <footer className="bg-white dark:bg-gray-900 mt-[5rem]">
        <div className="mx-auto w-[90%] m-auto">
          <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Company
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <p>
                    <span className="font-bold">India Office:</span>
                    <br />
                    Quikprocess Pvt Ltd
                    <br />
                    Shriven 41, Plot 41, Phase 1, Kamalapuri colony
                    <br />
                    Banjara hills, Hyderabad, India
                  </p>
                  <p className="pt-2">
                    <span className="font-bold">Global Office:</span>
                    <br />
                    Travel World FZE LLC
                    <br />
                    Business Centre, Sharjah Publishing City
                    <br />
                    Free Zone, Sharjah, United Arab Emirates
                  </p>
                </li>
                {/* <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Careers
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Brand Center
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Blog
                  </a>
                </li> */}
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Help center
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                {/* <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Discord Server
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Twitter
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Facebook
                  </a>
                </li> */}
                <li className="mb-4">
                  <p className="hover:underline mb-2">Contact Us</p>
                  <p className="hover:underline">+91 8897851321</p>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <Link to="privacy">
                  <li className="mb-4">
                    <p className="hover:underline">Privacy Policy</p>
                  </li>
                </Link>
                {/* <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Licensing
                  </a>
                </li> */}
                <Link to="terms">
                  <li className="mb-4">
                    <p className="hover:underline">Terms &amp; Conditions</p>
                  </li>
                </Link>
                <Link to="cancellation">
                  <li className="mb-4">
                    <p className="hover:underline">Cancellation</p>
                  </li>
                </Link>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Download
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                {/* <li className="mb-4">
                  <a href="#" className="hover:underline">
                    iOS
                  </a>
                </li> */}
                {/* <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Android
                  </a>
                </li> */}
                <li>
                  <img src={play} alt="store" />
                </li>
                {/* <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Windows
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    MacOS
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        <div className="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
            © {new Date().getFullYear()}{" "}
            <a href="https://flowbite.com/">Quikprocess pvt ltd</a>. All Rights
            Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 8 19"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="sr-only">Facebook page</span>
            </a>

            <a
              href="#"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 17"
              >
                <path
                  fill-rule="evenodd"
                  d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="sr-only">Twitter page</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
