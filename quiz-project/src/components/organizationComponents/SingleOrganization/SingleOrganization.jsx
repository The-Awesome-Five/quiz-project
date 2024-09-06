import React, { useContext, useEffect, useState } from "react";
import { getAllOrganizationQuizzes, getSingleOrganization, leaveOrganizationUser, updateOrganizationParticipants } from "../../../services/organization.service";
import { AppContext } from "../../../appState/app.context";
import "./SingleOrganization.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserDataByUsername, updateOrganizationUserInfo } from "../../../services/user.service";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
const SingleOrganization = ({ orgId }) => {
  const [orgInfo, setOrgInfo] = useState(null);  
  const [orgQuizzes, setOrgQuizzes] = useState(null);
  const { userData, setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const [showInvites, setShowInvites] = useState(false);
  const [userInfoForOrg, setUserInfoForOrg] = useState('');
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

  const leaveOrganization = async (orgId, uid, role) => {
      const pathForUser = `users/${uid}/organizations/${orgId}`;
      const pathForOrg = `organizations/${orgId}/${role}/${uid}`;
      await leaveOrganizationUser(pathForUser, pathForOrg);

      const updatedUserData = { ...userData };
      if (updatedUserData.organizations && updatedUserData.organizations[orgId]) {
          delete updatedUserData.organizations[orgId];
      }
      setAppState((prevState) => ({
          ...prevState,
          userData: updatedUserData,
      }));
      navigate('/');
  };

  const removeFromOrg = async (orgId, uid, role) => {
      const pathForUser = `users/${uid}/organizations/${orgId}`;
      const pathForOrg = `organizations/${orgId}/${role}/${uid}`;
      await leaveOrganizationUser(pathForUser, pathForOrg);

      const updatedOrgInfo = { ...orgInfo };
      delete updatedOrgInfo[role][uid];
      setOrgInfo(updatedOrgInfo);
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
              await updateOrganizationUserInfo(id, orgInfo.id, orgInfo.name, orgInfo.imgUrl, 'student');
          } else if (role === '2') {
              await updateOrganizationParticipants({ [id]: username }, 'educators', orgInfo.id);
              updatedOrgInfo.educators = { ...updatedOrgInfo.educators, [id]: username };
              await updateOrganizationUserInfo(id, orgInfo.id, orgInfo.name, orgInfo.imgUrl, 'educator');
          } else if (role === '3') {
              await updateOrganizationParticipants({ [id]: username }, 'owner', orgInfo.id);
              updatedOrgInfo.owner = { ...updatedOrgInfo.owner, [id]: username };
              await updateOrganizationUserInfo(id, orgInfo.id, orgInfo.name, orgInfo.imgUrl, 'owner');
          }

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
              if(userData){
              if (data?.owner && Object.keys(data?.owner).includes(userData?.uid)) {
                  setUserInfoForOrg('owner');
              }
              if (data?.students && Object.keys(data?.students).includes(userData?.uid)) {
                  setUserInfoForOrg('student');
              }
              if (data?.educators && Object.keys(data?.educators).includes(userData?.uid)) {
                  setUserInfoForOrg('educators');
              }
            }
              const quizzes = await getAllOrganizationQuizzes(orgId);
              setOrgQuizzes(quizzes);
          } catch (err) {
              console.error("Error fetching organization:", err);
          }
      };

      fetchOrganization();
  }, [orgId,userData]);

  const handleEditClick = (quiz) => {
      navigate(`/edit-quiz/${quiz.id}`, { state: { quizData: quiz } });
  };

  const handleReviewClick = (quiz, orgInfo) => {
      navigate(`/review-quiz/${quiz.id}`, { state: { quiz: quiz, orgInfo: orgInfo } });
  };

  if (!orgInfo || !userData) {
      return <div>Loading...</div>;
  }

  return (
      <div className="container my-4">
          <div>Participants</div>
          {orgInfo.students && Object.keys(orgInfo.students).includes(userData.uid) ? null :
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
              </div>
          }

          <div className="p-4 rounded-3 shadow bg-light scrollable-container">
              {orgInfo.owner && Object.entries(orgInfo.owner).map(([id, name], index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <Link to={`/profile/${id}`} className="mb-0">{name}</Link>
                      <h5 className="mb-0 text-muted">Owner</h5>
                      {userData.uid === id && <></>}
                  </div>
              ))}
              {orgInfo.educators && Object.entries(orgInfo.educators).map(([id, name], index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <Link to={`/profile/${id}`} className="mb-0">{name}</Link>
                      <h5 className="mb-0 text-muted">Educator</h5>
                      {userData.uid === id ? <Button variant="danger" onClick={() => leaveOrganization(orgInfo.id, userData.uid, 'educators')}>Leave</Button> : null}
                      {userInfoForOrg === 'owner' && <Button variant="danger" onClick={() => removeFromOrg(orgInfo.id, id, 'educators')}>Remove</Button>}
                  </div>
              ))}
              {orgInfo.students && Object.entries(orgInfo.students).map(([id, name], index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center py-2">
                      <Link to={`/profile/${id}`} className="mb-0">{name}</Link>
                      <h5 className="mb-0 text-muted">Student</h5>
                      {userData.uid === id ? <Button variant="danger" onClick={() => leaveOrganization(orgInfo.id, userData.uid, 'students')}>Leave</Button> : null}
                      {userInfoForOrg === 'owner' && <Button variant="danger" onClick={() => removeFromOrg(orgInfo.id, id, 'students')}>Remove</Button>}
                  </div>
              ))}
          </div>
          <div className="quiz-container d-flex flex-wrap justify-content-start scrollable-container" style={{ gap: "20px" }}>
              <div>
                  <div className="button-group">
                      <button onClick={() => setShowInvites(false)}>Show Available Quizzes</button>
                      <button onClick={() => setShowInvites(true)}>Show Invited Quizzes</button>
                  </div>
                  <div className="row">
    {orgQuizzes ? (
        <>
            {showInvites ? (
                <div>
                    <h3>Invited Quizzes</h3>
                    {orgQuizzes
                        .filter((quizObj) => quizObj[Object.keys(quizObj)[1]].isInvites)
                        .map((quizObj, index) => {
                            const quizKey = Object.keys(quizObj)[1];
                            const quiz = quizObj[quizKey];
                            // Show quiz if user is invited or if user is an educator or owner
                            if ((quizObj[1].inviteList && Object.keys(quizObj[1].inviteList).includes(userData.uid)) ||
                                userInfoForOrg === 'educator' || userInfoForOrg === 'owner') {
                                return (
                                    <div key={index} className="col-md-4 mb-3">
                                        <div className="quiz-box d-flex flex-column align-items-center justify-content-center"
                                            style={{ width: "250px", height: "250px", border: "2px solid black", cursor: "pointer" }}>
                                            <img
                                                src={quiz.avatar && quiz.avatar.includes("http") ? quiz.avatar : "https://img.freepik.com/premium-vector/quiz-logo-with-speech-bubble-icon_149152-811.jpg"}
                                                alt={`${quiz.name} logo`}
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                            <p className="mt-2 text-center">{quiz.name}</p>
                                            <div>
                                                {(quizObj[1].inviteList && Object.keys(quizObj[1].inviteList).includes(userData.uid)) || userInfoForOrg === 'educator' || userInfoForOrg === 'owner' ?
                                                    <button onClick={() => navigate(`/quizzes/${quizObj[0]}`, { state: { path: `/quizzes/${quizObj[0]}` } })}>
                                                        Start Quiz
                                                    </button> : null}
                                                {(userData.organizations[orgId].role === "educator" || userData.organizations[orgId].role === "owner") && (
                                                    <>
                                                        <button onClick={() => handleEditClick(quiz)}>Edit</button>
                                                        <button onClick={() => handleReviewClick(quiz, orgInfo)}>Review Submissions</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                </div>
            ) : (
                <div>
                    <h3>Available Quizzes</h3>
                    {orgQuizzes
                        .filter((quizObj) => !quizObj[Object.keys(quizObj)[1]].isInvites)
                        .map((quizObj, index) => {
                            const quizKey = Object.keys(quizObj)[1];
                            const quiz = quizObj[quizKey];

                            return (
                                <div key={index} className="quiz-box d-flex flex-column align-items-center justify-content-center"
                                    style={{ width: "250px", height: "250px", border: "2px solid black", cursor: "pointer" }}>
                                    <img
                                        src={quiz.avatar && quiz.avatar.includes("http") ? quiz.avatar : "https://img.freepik.com/premium-vector/quiz-logo-with-speech-bubble-icon_149152-811.jpg"}
                                        alt={`${quiz.name} logo`}
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                    <p className="mt-2 text-center">{quiz.name}</p>
                                    <div>
                                        <button onClick={() => navigate(`/quizzes/${quizObj[0]}`, { state: { path: `/quizzes/${quizObj[0]}` } })}>
                                            Start Quiz
                                        </button>
                                        {(userData.organizations[orgId].role === "educator" || userData.organizations[orgId].role === "owner") && (
                                            <>
                                                <button onClick={() => handleEditClick(quiz)}>Edit</button>
                                                <button onClick={() => handleReviewClick(quiz, orgInfo)}>Review Submissions</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </>
    ) : (
        <div>No Quizzes Have been made yet</div>
    )}
</div>
              </div>
              <span
                  className="quiz-box d-flex align-items-center justify-content-center"
                  style={{ width: "150px", height: "150px", border: "2px solid black", fontSize: "50px", cursor: "pointer" }}
                  onClick={() => navigate('/create-quiz')}
              >
                  +
              </span>
          </div>
      </div>
  );
};

export default SingleOrganization;