import { useContext, useEffect, useState } from "react";
import { getSingleOrganization, updateOrganizationParticipants } from "../../../services/organization.service";
import { AppContext } from "../../../appState/app.context";
import "./SingleOrganization.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserDataByUsername, updateOrganizationUserInfo } from "../../../services/user.service";
const SingleOrganization = ({ orgId }) => {
    const [orgInfo, setOrgInfo] = useState(null);  
    const { userData } = useContext(AppContext);

    const [participantInfo, setParticipantInfo] = useState({
        role: '',
        username: ''
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setParticipantInfo({
            ...participantInfo,
            [name]: value
        });
    };

    const handleAddParticipant = async () => {
        const { role, username } = participantInfo;
        if (!username.trim() || !role) return;
    
        try {
            const id = Object.keys(await getUserDataByUsername(username));
            const updatedOrgInfo = { ...orgInfo };
            if (role === '1') {
                await updateOrganizationParticipants({ [id]: username }, 'students', orgInfo.id);
                updatedOrgInfo.students = { ...updatedOrgInfo.students, [id]: username };
            } else if (role === '2') {
                await updateOrganizationParticipants({ [id]: username }, 'educators', orgInfo.id);
                updatedOrgInfo.educators = { ...updatedOrgInfo.educators, [id]: username };
            } else if (role === '3') {
                await updateOrganizationParticipants({ [id]: username }, 'owner', orgInfo.id);
                updatedOrgInfo.owner = { ...updatedOrgInfo.owner, [id]: username };
            }
            await updateOrganizationUserInfo(id, orgInfo.id, orgInfo.name, orgInfo.imgUrl);
            setOrgInfo(updatedOrgInfo);
            setParticipantInfo({ role: '', username: '' });
    
        } catch (error) {
            console.error("Error adding participant:", error);
        }
    };
    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const data = await getSingleOrganization(orgId);
                setOrgInfo(data);
            } catch (err) {
                console.error("Error fetching organization:", err);
            }
        };

        fetchOrganization();
    }, [orgId]);


    if (!orgInfo) {
        return <div>Loading...</div>; 
    }

 
        return (
            <div className="container my-4">
                  <div> Participants</div>
                  {orgInfo.students && Object.keys(orgInfo.students).includes(userData.uid)? <></>: 
                              <div className="input-group mb-2">
                              <select 
                                      className="custom-select" 
                                      id="inputGroupSelect01" 
                                      name="role"
                                      value={participantInfo.role}
                                      onChange={handleInputChange}
                                  >
                                      <option value="" disabled>Choose...</option>
                                      <option value="1">Student</option>
                                      <option value="2">Educator</option>
                                      <option value="3">Owner</option>
                                  </select>
                                  <input 
                                      type="text" 
                                      className="form-control" 
                                      placeholder="Please enter a username" 
                                      name="username"
                                      value={participantInfo.username}
                                      onChange={handleInputChange}
                                  />
                                  <div className="input-group-append">
                                      <button 
                                          className="btn btn-outline-secondary" 
                                          type="button" 
                                          onClick={handleAddParticipant}
                                      >
                                          Add Participant
                                      </button>
                                  </div>
                              </div>}

            <div className="p-4 rounded-3 shadow bg-light scrollable-container">
                {orgInfo.owner && Object.values(orgInfo.owner).map((name, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <h3 className="mb-0">{name}</h3>
                        <h5 className="mb-0 text-muted">Owner</h5>
                    </div>
                ))}
                {orgInfo.educators && Object.values(orgInfo.educators).map((name, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <h3 className="mb-0">{name}</h3>
                        <h5 className="mb-0 text-muted">Educator</h5>
                    </div>
                ))}
                {orgInfo.students && Object.values(orgInfo.students).map((name, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center py-2">
                        <h3 className="mb-0">{name}</h3>
                        <h5 className="mb-0 text-muted">Student</h5>
                    </div>
                ))}
            </div>
            <div className="p-4 rounded-3 shadow bg-light scrollable-container">
                {orgInfo.quizzesId ? <div>{Object.entries(orgInfo.quizzesId).map(([quizId, quiz], index) => (
                <div
                key={index}
                className="quiz-box d-flex flex-column align-items-center justify-content-center border m-3"
                style={{
                    width: "150px",
                    height: "150px",
                    border: "2px solid black",
                    cursor: "pointer",
                }}
                onClick={() => console.log(`Quiz selected: ${quizId}`)}
            >
                <img
                    src={quiz.quizAvatar}
                    alt={`${quiz.name} logo`}
                    style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                    }}
                />
                <p className="mt-2 text-center">{quiz.name}</p>
            </div>
            ))}</div> : <div> No Quizzes Have been made yet</div>}
             <div
                className="quiz-box d-flex align-items-center justify-content-center border m-3"
                style={{
                    width: "150px",
                    height: "150px",
                    border: "2px solid black",
                    fontSize: "50px",
                    cursor: "pointer",
                }}
                onClick={() => console.log('Navigate to create new quiz')} // TO BE IMPLEMENTED 
            >
                +
            </div>
            </div>
        </div>
        );

};

export default SingleOrganization;