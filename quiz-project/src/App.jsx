import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderBar from './components/commonComponents/HeaderBar/HeaderBar';
import Home from './components/commonComponents/Home/Home';
import SignIn from './components/commonComponents/SignIn/SignIn';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <Router>
      <HeaderBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/signin' element={<SignIn/>} />
        </Routes>
      </div>
      </Router>
    </>
  );
}

export default App;
