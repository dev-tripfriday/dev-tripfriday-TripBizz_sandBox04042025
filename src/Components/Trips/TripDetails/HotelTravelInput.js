import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Popup from "../../Popup";
import { Controller, useForm } from "react-hook-form";
import MyContext from "../../Context";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import InvoicePdf1 from "../../InvoicePdf1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import TravDetails from "./TravellerDetails";

const HotelTravelInput = ({
  adminTripdata,
  hotel,
  hotelData,
  adults,
  child,
  tripId,
  hotelBookingStatus,
  endDate,
  userId,
  userPage,
  userAccountDetails,
  userFromAdmin,
}) => {
  console.log(hotelData);
  const { control, handleSubmit, setValue, reset } = useForm();
  const { actions, tripData } = useContext(MyContext);
  const [addTravellers, setAddTravellers] = useState(false);
  const [newtravellerDetails, setNewTravellerDetails] = useState();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [openTravellers, setOpenTravellers] = useState(false);
  const onSubmit = (data) => {
    console.log(hotel.id);
    const newData = { [hotel.id]: data };
    console.log(newData);
    // setNewTravellerDetails({
    //   ...newtravellerDetails,
    //   [id]: data,
    // });
    // console.log(newtravellerDetails);
    actions.updateTravDetails(newData, tripId);
    setAddTravellers(false);
    // console.log(data); // Handle form submission here
  };
  useEffect(() => {
    console.log(userId, tripId);
    const fetch = async () => {
      const data = await actions.getInvoiceDetails(userId, tripId);
      console.log(data);
      if (data.length > 0) {
        setInvoiceData(data);
      }
    };
    fetch();
  }, []);
  var isThere = null;
  if (invoiceData.length > 0) {
    isThere = invoiceData.find((item) => item.cardId === hotelData?.id);
  }

  const adminHotelTravAdult =
    adminTripdata?.data?.travellerDetails[hotel?.id]?.adults;
  const adminHotelTravChild =
    adminTripdata?.data?.travellerDetails[hotel?.id]?.children;
  console.log(adminTripdata, adminHotelTravAdult, adminHotelTravChild, tripId);
  useEffect(() => {
    if (newtravellerDetails) {
      console.log(newtravellerDetails);
      setIsFormDisabled(true);
      if (newtravellerDetails.children) {
        newtravellerDetails.children.forEach((child, index) => {
          setValue(`children[${index}].gender`, child.gender);
          setValue(`children[${index}].firstName`, child.firstName);
          setValue(`children[${index}].lastName`, child.lastName);
          // Set other values similarly
        });
      }
      if (newtravellerDetails.adults) {
        newtravellerDetails.adults.forEach((adults, index) => {
          setValue(`adults[${index}].gender`, adults.gender);
          setValue(`adults[${index}].firstName`, adults.firstName);
          setValue(`adults[${index}].lastName`, adults.lastName);
          if (index === 0) {
            setValue(`adults[${index}].email`, adults.email);
            setValue(`adults[${index}].mobileNumber`, adults.mobileNumber);
          }
          // Set other values similarly
        });
      }
    }
  }, [newtravellerDetails, setValue]);

  return (
    <>
      <div>
        <Popup condition={addTravellers} close={() => setAddTravellers(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-[100%]">
            <>
              {Array.from({ length: parseInt(adults) }, (_, i) => {
                return (
                  <div key={`adult-${i}`} className="gap-[10px] mt-[20px]">
                    <h1 className="font-bold text-center py-1">
                      Adult-{i + 1}
                    </h1>
                    <div className="gap-2 flex-wrap justify-center">
                      <div className="flex gap-[10px] items-center justify-center flex-wrap">
                        <label className="flex flex-col text-[12px]">
                          Title
                          <Controller
                            name={`adults[${i}].gender`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAccountDetails.gender : "Mr"
                            }
                            render={({ field }) => (
                              <select
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                required
                                disabled={isFormDisabled}
                              >
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                              </select>
                            )}
                          />
                        </label>
                        <label className="flex flex-col text-[12px] ">
                          First Name
                          <Controller
                            name={`adults[${i}].firstName`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAccountDetails.firstName : ""
                            }
                            render={({ field }) => (
                              <input
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                placeholder="FirstName"
                                required
                                disabled={isFormDisabled}
                              />
                            )}
                          />
                        </label>
                        <label className="flex flex-col text-[12px]">
                          Last Name
                          <Controller
                            name={`adults[${i}].lastName`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAccountDetails.lastName : ""
                            }
                            render={({ field }) => (
                              <input
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                placeholder="LastName"
                                required
                                disabled={isFormDisabled}
                              />
                            )}
                          />
                        </label>
                      </div>
                      {i === 0 && (
                        <div className="flex gap-[10px] items-center justify-center my-2 flex-wrap">
                          <Controller
                            name={`adults[${i}].gender`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAccountDetails.gender : "Mr"
                            }
                            render={({ field }) => (
                              <select
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] invisible`}
                                required
                                disabled={isFormDisabled}
                              >
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                              </select>
                            )}
                          />
                          <label className="flex flex-col text-[12px]">
                            Email
                            <Controller
                              name={`adults[${i}].email`}
                              control={control}
                              defaultValue={
                                i === 0 ? userAccountDetails.email : ""
                              }
                              render={({ field }) => (
                                <input
                                  {...field}
                                  className={`${
                                    !isFormDisabled
                                      ? "border-[1.5px]"
                                      : "border-[0px]"
                                  } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                  placeholder="Email"
                                  required
                                  disabled={isFormDisabled}
                                />
                              )}
                            />
                          </label>
                          <label className="flex flex-col text-[12px]">
                            Mobile Number
                            <Controller
                              name={`adults[${i}].mobileNumber`}
                              control={control}
                              defaultValue={
                                i === 0 ? userAccountDetails.mobileNumber : ""
                              }
                              render={({ field }) => (
                                <input
                                  {...field}
                                  className={`${
                                    !isFormDisabled
                                      ? "border-[1.5px]"
                                      : "border-[0px]"
                                  } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                  placeholder="Mobile Number"
                                  required
                                  disabled={isFormDisabled}
                                />
                              )}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {Array.from({ length: parseInt(child) }, (_, i) => {
                return (
                  <div key={`adult-${i}`} className="gap-[10px] mt-[20px]">
                    <h1 className="font-bold text-center py-1">
                      Child-{i + 1}
                    </h1>
                    <div className="flex gap-2 flex-wrap  justify-center">
                      <label className="flex flex-col text-[12px]">
                        Title
                        <Controller
                          name={`children[${i}].gender`}
                          control={control}
                          defaultValue={"Mr"}
                          render={({ field }) => (
                            <select
                              {...field}
                              className={`${
                                !isFormDisabled
                                  ? "border-[1.5px]"
                                  : "border-[0px]"
                              } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                              required
                              disabled={isFormDisabled}
                            >
                              <option value="Mr">Mr</option>
                              <option value="Ms">Ms</option>
                              <option value="Mrs">Mrs</option>
                            </select>
                          )}
                        />
                      </label>
                      <label className="flex flex-col text-[12px]">
                        First Name
                        <Controller
                          name={`children[${i}].firstName`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              {...field}
                              className={`${
                                !isFormDisabled
                                  ? "border-[1.5px]"
                                  : "border-[0px]"
                              } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                              placeholder="FirstName"
                              required
                              disabled={isFormDisabled}
                            />
                          )}
                        />
                      </label>
                      <label className="flex flex-col text-[12px]">
                        Last Name
                        <Controller
                          name={`children[${i}].lastName`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              {...field}
                              className={`${
                                !isFormDisabled
                                  ? "border-[1.5px]"
                                  : "border-[0px]"
                              } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                              placeholder="LastName"
                              required
                              disabled={isFormDisabled}
                            />
                          )}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </>

            <div className="flex gap-2 justify-center items-center mt-3">
              {hotelBookingStatus === "Not Submitted" ? (
                <>
                  {" "}
                  {tripData?.data?.travellerDetails &&
                  tripData?.data?.travellerDetails[hotel?.id] ? (
                    !isFormDisabled ? (
                      <Button
                        type="submit"
                        variant="contained"
                        className="bg-black"
                        size="small"
                        // onClick={handleSubmit(onSubmit)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent form submission
                          setIsFormDisabled(false);
                        }}
                        variant="contained"
                        className="!bg-gray-300 text-black"
                      >
                        Edit
                      </Button>
                    )
                  ) : (
                    <Button
                      // onClick={handleSubmit(onSubmit)}
                      type="submit"
                      variant="contained"
                      className="bg-black"
                      size="small"
                    >
                      Save
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </form>
        </Popup>
        <Popup
          condition={openTravellers}
          close={() => setOpenTravellers(false)}
        >
          <div className="traveller-details-container">
            <div className="traveller-details-header">Traveller Details</div>
            {adminTripdata?.data?.travellerDetails ? (
              <>
                {adminHotelTravAdult &&
                  adminHotelTravAdult?.map((trav, i) => {
                    return (
                      <TravDetails type={"Adult"} index={i + 1} trav={trav} />
                    );
                  })}
                {adminHotelTravChild &&
                  adminHotelTravChild?.map((trav, i) => {
                    return (
                      <TravDetails type={"Adult"} index={i + 1} trav={trav} />
                    );
                  })}
              </>
            ) : null}
          </div>
        </Popup>
        {!userPage && (
          <>
            {tripData?.data?.travellerDetails &&
            tripData?.data?.travellerDetails[hotel.id] ? (
              <Button
                sx={{ position: "static", fontSize: "11px" }}
                className="!bg-[#94d2bd] !text-black"
                size="small"
                onClick={() => {
                  console.log(hotel.id);

                  setNewTravellerDetails(
                    () => tripData?.data?.travellerDetails[hotel.id]
                  );
                  setAddTravellers(true);
                  console.log(newtravellerDetails);
                }}
              >
                View Travellers
              </Button>
            ) : (
              <Button
                sx={{ position: "static", fontSize: "11px" }}
                className="!bg-[#0a9396] !text-white"
                size="small"
                onClick={() => {
                  console.log(hotel.id);

                  // setNewTravellerDetails(
                  //   () => tripData?.data?.travellerDetails[hotel.id]
                  // );

                  setAddTravellers(true);
                }}
              >
                Add Travellers
              </Button>
            )}
          </>
        )}
      </div>

      {userPage ? (
        <>
          {isThere && (
            <button onClick={() => {}}>
              <PDFDownloadLink
                className="font-semibold"
                document={
                  <InvoicePdf1
                    type="Hotel"
                    hotel={hotel}
                    userAccountDetails={userAccountDetails}
                    invoiceId={isThere.invoiceId}
                    endDate={endDate}
                    tripData={tripData}
                    hotelData={hotelData}
                  />
                }
                fileName={`${
                  userPage ? adminTripdata?.data?.name : tripData.data?.name
                }_Invoice.pdf`}
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <div className="flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt] font-semibold">
                      <p>Invoice PDF</p>
                      <FontAwesomeIcon icon={faDownload} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt] font-semibold">
                      <p>Invoice PDF</p>
                      <FontAwesomeIcon icon={faDownload} />
                    </div>
                  )
                }
              </PDFDownloadLink>
            </button>
          )}
        </>
      ) : (
        <>
          {isThere && (
            <button onClick={() => {}}>
              <PDFDownloadLink
                className="font-semibold"
                document={
                  <InvoicePdf1
                    type="Hotel"
                    hotel={hotel}
                    userAccountDetails={userAccountDetails}
                    invoiceId={isThere.invoiceId}
                    endDate={endDate}
                    tripData={tripData}
                    hotelData={hotelData}
                  />
                }
                fileName={`${tripData.data?.name}_Invoice.pdf`}
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <div className="flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt] font-semibold">
                      <p>Invoice PDF</p>
                      <FontAwesomeIcon icon={faDownload} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 border-[1px] border-black rounded-[0.8rem] p-[4pt] text-[10pt] font-semibold">
                      <p>Invoice PDF</p>
                      <FontAwesomeIcon icon={faDownload} />
                    </div>
                  )
                }
              </PDFDownloadLink>
            </button>
          )}
        </>
      )}

      {userPage && (
        <>
          <button
            onClick={() => {
              setOpenTravellers(true);
            }}
          >
            Traveller Details
          </button>
        </>
      )}
      {userFromAdmin && (
        <button
          className="rounded-md sborder-solid border-[1px] border-black px-2 py-1"
          onClick={() => setAddTravellers(true)}
        >
          Submit
        </button>
      )}
      {/* <PDFViewer width="100%" height="600">
        <InvoicePdf1
          type="Hotel"
          hotel={hotel}
          userAccountDetails={userAccountDetails}
          // invoiceId={isThere.invoiceId}
          endDate={endDate}
          tripData={tripData}
          hotelData={hotelData}
        />
      </PDFViewer> */}
    </>
  );
};

export default HotelTravelInput;
