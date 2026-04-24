import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Signup from './pages/signup';
import Login from './pages/login';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {




  return (
    <Routes>
      <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
      }/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
  )
}

export default App

