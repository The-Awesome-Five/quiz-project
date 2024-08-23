import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import HeaderBar from './components/commonComponents/HeaderBar/HeaderBar';
import Home from './components/commonComponents/Home/Home';
import SignIn from './components/commonComponents/SignIn/SignIn';
import { AdminMenuView } from "./views/AdminMenu/AdminMenuView/AdminMenuView.jsx";
import Register from './auth/Register.jsx';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { ButtonEffectsProvider } from "./hoc/ButtonEffectsProvider.jsx";
import { getUserDataByUID } from './services/user.service.js';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config.js';
import { AppContext } from './appState/app.context.js';
import { ToastContainer } from 'react-toastify';
import { logoutUser } from './services/auth.service.js';
import {AdminUserMenuView} from "./views/AdminMenu/AdminUserMenu/AdminUserMenuView.jsx";
import Organization from './components/organizationComponents/Organization/Organization.jsx';
import CreateOrganization from './components/organizationComponents/CreateOrganizationForm/CreateOrganization.jsx';
import Profile from './components/commonComponents/Profile/Profile.jsx';
import EditProfile from './components/commonComponents/EditProfile/EditProfile.jsx';
import SingleOrganizationView from './views/SingleOrganizationView/SingleOranizationView.jsx';
import React from "react";
import CreateQuiz from './components/commonComponents/CreateQuiz/CreateQuiz.jsx';
import {
    AdminOrganisationView
} from "./views/AdminMenu/AdminOrganisationMenu/AdminOrganisationView/AdminOrganisationView.jsx";
import {AdminQuizMenuView} from "./views/AdminMenu/AdminQuizMenu/AdminQuizMenuView/AdminQuizMenuView.jsx";

function App() {
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    const [appState, setAppState] = useState({
        user: null,
        userData: null,
    });

    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (appState.user !== user) {
            setAppState(prevState => ({ ...prevState, user }));
        }
    }, [user, appState.user]);

    useEffect(() => {
        if (!user) return;

        getUserDataByUID(user.uid)
            .then(data => {
                const userData = data[Object.keys(data)[0]];
                setAppState(prevState => ({ ...prevState, userData }));
            });

    }, [user]);

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/signin');
    };

    return (
        <AppContext.Provider value={{ ...appState, setAppState }}>
            <ButtonEffectsProvider>
                <ToastContainer />
                <HeaderBar logout={logout} />
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signin" element={<SignIn />} />

                        <Route path="/admin" element={<AdminMenuView />} />
                        <Route path="/user-management" element={<AdminUserMenuView />} />
                        <Route path="/organization-management" element={<AdminOrganisationView />} />
                        <Route path="/quiz-management" element={<AdminQuizMenuView />} />


                        <Route path="/organizations" element={<Organization /> } />
                        <Route path="/create-organization" element={<CreateOrganization />} />
                        <Route path="/register" element={<Register />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/profile/:uid' element={<Profile />} />
                        <Route path='/edit-profile' element={<EditProfile />} />
                        <Route path="/organization/:organizationId" element={< SingleOrganizationView/>} />
                        <Route path='/create-quiz' element={<CreateQuiz/>} />
                    </Routes>
                </div>
            </ButtonEffectsProvider>
        </AppContext.Provider>
    );
}

export default App;
