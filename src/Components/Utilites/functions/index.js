import { v4 as uuidv4 } from "uuid";
import { db } from "../../MyProvider";

const generateShortId = () => {
  return uuidv4().replace(/-/g, "").slice(0, 8);
};

export const generateBookingId = async (
  type,
  threadId,
  userId,
  price,
  email,
  through,
  gst,
  serviceCharge,
  details,
  bookingDate,
  link,
  bookingCost,
  companyName
) => {
  try {
    const bookingId = generateShortId();
    const bookingRef = db.collection("bookingId").doc(bookingId);
    const data = {
      user: userId,
      service: "hotel",
      date: new Date(),
      bookingId: bookingId,
      type: type,
      threadId: threadId || "",
      bookingType: "Manual",
      price: bookingCost,
      email: email,
      bookingthrough: through,
      gst: gst,
      serviceCharge: serviceCharge,
      details: details,
      bookingDate: bookingDate,
      fileUrl: link,
      finalTotalPrice: price,
      companyName: companyName,
    };
    await bookingRef.set({
      ...data,
      createdAt: new Date().toISOString(),
    });
    return {
      bookingId: bookingId,
    };
  } catch (error) {
    console.log("error white generating booking id", error);
  }
};
