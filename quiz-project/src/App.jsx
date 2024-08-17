import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderBar from './components/commonComponents/HeaderBar/HeaderBar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <HeaderBar/>
      <Routes>
          
      </Routes>
    </Router>
    </>
  )
}

export default App
