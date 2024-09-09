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
    <div className="single-org-container custom-container my-4">
      <h2 className="org-title"> ORGANIZATION PARTICIPANTS </h2>
  
      {!orgInfo.students || !Object.keys(orgInfo.students).includes(userData.uid) ? (
        <div className="input-group mb-4 add-participant-form">
          <select
            className="custom-select participant-role-select"
            id="inputGroupSelect01"
            name="role"
            value={participantInfo.role}
            onChange={handleInputChange}
          >
            <option value="" disabled>Choose Role...</option>
            <option value="1">Student</option>
            <option value="2">Educator</option>
            <option value="3">Owner</option>
          </select>
          <input
            type="text"
            className="form-control participant-input"
            placeholder="Enter username"
            name="username"
            value={participantInfo.username}
            onChange={handleInputChange}
          />
          <div className="input-group-append">
            <button
              className="btn-success add-participant-btn"
              type="button"
              onClick={handleAddParticipant}
            >
              Add
            </button>
          </div>
        </div>
      ) : null}
  
  <div className="participants-list p-4 rounded-3 shadow-sm" style={{ backgroundColor: "#fff6e3" }}>
  {orgInfo.owner && Object.entries(orgInfo.owner).map(([id, name]) => (
    <div key={id} className="participant-item owner-item">
      <Link to={`/profile/${id}`} className="participant-name">{name}</Link>
      <span className="participant-role owner-role">Owner</span>
    </div>
  ))}
  {orgInfo.educators && Object.entries(orgInfo.educators).map(([id, name]) => (
    <div key={id} className="participant-item educator-item">
      <Link to={`/profile/${id}`} className="participant-name">{name}</Link>
      <span className="participant-role educator-role">Educator</span>
      {userInfoForOrg === 'owner' && (
        <button className="btn btn-outline-danger remove-btn" onClick={() => removeFromOrg(orgInfo.id, id, 'educators')}>
          <i className="fas fa-trash-alt"></i> Remove
        </button>
      )}
    </div>
  ))}
  {orgInfo.students && Object.entries(orgInfo.students).map(([id, name]) => (
    <div key={id} className="participant-item student-item">
      <Link to={`/profile/${id}`} className="participant-name">{name}</Link>
      <span className="participant-role student-role">Student</span>
      {userInfoForOrg === 'owner' && (
        <button className="btn btn-outline-danger remove-btn" onClick={() => removeFromOrg(orgInfo.id, id, 'students')}>
          <i className="fas fa-trash-alt"></i> Remove
        </button>
      )}
    </div>
  ))}

  {/* Бутон за напускане на организацията, ако потребителят не е собственик */}
  {userInfoForOrg !== 'owner' && (
    <div className="leave-org-container">
      <button
        className="btn btn-warning leave-org-btn"
        onClick={() => leaveOrganization(orgInfo.id, userData.uid, userInfoForOrg)}
      >
        <i className="fas fa-sign-out-alt"></i> Leave Organization
      </button>
    </div>
  )}
</div>
  
      <div className="quizzes-container">
  <div className="quiz-toggle-buttons">
    <button className={`btn-success ${!showInvites ? 'active' : ''}`} onClick={() => setShowInvites(false)}>
      Available Quizzes
    </button>
    <button className={`btn-success ${showInvites ? 'active' : ''}`} onClick={() => setShowInvites(true)}>
      Invited Quizzes
    </button>
  </div>

  {/* Ensure that the grid displays both available and invited quizzes properly */}
<div className="quizzes-grid">
  {orgQuizzes ? (
    showInvites ? (
      <>
        <h3>Invited Quizzes</h3>
        {orgQuizzes
          .filter((quizObj) => quizObj[Object.keys(quizObj)[1]].isInvites)
          .map((quizObj, index) => {
            const quiz = quizObj[Object.keys(quizObj)[1]];
            const quizId = quizObj[0];
            const isInvited = quiz.inviteList && Object.keys(quiz.inviteList).includes(userData.uid);
            const canEdit = userInfoForOrg === 'educator' || userInfoForOrg === 'owner';

            if (isInvited || canEdit) {
              return (
                <div key={quizId} className="quiz-box">
                  <img src={quiz.avatar} alt={quiz.name} className="quiz-img" />
                  <p className="quiz-name">{quiz.name}</p>
                  <div className="quiz-actions">
                    <button className="btn-success btn-quiz" onClick={() => navigate(`/quizzes/${quizId}`)}>
                      Start Quiz
                    </button>
                    {canEdit && (
                      <>
                        <button className="btn-success btn-quiz" onClick={() => handleEditClick(quiz)}>
                          Edit
                        </button>
                        <button className="btn-success btn-quiz mt-1" onClick={() => handleReviewClick(quiz, orgInfo)}>
                          Review Submissions
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}
      </>
    ) : (
      <>
        {orgQuizzes
          .filter((quizObj) => !quizObj[Object.keys(quizObj)[1]].isInvites)
          .map((quizObj, index) => {
            const quiz = quizObj[Object.keys(quizObj)[1]];
            const quizId = quizObj[0];
            const canEdit = userInfoForOrg === 'educator' || userInfoForOrg === 'owner';

            return (
              <div key={quizId} className="quiz-box">
                <img src={quiz.avatar} alt={quiz.name} className="quiz-img" />
                <p className="quiz-name">{quiz.name}</p>
                <div className="quiz-actions">
                  <button className="btn-success btn-quiz me-1" onClick={() => navigate(`/quizzes/${quizId}`)}>
                    Start Quiz
                  </button>
                  {canEdit && (
                    <>
                      <button className="btn-success btn-quiz" onClick={() => handleEditClick(quiz)}>
                        Edit
                      </button>
                      <button className="btn-success btn-quiz mt-1" onClick={() => handleReviewClick(quiz, orgInfo)}>
                        Review Submissions
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </>
    )
  ) : (
    <div className="no-quizzes">No Quizzes Available</div>
  )}
</div>


  {/* The create quiz box */}
  <div className="create-quiz-box" onClick={() => navigate('/create-quiz')}>+</div>
</div>
    </div>
  );
  
};

export default SingleOrganization;