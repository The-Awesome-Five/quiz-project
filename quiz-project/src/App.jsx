import {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderBar from './components/commonComponents/HeaderBar/HeaderBar';
import Home from './components/commonComponents/Home/Home';
import SignIn from './components/commonComponents/SignIn/SignIn';
import {AdminMenuView} from "./views/AdminMenu/AdminMenuView/AdminMenuView.jsx";
import Register from './auth/Register.jsx';
import './App.css';


function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const buttons = document.querySelectorAll("button");

    buttons.forEach(button => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        if (!button.classList.contains("animate")) {
          button.classList.add("animate");
          setTimeout(() => {
            button.classList.remove("animate");
          }, 800);
        }
      });
    });
  }, []);

  return (
    <>
    <Router>
      <HeaderBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/signin' element={<SignIn/>} />

          <Route path='/admin' element={<AdminMenuView />} />
          <Route path='/register' element={<Register></Register>} />
        </Routes>
      </div>
      </Router>
    </>
  );
}

export default App;
