import { Container, Form, Button } from 'react-bootstrap';
import { 
    getUserByID,
    updateUserAvatar,
    updateUserFirstName,
    updateUserLastName,
    updateCustomInfo,
    updatePhone
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
    const [phone, setPhone] = useState('');
    const [userId, setUserId] = useState('');
    const [phoneError, setPhoneError] = useState(''); // State to store error message
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
              setInfo(userDataFromDB.customInfo || '');
              setRole(userDataFromDB.role || '');
              setPhone(userDataFromDB.phone || '');
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

    const handlePhoneNumberChange = (e) => {
        const input = e.target.value;

        // Allow only digits and limit the length to 10 digits
        if (/^\d{0,10}$/.test(input)) {
            setPhone(input);
            setPhoneError(''); // Clear error if the input is valid
        } else {
            setPhoneError('Phone number must be exactly 10 digits');
        }
    };

    const handleInfoChange = (e) => {
        setInfo(e.target.value);
    };
  
    const saveChanges = async (e) => {
        e.preventDefault();
        
        // Validate phone number length
        if (phone.length !== 10) {
            setPhoneError('Phone number must be exactly 10 digits.');
            return;
        }

        try {
          if (userData) {
            await updateUserAvatar(userId, avatarUrl);
            await updateUserFirstName(userId, firstName);
            await updateUserLastName(userId, lastName);
            await updateCustomInfo(userId, info);
            await updatePhone(userId, phone);
            
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

                    {/* Phone Number Field */}
                    <Form.Group controlId="formPhoneNumber" className="mb-3">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Phone Number" 
                            value={phone} 
                            onChange={handlePhoneNumberChange} 
                        />
                        {phoneError && <div style={{ color: 'red' }}>{phoneError}</div>}
                    </Form.Group>

                    {/* Custom Information Field */}
                    <Form.Group controlId="formCustomInformation" className="mb-4">
                        <Form.Label>Custom Information:</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter custom information" value={info} onChange={handleInfoChange}/>
                    </Form.Group>

                    {/* Save Button */}
                    <Button variant="primary" type="button" onClick={saveChanges}>
                        Save Changes
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default EditProfile;