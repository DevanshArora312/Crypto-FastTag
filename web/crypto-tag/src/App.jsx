import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Signup from './components/signup'
import Home from './components/home'
import {Hero} from './components/hero'
import RCVerification from './components/add'
import Fastag from './components/fastag'
function App() {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<Hero/>}/>
        <Route path={'/home'} element={<Home/>}/>
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/Signup'} element={<Signup/>}/>
        <Route path={'/add'} element={<RCVerification/>}/>
        <Route path={'/fastag'} element={<Fastag/>}/>
      </Routes>
    </>
  )
}

export default App
