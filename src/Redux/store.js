import { configureStore} from "@reduxjs/toolkit";
import flightsReducer from "./Slices/flightSlice";



export const store = configureStore({
  reducer: {
    flights:flightsReducer
  },
});
