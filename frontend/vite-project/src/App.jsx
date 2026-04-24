import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Signup from './pages/signup';
import Login from './pages/login';

function App() {




  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
  )
}

export default App

