import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderBar from './components/commonComponents/HeaderBar/HeaderBar';
import Home from './components/commonComponents/Home/Home';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <Router>
      <HeaderBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      </Router>
    </>
  );
}

export default App;
