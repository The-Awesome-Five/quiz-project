import React, { useContext, useState } from 'react';
import './SignIn.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../../../services/auth.service';
import { getUserByID } from '../../../services/user.service';
import { toast } from 'react-toastify';
import { AppContext } from '../../../appState/app.context.js';

const SignIn = () => {

  const [passwordShown, setPasswordShown] = useState(false);

  const [userLog, setUserLog] = useState({
    email: '',
    password: '',
  });
  const { user, userData, setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const updateUser = prop => e => {
    setUserLog({
      ...userLog,
      [prop]: e.target.value,
    })
  };


  const login = async () => {
    if (!userLog.email || !userLog.password) {
      return toast.error('No credentials provided!');
    }

    try {
      const credentials = await loginUser(userLog.email, userLog.password);
      const userInfo= await getUserByID(credentials.user.uid)
      setAppState({
        user: credentials.user,
        userData: userInfo,
      });
      toast.success(`You logged in successfully!`)

      navigate(location.state?.from.pathname ?? '/');
    } catch (error) {
      toast.error(error.message);
    }
  }
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    
    <div className="login-container">
    <div className="square d-flex justify-content-center align-items-center">
      <i style={{ "--clr": "#00ff0a" }}></i>
      <i style={{ "--clr": "#ff0057" }}></i>
      <i style={{ "--clr": "#fffd44" }}></i>
      <div className="signin-card p-4 mt-4">
        <h2 className="text-center">Sign in</h2>

        {/* Google Sign-In Button */}
        {/* <button className="btn google-btn w-100 mt-3 mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
            className="google-logo"
          />
          Continue with Google
        </button> */}

        {/* Divider */}
        {/* <p className="text-center">Or sign in with email</p> */}

        {/* Email Input */}
        <div className="form-group mb-3">
          <input
            type="email"
            className="form-control rounded-pill"
            placeholder="Email"
            value={userLog.email}
            onChange={updateUser('email')}
          />
        </div>

        {/* Password Input */}
        <div className="form-group mb-3">
          <div className="d-flex justify-content-between align-items-center">
          </div>
          <input
            type={passwordShown ? "text" : "password"}
            className="form-control rounded-pill"
            placeholder="Password"
            value={userLog.password}
            onChange={updateUser('password')}
          />
        </div>


        <button className="sign-in-btn btn btn-success w-100 rounded-pill mt-3" onClick={login}>Sign in</button>


        <div className="d-flex justify-content-between mt-3">
          <a href="/register" className="text-muted">
            No account? <span className="highlighted"><strong>Create here</strong></span>
          </a>
          <a href="/forgot-password" className="text-muted highlighted"><strong>Forgot password?</strong></a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignIn;
