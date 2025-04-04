import React from "react";

const TravDetails = ({ trav, index, type }) => {
  return (
    <div className="role-traveller-block">
      <div className="role-traveller-header">
        {type}-{index}
      </div>
      <div className="role-traveller-box">
        <div>
          Gender:<span>{trav.gender}</span>{" "}
        </div>
        <div>
          First Name:<span>{trav.firstName}</span>{" "}
        </div>
        <div>
          Last Name:<span>{trav.lastName}</span>{" "}
        </div>
        {index === 1 && (
          <>
            <div>
              Email:<span>{trav.email}</span>{" "}
            </div>
            <div>
              Mobile Number:<span>{trav.mobileNumber}</span>{" "}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TravDetails;
