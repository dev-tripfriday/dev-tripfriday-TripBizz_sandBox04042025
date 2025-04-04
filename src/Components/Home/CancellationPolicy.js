import React from "react";
import "./Home.css";
import Header from "./Header";

const CancellationPolicy = () => {
  return (
    <>
      <Header />
      <div className="cancellation-block">
        <div className="cancellation-main-header">Cancellation Policy</div>
        <div className="cancellation-sub-header">General</div>
        <div className="cancellation-sub-text">
          The cancellation policy is effective for all bookings made by
          Tripbizz. Customers eligible for refunds will receive the refund
          amount within 20 working days from the date of cancellation. However,
          the timeline could vary based on the refund processing window of
          individual suppliers.
        </div>
        <div className="cancellation-sub-header">Flights</div>
        <div className="cancellation-sub-text">
          <p>
            • On cancelling flights marked as “Non-Refundable” on the final
            travel vouchers, customers will be eligible for a zero refund.
          </p>
          <p>
            • For Flights marked as “Refundable” on the final travel vouchers,
            customers will receive a refund as per the details mentioned under
            the “Cancellation Policy” section of the product and also in the
            final itinerary.
          </p>
          <p>
            <p></p>• The total refunds for flights may include components which
            vary as per the international exchange rates.
          </p>
          <p>
            • Tripbizz will not be responsible for grounded/cancelled/delayed
            flights. Any cancellation requests for these flights will have to be
            placed with the respective airlines. Realization of refunds would be
            subject to processing by the respective airline carrier.
          </p>
          <p>
            • The onus is on the customer to ensure that his/her passport has a
            minimum of 1-year validity and is in good condition. Tripbizz is not
            liable to refund a customer who is not allowed to board the flight
            because of invalid passports (validity expired, damaged passports).
          </p>
          <p>
            • Customers are expected to reach the airport ahead of their
            boarding time (at least 2 hours prior to boarding time). Tripbizz is
            not responsible to refund customers (for cases wherein airport
            transfers are not planned by us) who miss their flights owing to
            delayed arrival at the airport.
          </p>
          <p>
            • For cases wherein airport transfers are planned by Tripbizz,
            flight cancellations due to delayed transfers owing to unforeseen
            circumstances specific to a region will not be borne by Tripbizz.
          </p>
          <p>
            • Details about baggage limitations (cabin and check-in) will be
            furnished as part of the final travel vouchers. Additional costs
            owing to breached baggage limits will have to be paid by the
            customer at the time of check-in.
          </p>
          <p>
            • Certain flight carriers (LCC like Ryanair, Vueling, Voltea etc.)
            have a mandatory web check-in policy. Failure to comply with this
            could result in an additional cost to be paid at the airport.
            Tripbizz is not liable to refund customers in such circumstances.
          </p>
          <p>
            • Tripbizz will set meal preferences for customers with airline
            carriers upon request. However, Tripbizz has no control over the
            availability and quality of meals served on the flight. This will be
            controlled completely by the airline carrier.
          </p>
        </div>
        <div className="cancellation-sub-header">Hotels</div>
        <div className="cancellation-sub-text">
          <p>
            • On cancelling hotels which have been marked as “Non-Refundable” on
            the final travel vouchers, the customer will be eligible for a zero
            refund.
          </p>
          <p>
            {" "}
            • For hotels which have been marked as “Refundable” on the final
            travel vouchers, refunds and their timelines will be applicable as
            mentioned under the “Cancellation Policy” section of the product and
            in the final itinerary.
          </p>
          <p>
            {" "}
            • The total refunds for hotels may include components which vary
            with international exchange rates.
          </p>
          <p>
            {" "}
            • While Tripbizz strives to provide the best hotels with world-class
            amenities, we cannot be held responsible for factors such as hotel
            staff behaviour, cleanliness and quality of accommodation.
            Additional costs owing to on-trip room upgrades and additional
            amenities will be borne by the customer. All hotels changed on-trip
            (Hotels booked per itinerary cancelled and new hotels booked) will
            entail a 100% cancellation fee.
          </p>
          <p>
            {" "}
            • Entertaining early check-in or late check-out requests is solely
            based on the discretion of the hotel. Tripbizz will not be able to
            process cancellation requests owing to non-availability of these
            requests.
          </p>
        </div>
        <div className="cancellation-sub-header">Activities</div>
        <div className="cancellation-sub-text">
          <p>
            {" "}
            • On cancelling activities marked as “Non-Refundable” on the final
            travel vouchers, the customer will be eligible for a zero refund.
          </p>
          <p>
            {" "}
            • For activities, which have been marked as “Refundable” on the
            final travel vouchers, refunds and their timelines will be
            applicable as mentioned under the “Cancellation Policy” section of
            the product and in the final itinerary.
          </p>
          <p>
            {" "}
            • The total refund for activities may include components which vary
            with international exchange rates.
          </p>
        </div>
        <div className="cancellation-sub-header">Transfers</div>
        <div className="cancellation-sub-text">
          <p>
            • For all transfers, refunds and their timelines will be applicable
            as mentioned under the “Cancellation Policy” section of the product
            and in the final itinerary.
          </p>
          <p>
            • The total refunds for transfers may include components which vary
            with international exchange rates.
          </p>
        </div>
        <div className="cancellation-sub-header">Visa & Insurance</div>
        <div className="cancellation-sub-text">
          Tripbizz acts as a facilitator for processing Visa applications. We
          will guide customers on Visa formalities & Visa documentation for
          specific destinations. The discretion to grant/reject Visa rests
          solely with the concerned embassy and Tripbizz will not be responsible
          for rejection of any applications. The visa fee is non-refundable in
          case of rejected visa applications. While we strive to provide a
          seamless Visa experience to the customers, Tripbizz will not be held
          responsible for unforeseen changes to Visa formalities levied by the
          embassy during the document submission and processing phase. Insurance
          once applied is subject to 100% cancellation fee and is
          non-refundable.
        </div>
      </div>
    </>
  );
};

export default CancellationPolicy;
