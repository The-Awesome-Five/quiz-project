import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../appState/app.context';
import { createUserID, getUserDataByEmail } from '../services/user.service';
import { registerUser } from '../services/auth.service';
import { toast } from "react-toastify";
import { getUserDataByUsername } from '../services/user.service';

const Register = () => {
  const [user, setUser] = useState({
    username: '',
    firstName: '',
    lastName: '',
    avatarUrl: '',
    email: '',
    password: '',
    role: '',
  });
  const [step, setStep] = useState(0);
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const updateUser = (prop) => (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [prop]: e.target.value,
    }));
  };

  const selectRole = (role) => () => {
    setUser((prevUser) => ({
      ...prevUser,
      role: role,
    }));
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const register = async () => {
    console.log(user);  
    const { username, firstName, lastName, email, password, avatarUrl, role } = user;
    console.log('function tirggered')

    if (firstName.length < 1 || firstName.length > 30) {
      return toast.error('First name must be between 4 and 32 characters!');
    }

    if (lastName.length < 1 || lastName.length > 30) {
      return toast.error('Last name must be between 4 and 32 characters!');
    }
    console.log('UserDataTaken');
    try {
      const userFromDB = await getUserDataByUsername(username);
      console.log('UserDataTaken');
      if (userFromDB) {
        return toast.error(`User {${username}} already exists!`);
      }

      const emailInUse = await getUserDataByEmail(email);
      console.log('UserEmailData');
      if (emailInUse) {
        return toast.error(`Email {${email}} is already in use!`);
      }

      console.log('We are about to register')
      const credential = await registerUser(email, password);

      await createUserID(username, firstName, lastName, credential.user.uid, email, avatarUrl, role);
      setAppState({ user: credential.user, userData: credential.user.uid });
      toast.success(`User ${username} has been registered!`);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="card text-center" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">Select Your Role</h5>
              <div className="d-flex justify-content-around mb-3">
                <button 
                  className={`btn btn-outline-primary ${user.role === 'Educator' ? 'active' : ''}`} 
                  onClick={selectRole('Educator')}
                >
                  Educator
                </button>
                <button 
                  className={`btn btn-outline-primary ${user.role === 'Student' ? 'active' : ''}`} 
                  onClick={selectRole('Student')}
                >
                  Student
                </button>
              </div>
              <button 
                onClick={nextStep} 
                className="btn btn-primary" 
                disabled={!user.role}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="card text-center" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">Please Enter Username</h5>
              <input
                type="text"
                placeholder="Username"
                value={user.username}
                onChange={updateUser('username')}
              />
              <button onClick={nextStep} className="btn btn-primary" disabled={!user.username}>
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="card text-center" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">Please Enter Your First And Last Name</h5>
              <input
                type="text"
                placeholder="First Name"
                value={user.firstName}
                onChange={updateUser('firstName')}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={user.lastName}
                onChange={updateUser('lastName')}
              />
              <button onClick={prevStep} className="btn btn-primary">Back</button>
              <button onClick={nextStep} className="btn btn-primary" disabled={!user.firstName || !user.lastName}>
                Next
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="card text-center" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">Please Enter Your Email</h5>
              <input
                type="text"
                placeholder="Email"
                value={user.email}
                onChange={updateUser('email')}
              />
              <button onClick={prevStep} className="btn btn-primary">Back</button>
              <button onClick={nextStep} className="btn btn-primary" disabled={!user.email}>
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="card text-center" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">Please Enter Your Password</h5>
              <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={updateUser('password')}
              />
              <button onClick={prevStep} className="btn btn-primary">Back</button>
              <button onClick={nextStep} className="btn btn-primary" disabled={!user.password || user.password.length < 6}>
                Next
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="card text-center" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">Please Paste An URL To Your Avatar</h5>
              <input
                type="text"
                placeholder="Avatar URL"
                value={user.avatarUrl}
                onChange={updateUser('avatarUrl')}
              />
              <button onClick={prevStep} className="btn btn-primary">Back</button>
              <button onClick={register} className="btn btn-primary">
                Register
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="reg-container">
      <h2>Register</h2>
      {renderStep()}
    </div>
  );
}

export default Register;