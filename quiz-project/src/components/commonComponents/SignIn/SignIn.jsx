import React, { useState } from 'react';
import './SignIn.css';

const SignIn = () => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="signin-container d-flex justify-content-center align-items-center">
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
          />
        </div>

        
        <button className="sign-in-btn btn btn-success w-100 rounded-pill mt-3">Sign in</button>

     
        <div className="d-flex justify-content-between mt-3">
          <a href="/register" className="text-muted">
            No account? <span className="highlighted"><strong>Create here</strong></span>
          </a>
          <a href="/forgot-password" className="text-muted highlighted"><strong>Forgot password?</strong></a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;