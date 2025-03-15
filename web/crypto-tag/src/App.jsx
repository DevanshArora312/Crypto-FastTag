import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/login'
// import Home from './components/home'

function App() {
  return (
    <>
      <Routes>
        <Route path={'/home'} element={<Home/>}/>
        <Route path={'/login'} element={<Login/>}/>
      </Routes>
    </>
  )
}

export default App
