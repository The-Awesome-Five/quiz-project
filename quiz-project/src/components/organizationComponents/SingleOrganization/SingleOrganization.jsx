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
  const [participantInfo, setParticipantInfo] = useState({ role: '', username: '' });

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setParticipantInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddParticipant = async () => {
      const { role, username } = participantInfo;
      if (!username.trim() || !role) return;

      try {
          const id = Object.keys(await getUserDataByUsername(username));
          const updatedOrgInfo = { ...orgInfo };
          const roleMap = {
              '1': 'students',
              '2': 'educators',
              '3': 'owner'
          };
          const roleStr = roleMap[role];

          await updateOrganizationParticipants({ [id]: username }, roleStr, orgInfo.id);
          updatedOrgInfo[roleStr] = { ...updatedOrgInfo[roleStr], [id]: username };
          await updateOrganizationUserInfo(id, orgInfo.id, orgInfo.name, orgInfo.imgUrl, roleStr);
          
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
              const userRole = Object.keys(data).find(role => Object.keys(data[role]).includes(userData.uid));
              setUserInfoForOrg(userRole);
              const quizzes = await getAllOrganizationQuizzes(orgId);
              setOrgQuizzes(quizzes);
          } catch (err) {
              console.error("Error fetching organization:", err);
          }
      };

      fetchOrganization();
  }, [orgId]);

  const handleEditClick = (quiz) => {
      navigate(`/edit-quiz/${quiz.id}`, { state: { quizData: quiz } });
  };

  const handleReviewClick = (quiz) => {
      navigate(`/review-quiz/${quiz.id}`, { state: { quiz, orgInfo } });
  };

  const isVisible = (quiz) => {
      if (userInfoForOrg === 'student') {
          return quiz.isInvites && (quiz.inviteList && Object.keys(quiz.inviteList).includes(userData.uid));
      }
      return true;
  };

  if (!orgInfo || !userData) {
      return <div>Loading...</div>;
  }

  return (
      <div className="container my-4">
          <div>Participants</div>
          {!orgInfo.students || !Object.keys(orgInfo.students).includes(userData.uid) ? (
              <div className="input-group mb-2">
                  <select className="custom-select" name="role" value={participantInfo.role} onChange={handleInputChange}>
                      <option value="" disabled>Choose...</option>
                      <option value="1">Student</option>
                      <option value="2">Educator</option>
                      <option value="3">Owner</option>
                  </select>
                  <input type="text" className="form-control" placeholder="Please enter a username" name="username" value={participantInfo.username} onChange={handleInputChange} />
                  <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="button" onClick={handleAddParticipant}>Add Participant</button>
                  </div>
              </div>
          ) : null}

          <div className="p-4 rounded-3 shadow bg-light scrollable-container">
              {orgInfo.owner && Object.entries(orgInfo.owner).map(([id, name]) => (
                  <div key={id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <Link to={`/profile/${id}`} className="mb-0">{name}</Link>
                      <h5 className="mb-0 text-muted">Owner</h5>
                      {userData.uid === id && <Button variant="danger" onClick={() => leaveOrganization(orgInfo.id, userData.uid, 'owner')}>Leave</Button>}
                  </div>
              ))}
              {orgInfo.educators && Object.entries(orgInfo.educators).map(([id, name]) => (
                  <div key={id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <Link to={`/profile/${id}`} className="mb-0">{name}</Link>
                      <h5 className="mb-0 text-muted">Educator</h5>
                      {userData.uid === id ? (
                          <Button variant="danger" onClick={() => leaveOrganization(orgInfo.id, userData.uid, 'educators')}>Leave</Button>
                      ) : (
                          <Button variant="danger" onClick={() => removeFromOrg(orgInfo.id, id, 'educators')}>Remove</Button>
                      )}
                  </div>
              ))}
              {orgInfo.students && Object.entries(orgInfo.students).map(([id, name]) => (
                  <div key={id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <Link to={`/profile/${id}`} className="mb-0">{name}</Link>
                      <h5 className="mb-0 text-muted">Student</h5>
                      {userData.uid === id ? (
                          <Button variant="danger" onClick={() => leaveOrganization(orgInfo.id, userData.uid, 'students')}>Leave</Button>
                      ) : (
                          <Button variant="danger" onClick={() => removeFromOrg(orgInfo.id, id, 'students')}>Remove</Button>
                      )}
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
                          showInvites ? (
                              <>
                                  <h3>Invited Quizzes</h3>
                                  {orgQuizzes.filter(quizObj => {
                                      const quiz = quizObj[Object.keys(quizObj)[1]];
                                      return quiz.isInvites === true && isVisible(quiz);
                                  }).map((quizObj, index) => {
                                      const quizKey = Object.keys(quizObj)[1];
                                      const quiz = quizObj[quizKey];
                                      return (
                                          <div key={index} className="col-md-4 mb-3">
                                              <div className="quiz-box d-flex flex-column align-items-center justify-content-center" style={{ width: "250px", height: "250px", border: "2px solid black", cursor: "pointer" }}>
                                                  <img src={quiz.avatar || "https://img.freepik.com/premium-vector/quiz-logo-with-speech-bubble-icon_149152-811.jpg"} alt={`${quiz.name} logo`} style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                                                  <p className="mt-2 text-center">{quiz.name}</p>
                                                  <div>
                                                      <button onClick={() => navigate(`/quizzes/${quizObj[0]}`, { state: { path: `/quizzes/${quizObj[0]}` } })}>Start Quiz</button>
                                                      {(userData.organizations[orgId].role === "educator" || userData.organizations[orgId].role === "owner") && (
                                                          <>
                                                              <button onClick={() => handleEditClick(quiz)}>Edit</button>
                                                              <button onClick={() => handleReviewClick(quiz)}>Review Submissions</button>
                                                          </>
                                                      )}
                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </>
                          ) : (
                              <>
                                  <h3>Available Quizzes</h3>
                                  {orgQuizzes.filter(quizObj => {
                                      const quiz = quizObj[Object.keys(quizObj)[1]];
                                      return quiz.isInvites === false || quiz.isInvites === undefined && isVisible(quiz);
                                  }).map((quizObj, index) => {
                                      const quizKey = Object.keys(quizObj)[1];
                                      const quiz = quizObj[quizKey];
                                      return (
                                          <div key={index} className="col-md-4 mb-3">
                                              <div className="quiz-box d-flex flex-column align-items-center justify-content-center" style={{ width: "250px", height: "250px", border: "2px solid black", cursor: "pointer" }}>
                                                  <img src={quiz.avatar || "https://img.freepik.com/premium-vector/quiz-logo-with-speech-bubble-icon_149152-811.jpg"} alt={`${quiz.name} logo`} style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                                                  <p className="mt-2 text-center">{quiz.name}</p>
                                                  <div>
                                                      <button onClick={() => navigate(`/quizzes/${quizObj[0]}`, { state: { path: `/quizzes/${quizObj[0]}` } })}>Start Quiz</button>
                                                      {(userData.organizations[orgId].role === "educator" || userData.organizations[orgId].role === "owner") && (
                                                          <>
                                                              <button onClick={() => handleEditClick(quiz)}>Edit</button>
                                                              <button onClick={() => handleReviewClick(quiz)}>Review Submissions</button>
                                                          </>
                                                      )}
                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </>
                          )
                      ) : (
                          <div>No Quizzes Have been made yet</div>
                      )}
                  </div>
              </div>
              <span className="quiz-box d-flex align-items-center justify-content-center" style={{ width: "150px", height: "150px", border: "2px solid black", fontSize: "50px", cursor: "pointer" }} onClick={() => navigate('/create-quiz')}>+</span>
          </div>
      </div>
  );
};

export default SingleOrganization;