import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Home from './components/home'
import {Hero} from './components/hero'
import RCVerification from './components/add'
function App() {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<Hero/>}/>
        <Route path={'/home'} element={<Home/>}/>
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/add'} element={<RCVerification/>}/>
      </Routes>
    </>
  )
}

export default App
