import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { db } from "../MyProvider";
import { Button } from "@mui/material";
import MyContext from "../Context";
import { FaSpinner } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";

const AddingTravellerSubmit = ({
  bookingBus,
  tripUserId,
  busData,
  tripData,
  totalBus,
  tripId,
  setBussubmitFromUser,
}) => {
  const { userFromAdmin } = useParams();
  const { actions, userId } = useContext(MyContext);
  const { control, handleSubmit, setValue, reset } = useForm();
  const approvalStatus = useWatch({
    control,
    name: "approvalStatus",
  });
  const [userAdminTravellers, setUserAdminTravellers] = useState();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const onSubmit = async (data) => {
    setSubmitLoading(true);
    const newData = { [totalBus.id]: data };
    console.log(newData, totalBus);
    const selectedBus = [totalBus.id];
    var busArray = tripData?.data?.bus.filter(
      (flight) => flight.requestStatus === "Not Requested"
    );
    const templateDataForApproval = {
      bus: tripData?.bus?.filter((flight) =>
        busArray.some((id) => id.id === flight.id)
      ),
      flight: [totalBus.id],
      travellerDetails: newData,
    };
    if (data.approvalStatus === "Pending") {
      if (
        data.approvalStatus === "Pending" &&
        userAdminTravellers?.manager?.email
      ) {
        await actions.sendBookingApprovalEmail({
          id: tripUserId,
          userName:
            userAdminTravellers.firstName + userAdminTravellers.lastName,
          userEmail: userAdminTravellers.email,
          managerEmail: userAdminTravellers.manager.email,
          managerName: userAdminTravellers.manager.firstName,
          tripName: tripData.data.name,
          templateData: templateDataForApproval,
        });
        const price = `${Math.ceil(
          totalBus?.data.busTotalPrice
        )?.toLocaleString("en-IN")}`;
        var req = await actions.sendApproval(
          tripUserId,
          userAdminTravellers?.manager?.userid,
          tripId,
          newData,
          price,
          data.bookingComments ? data.bookingComments : "",
          data.approvalStatus
        );
      } else {
        setSubmitLoading(false);
        alert(
          "A manager has not been assigned. Please assign a manager or skip the approval."
        );
        return false;
      }
    }

    await actions.updateTravDetails(newData, tripId, tripUserId);
    const templateBus = {
      bus: [totalBus.id],
      travellerDetails: newData,
    };

    const templateData = {
      flights: [],
      hotels: [],
      cabs: [],
      bus: [totalBus],
      travellerDetails: newData,
    };
    await editAdminTripsFromUser(
      tripId,
      tripData,
      newData,
      [],
      [],
      [],
      [],
      tripData.data?.name,
      selectedBus,
      undefined,
      "",
      templateData,
      userId,
      userAdminTravellers,
      data.approvalStatus
    );
    setSubmitLoading(false);
    setBussubmitFromUser(false);
    actions.getTripDocById(tripId, tripUserId);
    actions.setBusSearch();
  };
  useEffect(() => {
    fetchUserdetails();
  }, []);
  useEffect(() => {
    if (userAdminTravellers) {
      // Populate the form with fetched user details for the first traveler
      reset({
        adults: [
          {
            gender: userAdminTravellers.gender || "Mr",
            firstName: userAdminTravellers.firstName || "",
            lastName: userAdminTravellers.lastName || "",
            birthDate: userAdminTravellers.birthDate || "",
            email: userAdminTravellers.email || "",
            mobileNumber: userAdminTravellers.mobileNumber || "",
            approvalStatus: "Pending",
          },
        ],
      });
    }
  }, [userAdminTravellers, reset]);

  const fetchUserdetails = async () => {
    setLoading(true);
    const travellersRef = await db.collection("Accounts").doc(tripUserId).get();
    const travellers = await travellersRef.data();
    setUserAdminTravellers(travellers);
    setLoading(false);
  };

  const editAdminTripsFromUser = async (
    tripId,
    data,
    travellerDetails,
    submittedHotels,
    submittedFlights,
    requestIds,
    submittedCabs,
    tripName,
    submittedBus,
    notBus,
    comment,
    templateData,
    userId,
    userAdminTravellers,
    status
  ) => {
    var accountDocRef = db.collection("Accounts").doc(userId);
    var tripCollectionRef = accountDocRef.collection("trips");
    var tripQuery = tripCollectionRef.where("tripId", "==", tripId);
    var querysnapshot = await tripQuery.get();
    var hotelArray = [];
    hotelArray = submittedHotels?.map((hotel) => {
      return { status: "Not Submitted", id: hotel };
    });
    for (const req of requestIds) {
      const userDocRef = db.collection("Accounts").doc(tripUserId);
      const tripReqcollectionRef = userDocRef.collection("tripRequests");
      const tripReqDoc = tripReqcollectionRef.doc(req);

      await updateDoc(tripReqDoc, {
        tripStatus: "Submitted",
      });
    }
    var flightArray = [];
    flightArray = submittedFlights?.map((flight) => {
      return { status: "Not Submitted", id: flight };
    });
    await actions.sendBookingSubmitEmail({
      id: tripUserId,
      name: userAdminTravellers.firstName + userAdminTravellers.lastName,
      email: userAdminTravellers.email,
      tripName: tripName,
      templateData: templateData,
    });
    var cabArray = [];
    cabArray = submittedCabs?.map((hotel) => {
      return { status: "Not Submitted", id: hotel };
    });
    var busArray = [];
    busArray =
      submittedBus.length > 0
        ? submittedBus?.map((hotel) => {
            return { status: "Not Submitted", id: hotel };
          })
        : [];
    if (!querysnapshot.empty) {
      var docRef = querysnapshot.docs[0].ref;
      var admintripdata = querysnapshot.docs[0].data();
      var existingTravellerDetails = admintripdata?.travellerDetails || {};
      await docRef.update({
        hotels: [...admintripdata.hotels, ...hotelArray],
        flights: [...admintripdata.flights, ...flightArray],
        travellerDetails: {
          ...existingTravellerDetails,
          ...travellerDetails,
        },
        cabs: [...admintripdata.cabs, ...cabArray],
        bus: [...admintripdata.bus, ...busArray],
      });
    } else {
      const userCollectionRef = db.collection("Accounts").doc(tripUserId);
      const doc = await userCollectionRef.get();
      const userData = doc.data();
      var docCollectionRef = db.collection("Accounts").doc(userId);
      var tripCollectionRef = docCollectionRef.collection("trips");
      var data1 = await actions.getTripDocById(tripId, tripUserId);
      var hotelArray = [];
      hotelArray = submittedHotels?.map((hotel) => {
        return { status: "Not Submitted", id: hotel };
      });
      var flightArray = [];
      flightArray = submittedFlights.map((flight) => {
        return { status: "Not Submitted", id: flight };
      });

      var cabArray = [];
      cabArray = submittedCabs.map((flight) => {
        return { status: "Not Submitted", id: flight };
      });
      var busArray = [];
      busArray =
        submittedBus.length > 0
          ? submittedBus.map((flight) => {
              return { status: "Not Submitted", id: flight };
            })
          : [];

      var newtripDocRef = await tripCollectionRef.add({
        userDetails: userData,
        tripId: tripId,
        tripName: data1?.name,
        hotels: hotelArray,
        flights: flightArray,
        cabs: cabArray,
        status: "Not Submitted",
        submittedDate: Date.now(),
        travellerDetails: travellerDetails,
        bus: busArray,
        comment: comment,
      });
      var adminRef = await db.collection("Accounts").doc(userId);
      await updateDoc(adminRef, {
        trips: arrayUnion(newtripDocRef.id),
      });
      var accountCollectionRef = db.collection("Accounts").doc(tripUserId);
      var tripCollectionRefe = accountCollectionRef
        .collection("trips")
        .doc(tripId);
      await tripCollectionRefe.update({
        status: "Submitted",
        travellerDetails: travellerDetails,
      });
      if (busArray) {
        busArray.map(async (bus) => {
          var accountCollectRef = db.collection("Accounts").doc(tripUserId);
          var tripCollRef = accountCollectRef.collection("trips").doc(tripId);
          var userBusDetails = await tripCollRef.get();
          var userBussArray = userBusDetails.data().bus;
          var userCurrBuss = userBussArray.filter((hotel) => {
            return hotel.id === bus.id;
          });
          await updateDoc(tripCollRef, {
            bus: arrayRemove(userCurrBuss[0]),
          });

          await updateDoc(tripCollRef, {
            bus: arrayUnion({
              ...userCurrBuss[0],
              status: "Submitted",
              submitted_date: userCurrBuss[0].submitted_date
                ? userCurrBuss[0].submitted_date
                : new Date(),
              booked_date:
                status === "Booked" || status === "Booked,Payment Pending"
                  ? new Date()
                  : null,
              requestStatus: status,
            }),
          });

          var adminCollRef = db.collection("Accounts").doc(userId);

          var admintripCollRef = adminCollRef
            .collection("trips")
            .doc(newtripDocRef.id);
          var adminBusDetails = await admintripCollRef.get();
          var adminBusArray = adminBusDetails.data().bus;
          var admincurrBus = adminBusArray.filter((hotel) => {
            return hotel.id === bus.id;
          });

          await updateDoc(admintripCollRef, {
            bus: arrayRemove(admincurrBus[0]),
          });

          if (status === "Booked" || status === "Booked,Payment Pending") {
            await updateDoc(admintripCollRef, {
              bus: arrayUnion({
                ...userCurrBuss[0],
                status: status,
                bookedAt: Date.now(),
              }),
            });
          } else {
            await updateDoc(admintripCollRef, {
              bus: arrayUnion({
                ...userCurrBuss[0],
                status: "Submitted",
                submitted_date: new Date(),
                requestStatus: status,
              }),
            });
          }
        });
      }

      await actions.getAdminTripDoc(tripId, tripUserId);
      return;
    }
    var accountCollectionRef = db.collection("Accounts").doc(tripUserId);
    var tripCollectionRef1 = accountCollectionRef
      .collection("trips")
      .doc(tripId);
    await updateDoc(tripCollectionRef1, {
      status: "Submitted",
      travellerDetails: { ...existingTravellerDetails, ...travellerDetails },
    });
    if (!querysnapshot.empty) {
      if (busArray) {
        busArray.map(async (cab) => {
          var accountCollectRef = db.collection("Accounts").doc(tripUserId);
          var tripCollRef = accountCollectRef.collection("trips").doc(tripId);
          var userBusDetails = await tripCollRef.get();
          var userBussArray = userBusDetails.data().bus;
          console.log(userBussArray);
          var userCurrBuss = userBussArray.filter((hotel) => {
            return hotel.id === cab.id;
          });
          await updateDoc(tripCollRef, {
            bus: arrayRemove(userCurrBuss[0]),
          });

          await updateDoc(tripCollRef, {
            bus: arrayUnion({
              ...userCurrBuss[0],
              status: "Submitted",
              submitted_date: userCurrBuss[0].submitted_date
                ? userCurrBuss[0].submitted_date
                : new Date(),
              booked_date:
                status === "Booked" || status === "Booked,Payment Pending"
                  ? new Date()
                  : null,
              requestStatus: status,
            }),
          });
          var adminCollRef = db.collection("Accounts").doc(userId);

          var admintripCollRef = adminCollRef
            .collection("trips")
            .doc(querysnapshot.docs[0].id);
          var adminBusDetails = await admintripCollRef.get();
          var adminBusArray = adminBusDetails.data().bus;
          var admincurrBus = adminBusArray.filter((hotel) => {
            return hotel.id === cab.id;
          });

          await updateDoc(admintripCollRef, {
            bus: arrayRemove(admincurrBus[0]),
          });

          if (status === "Booked" || status === "Booked,Payment Pending") {
            await updateDoc(admintripCollRef, {
              bus: arrayUnion({
                ...userCurrBuss[0],
                status: "Submitted",
                bookedAt: Date.now(),
              }),
            });
          } else {
            await updateDoc(admintripCollRef, {
              bus: arrayUnion({
                ...userCurrBuss[0],
                status: "Submitted",
                submitted_date: new Date(),
                requestStatus: status,
              }),
            });
          }
        });
      }
    }
    await actions.getAdminTripDoc(tripId, tripUserId);
    // await this.state.actions.getTripDocById(tripid,userId?userId:this.state.userId)
    //this.state.actions.editTripStatus(this.state.userId,tripid,querysnapshot.id)
  };

  return (
    <>
      {" "}
      {loading ? (
        <p>Loading....</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] h-[80vh]">
          <>
            {Array.from(
              { length: parseInt(bookingBus && bookingBus.passengers) },
              (_, i) => {
                return (
                  <div key={`adult-${i}`} className="gap-[10px] mt-[20px]">
                    <h1 className="font-bold text-center py-1">
                      Passenger-{i + 1}
                    </h1>
                    <div className="gap-2 flex-wrap justify-center">
                      <div className="flex flex-wrap gap-[10px] items-center justify-center">
                        <label className="flex flex-col text-[12px]">
                          Title
                          <Controller
                            name={`adults[${i}].gender`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAdminTravellers?.gender : "Mr"
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
                        <label className="flex flex-col text-[12px]">
                          First Name
                          <Controller
                            name={`adults[${i}].firstName`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAdminTravellers?.firstName : ""
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
                              i === 0 ? userAdminTravellers?.lastName : ""
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
                        <label className="flex flex-col text-[12px]">
                          Age
                          <Controller
                            name={`adults[${i}].birthDate`}
                            control={control}
                            render={({ field }) => (
                              <input
                                type="number"
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                                placeholder="Age"
                                required
                                disabled={isFormDisabled}
                              />
                            )}
                          />
                        </label>
                      </div>
                      {i === 0 && (
                        <div className="flex flex-wrap gap-[10px] items-center my-2 justify-center">
                          <Controller
                            name={`adults[${i}].gender`}
                            control={control}
                            defaultValue={
                              i === 0 ? userAdminTravellers?.gender : "Mr"
                            }
                            render={({ field }) => (
                              <select
                                {...field}
                                className={`${
                                  !isFormDisabled
                                    ? "border-[1.5px]"
                                    : "border-[0px]"
                                } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal invisible`}
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
                                i === 0 ? userAdminTravellers?.email : ""
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
                                i === 0 ? userAdminTravellers?.mobileNumber : ""
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
              }
            )}
          </>
          <div className="flex items-center gap-4 justify-center mt-4">
            <Controller
              name={`approvalStatus`}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`${
                    !isFormDisabled ? "border-[1.5px]" : "border-[0px]"
                  } border-solid focus:outline-none border-black rounded-md pl-2 py-[2px] text-[16px] font-normal`}
                  required
                  disabled={isFormDisabled}
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Skipped">Skipped</option>
                  <option value="Approved">Approved</option>
                  {/* <option value="Approved on WhatsApp">
                    Approved on WhatsApp
                  </option>
                  <option value="Approved on Email">Approved on Email</option> */}
                </select>
              )}
            />
            {approvalStatus === "Approved" && (
              <Controller
                name="approvalType"
                control={control}
                rules={{
                  required: "Approval Type is required",
                }}
                defaultValue={""}
                render={({ field }) => (
                  <textarea
                    {...field}
                    required
                    placeholder="Approval Type"
                    className="border border-black rounded-md placeholder:text-[14px] pl-1 py-1"
                  ></textarea>
                )}
              />
            )}
            <Controller
              name="bookingComments"
              control={control}
              // rules={{
              //   required:
              //     approvalStatus === "Approved"
              //       ? false
              //       : "Approval comments are required",
              // }}
              defaultValue={"NA"}
              render={({ field }) => (
                <textarea
                  required
                  {...field}
                  placeholder="Approval Comments"
                  className="border border-black rounded-md placeholder:text-[14px] pl-1 py-1"
                ></textarea>
              )}
            />
          </div>

          <div className="flex gap-2 justify-center items-center mt-3">
            {/* {busData?.status === "Not Submitted" ? (
              <>
                {tripData?.data?.travellerDetails &&
                tripData?.data?.travellerDetails[totalBus?.id] ? (
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
            ) : null} */}
            <Button
              type="submit"
              className="bg-black text-white rounded-md"
              size="small"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <FaSpinner className="animate-spin mr-2 ml-2" size={20} />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default AddingTravellerSubmit;
