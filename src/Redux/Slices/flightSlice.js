import { createSlice } from "@reduxjs/toolkit";


const flightsSlice = createSlice({
  name: "flights",
  initialState: {
    flightResult: {},
    flightRequest: {},
    internationalFlights: false,
    flightResList: [],
    flightSessionStarted: false,
    flightSessionExpired: false,
  },
  reducers: {
    separateFlightsByType: (state, actions) => {
      state.flightResList = actions.payload.results;
      state.internationalFlights =
        actions.payload.results.length > 1 ? false : true;
    },
    // flightSearch: async (state, actions) => {
    //   var query = actions.payload;

    //   state.flightResList = [];
    //   state.searchingFlights = true;
    //   state.flightSessionStarted = false;
    //   state.flightSessionExpired = false;

    //   var request = {
    //     adults: query.adults,
    //     child: query.child,
    //     infant: query.infant,
    //     directFlight: query.directFlight,
    //     oneStopFlight: query.oneStopFlight,
    //     journeyType: query.journeyType,
    //     preferredAirlines: null,
    //     sources: null,
    //   };

    //   var segments = [];
    //   var months = [
    //     "01",
    //     "02",
    //     "03",
    //     "04",
    //     "05",
    //     "06",
    //     "07",
    //     "08",
    //     "09",
    //     "10",
    //     "11",
    //     "12",
    //   ];

    //   if (query.journeyType === "2") {
    //     segments = [
    //       {
    //         Origin: query.origin,
    //         Destination: query.destination,
    //         FlightCabinClass: query.flightCabinClass,
    //         PreferredDepartureTime: `${new Date(
    //           query.outboundDate
    //         ).getFullYear()}-${months[new Date(query.outboundDate).getMonth()]
    //           }-${new Date(query.outboundDate).getDate() < 10
    //             ? "0" + new Date(query.outboundDate).getDate()
    //             : new Date(query.outboundDate).getDate()
    //           }T00:00:00`,
    //         PreferredArrivalTime: `${new Date(
    //           query.outboundDate
    //         ).getFullYear()}-${months[new Date(query.outboundDate).getMonth()]
    //           }-${new Date(query.outboundDate).getDate() < 10
    //             ? "0" + new Date(query.outboundDate).getDate()
    //             : new Date(query.outboundDate).getDate()
    //           }T00:00:00`,
    //       },
    //       {
    //         Origin: query.destination,
    //         Destination: query.origin,
    //         FlightCabinClass: query.flightCabinClass,
    //         PreferredDepartureTime: `${new Date(
    //           query.inboundDate
    //         ).getFullYear()}-${months[new Date(query.inboundDate).getMonth()]
    //           }-${new Date(query.inboundDate).getDate() < 10
    //             ? "0" + new Date(query.inboundDate).getDate()
    //             : new Date(query.inboundDate).getDate()
    //           }T00:00:00`,
    //         PreferredArrivalTime: `${new Date(
    //           query.inboundDate
    //         ).getFullYear()}-${months[new Date(query.inboundDate).getMonth()]
    //           }-${new Date(query.inboundDate).getDate() < 10
    //             ? "0" + new Date(query.inboundDate).getDate()
    //             : new Date(query.inboundDate).getDate()
    //           }T00:00:00`,
    //       },
    //     ];
    //   } else {
    //     segments = [
    //       {
    //         Origin: query.origin,
    //         Destination: query.destination,
    //         FlightCabinClass: query.flightCabinClass,
    //         PreferredDepartureTime: `${new Date(
    //           query.outboundDate
    //         ).getFullYear()}-${months[new Date(query.outboundDate).getMonth()]
    //           }-${new Date(query.outboundDate).getDate() < 10
    //             ? "0" + new Date(query.outboundDate).getDate()
    //             : new Date(query.outboundDate).getDate()
    //           }T00:00:00`,
    //         PreferredArrivalTime: `${new Date(
    //           query.outboundDate
    //         ).getFullYear()}-${months[new Date(query.outboundDate).getMonth()]
    //           }-${new Date(query.outboundDate).getDate() < 10
    //             ? "0" + new Date(query.outboundDate).getDate()
    //             : new Date(query.outboundDate).getDate()
    //           }T00:00:00`,
    //       },
    //     ];
    //   }

    //   request.segments = segments;

    //   console.log("Search req", request);

    //   var flightRes = await fetch(
    //     "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightSearch",
    //     {
    //       method: "POST",
    //       // credentials: "include",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(request),
    //     }
    //   )
    //     .then((res) => res.json())
    //     .catch((err) => console.log(err));

    //   console.log(flightRes);

    //   // flightsSlice.caseReducers.separateFlightsByType(state, {
    //   //   payload: { results: flightRes.flightResult.Response.Results },
    //   // });

    //   state.flightResList = flightRes.flightResult.Response.Results;
    //   state.flightResult = flightRes.flightResult.Response;
    //   state.searchingFlights = false;
    //   state.flightSessionStarted = true;

    //   setTimeout((state) => {
    //     state.flightSessionStarted = false;
    //     state.flightSessionExpired = true;
    //     console.log("Session expired");
    //   }, 5000);//840
    // },
  },
});

export const { flightSearch, separateFlightsByType } = flightsSlice.actions;

export default flightsSlice.reducer;