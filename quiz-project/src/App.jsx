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
import {auth, db} from './firebase/config.js';
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
import {AllQuizzes} from "./views/AllQuizzes/AllQuizzes.jsx";
import {Quiz} from "./components/QuizComponents/Quiz.jsx";
import EditQuizForm from './components/QuizComponents/QuizEdit/QuizEdit.jsx';
import {
    AdminQuestionBankView
} from "./views/AdminMenu/AdminQuestionBankMenu/AdminQuestionBankView/AdminQuestionBankView.jsx";
import ReviewSubmissions from './components/organizationComponents/ReviewSubmissions/ReviewSubmissions.jsx';
import Shop from './components/commonComponents/Shop/Shop.jsx';
import {GamingModeView} from "./views/GamingModeView/GamingModeView.jsx";
import {Room} from "./components/gamingComponents/roomComponents/Room.jsx";
import AdminShopItem from './components/adminComponents/AdminShopManagement/AdminShopItem.jsx';
import NotificationPage from './components/commonComponents/Notifications/NotificationPage.jsx';
import MyQuizzes from './views/MyQuizzesView/MyQuizzes.jsx';
import AdminAccess from "./hoc/AdminAccess.jsx";
import EducatorAccess from "./hoc/EducatorAccess.jsx";
import {NotAuthorisedView} from "./views/NotAuthorisedView/NotAuthorisedView.jsx";
import {onValue, ref} from "firebase/database";
import {
    GameOverPage
} from "./components/gamingComponents/roomComponents/GameQuizPage/GameQuiz/GameOverPage/GameOverPage.jsx";
import ResultsPage from './components/QuizComponents/ResultsPage/Results.jsx';
import { RoomPvE } from './components/PvEMode/PvERoom/PvERoom.jsx';
import { DefeatScreen } from './components/PvEMode/ResultScreens/DefeatScreen/DefeatScreen.jsx';
import VictoryScreen from './components/PvEMode/ResultScreens/VictoryScreen/VisctoryScreen.jsx';
import Authenticated from "./hoc/Authenticated.jsx";
import Footer from "./components/commonComponents/Footer/Footer.jsx";
import {AboutPage} from "./components/commonComponents/About/AboutPage.jsx";
// import {TestAI} from "./views/TestAI.jsx";

function App() {
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

    useEffect(() => {

        if (appState.user) {
            const userRef = ref(db, `users/${user.uid}`);
            const unsubscribe = onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {

                    setAppState(prevState => ({ ...prevState, userData: data }));

                }
            });

            return () => unsubscribe();
        }
    }, [appState.user]);

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/signin');
    };

    return (
        <AppContext.Provider value={{ ...appState, setAppState }}>
            <ButtonEffectsProvider>
                <ToastContainer/>
                <HeaderBar logout={logout}/>
                <div>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/signin" element={<SignIn/>}/>


                        <Route path="/admin" element={<AdminAccess><AdminMenuView/></AdminAccess>}/>
                        <Route path="/user-management" element={<AdminAccess><AdminUserMenuView/></AdminAccess>}/>
                        <Route path="/organization-management"
                               element={<AdminAccess><AdminOrganisationView/></AdminAccess>}/>
                        <Route path="/quiz-management" element={<AdminAccess><AdminQuizMenuView/></AdminAccess>}/>
                        <Route path="/qbank-management" element={<AdminAccess><AdminQuestionBankView/></AdminAccess>}/>
                        <Route path='/shop-management' element={<AdminAccess><AdminShopItem/></AdminAccess>}/>


                        <Route path="/all-quizes" element={<AllQuizzes/>}/>
                        <Route path="/quizzes/:quizId" element={<Quiz/>}/>

                        <Route path='/gaming-modes' element={<GamingModeView/>}/>
                        <Route path={`/room/:roomId`} element={<Room/>}/>
                        <Route path="game-over" element={<GameOverPage/>}/>

                        <Route path={`/room-pve/:roomId`} element={<RoomPvE/>}/>
                        <Route path={'/defeat-screen'} element={<DefeatScreen/>}/>
                        <Route path={'/victory-screen'} element={<VictoryScreen/>}/>

                        <Route path={'/about'} element={<AboutPage/>}/>

                        <Route path={`/notifications`} element={<NotificationPage/>}/>
                        <Route path="/organizations" element={<Authenticated><Organization/> </Authenticated>}/>
                        <Route path="/create-organization"
                               element={<EducatorAccess><CreateOrganization/></EducatorAccess>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path='/profile' element={<Profile/>}/>
                        <Route path='/profile/:uid' element={<Profile/>}/>
                        <Route path='/edit-profile' element={<Authenticated><EditProfile/></Authenticated>}/>
                        <Route path="/organization/:organizationId" element={< SingleOrganizationView/>}/>
                        <Route path='/create-quiz' element={<EducatorAccess><CreateQuiz/></EducatorAccess>}/>
                        <Route path='/edit-quiz/:quizId' element={<EditQuizForm/>}/>
                        <Route path='/review-quiz/:quizId' element={<ReviewSubmissions/>}/>
                        <Route path='/shop' element={<Authenticated><Shop/></Authenticated>}/>
                        <Route path='/my-quizzes' element={<Authenticated><MyQuizzes/></Authenticated>}/>
                        <Route path="/not-authorised" element={<NotAuthorisedView/>}/>
                        <Route path='results-page' element={<ResultsPage/>}/>
                        {/* <Route path="/testAI" element={<TestAI />} /> */}
                    </Routes>
                </div>
                <br/>
                <br/>
                <br/>
                <Footer/>
            </ButtonEffectsProvider>
        </AppContext.Provider>
    );
}

export default App;
