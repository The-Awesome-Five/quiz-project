import { useContext } from "react";
import { AppContext } from "../../../appState/app.context";
import { useNavigate } from "react-router-dom";
import React from "react";
import './Organization.css'

const Organization = () => {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    const orgList = userData?.organizations
        ? Object.keys(userData.organizations).map((orgId) => ({
              orgId: userData.organizations[orgId].organizationID,
              orgName: userData.organizations[orgId].organizationName,
              photoUrl: userData.organizations[orgId].organizationImage,
          }))
        : [];

    return (
        <div>
  <div className="organizations-title">
    {orgList.length > 0 ? (
      <h2 className=" text-center mt-3">YOUR ORGANIZATION</h2>
    ) : (
      <h2>You Have No Organizations Yet</h2>
    )}
  </div>
  <div className="d-flex flex-wrap justify-content-around">
    {orgList.length > 0 ? (
      <div className="d-flex flex-row">
        {orgList.map((org, index) => (
          <div
            key={index}
            className="organization-box d-flex flex-column align-items-center justify-content-center m-3"
            style={{ width: "150px", height: "150px" }}
            onClick={() => navigate(`/organization/${org.orgId}`)}
          >
            <img
              src={org.photoUrl}
              alt={`${org.orgName} logo`}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
              }}
            />
            <p className="mt-2 text-flex">{org.orgName}</p>
          </div>
        ))}
        <div
          className="create-org-box m-3"
          style={{ width: "150px", height: "150px" }}
          onClick={() => navigate("/create-organization")}
        >
          +
        </div>
      </div>
    ) : (
      <div
        className="create-org-box m-3"
        style={{ width: "150px", height: "150px" }}
        onClick={() => navigate("/create-organization")}
      >
        +
      </div>
    )}
  </div>
</div>
    );
};

export default Organization;
