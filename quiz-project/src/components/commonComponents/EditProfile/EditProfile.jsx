
import { Container, Form, Button } from 'react-bootstrap';
import { 
    getUserByID,
    updateUserAvatar,
    updateUserFirstName,
    updateUserLastName,
    updateCustomInfo 
} from '../../../services/user.service';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../appState/app.context';



const EditProfile = () => {
    const { userData, setAppState } = useContext(AppContext);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const {uid} = useParams();

    useEffect(() => {
        const loadUserData = async () => {
          if (userData) {
            try {
              const id = uid || userData.uid;
              const userDataFromDB = await getUserByID(id);
              setUserId(id);
              setAvatarUrl(userDataFromDB.avatarUrl || '');
              setFirstName(userDataFromDB.firstName || '');
              setLastName(userDataFromDB.lastName || '');
              setInfo(userDataFromDB.info || '');
              setRole(userDataFromDB.role || '');
            } catch (error) {
              console.error('Failed to load user data:', error);
            }
          }
          setLoading(false);
        };
  
        loadUserData();
      }, [userData]);

      const handleAvatarUrlChange = (e) => {
        setAvatarUrl(e.target.value);
      };
  
      const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
      };
  
      const handleLastNameChange = (e) => {
        setLastName(e.target.value);
      };
  
      const handleInfoChange = (e) => {
          setInfo(e.target.value);
        };
  
      const handleRoleChange = (e) => {
          setRole(e.target.value);
      }
  
  
      const saveChanges = async () => {
        try {
          if (userData) {
            await updateUserAvatar(userId, avatarUrl);
            await updateUserFirstName(userId, firstName);
            await updateUserLastName(userId, lastName);
            await updateCustomInfo(userId, info);
              console.log(role)
            await updateUserRole(userId, role);
            const updatedUserData = await getUserByID(userId);
            setAppState({ userData: updatedUserData });
  
            window.location.reload();
            alert('Profile updated successfully!');
          } else {
            alert('User not found or not logged in.');
          }
        } catch (error) {
          console.error('Failed to update profile:', error);
          alert('Failed to update profile.');
        }
      };
  
      if (loading) {
        return <div>Loading...</div>;
      }

  return (
    <Container className='edit-profile-wrapper'>
      <div className="edit-profile-container">
        <h2 className="mb-4">Edit Profile</h2>

        <Form>
          {/* Avatar URL Field */}
          <Form.Group controlId="formAvatarUrl" className="mb-3">
            <Form.Label>Avatar URL:</Form.Label>
            <Form.Control type="text" placeholder="Enter Avatar URL" value={avatarUrl} onChange={handleAvatarUrlChange} />
          </Form.Group>

          {/* First Name Field */}
          <Form.Group controlId="formFirstName" className="mb-3">
            <Form.Label>First Name:</Form.Label>
            <Form.Control type="text" placeholder="Enter First Name" value={firstName} onChange={handleFirstNameChange} />
          </Form.Group>

          {/* Last Name Field */}
          <Form.Group controlId="formLastName" className="mb-3">
            <Form.Label>Last Name:</Form.Label>
            <Form.Control type="text" placeholder="Enter Last Name" value={lastName} onChange={handleLastNameChange} />
          </Form.Group>

          {/* Custom Information Field */}
          <Form.Group controlId="formCustomInformation" className="mb-4">
            <Form.Label>Custom Information:</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter custom information" value={info} onChange={handleInfoChange}/>
          </Form.Group>

          {/* Save Button */}
          <Button variant="primary" type="submit" onClick={saveChanges}>
            Save Changes
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default EditProfile;