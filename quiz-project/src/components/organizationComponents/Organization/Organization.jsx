import { useContext } from "react";
import { AppContext } from "../../../appState/app.context";
import { useNavigate } from "react-router-dom";

const Organization = () => {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    // Prepare the organization list
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
                    <h2>Your Organizations</h2>
                ) : (
                    <h2>You Have No Organizations Yet</h2>
                )}
            </div>
            <div className="d-flex flex-wrap justify-content-around">
                {orgList.length > 0 ? (
                    <div>
                    {orgList.map((org, index) => (
                        <div
                            key={index}
                            className="organization-box d-flex flex-column align-items-center justify-content-center border m-3"
                            style={{
                                width: "150px",
                                height: "150px",
                                border: "2px solid black",
                            }}
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
                            <p className="mt-2 text-center">{org.orgName}</p>
                        </div>
                    ))}
                    <div
                    className="organization-box d-flex align-items-center justify-content-center border m-3"
                    style={{
                        width: "150px",
                        height: "150px",
                        border: "2px solid black",
                        fontSize: "50px",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/create-organization")}
                >
                    +
                </div>
                </div>
                ) : (
                    <div
                        className="organization-box d-flex align-items-center justify-content-center border m-3"
                        style={{
                            width: "150px",
                            height: "150px",
                            border: "2px solid black",
                            fontSize: "50px",
                            cursor: "pointer",
                        }}
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