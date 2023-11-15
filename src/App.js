import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from "./Login"
import Chat from "./Chat"
import Register from './Register/register';

const App = () => {
  return (
    <div>
       <Router>
       
       <Routes>
       <Route exact path="/" element={<Login/>}/>
       <Route exact path="/register" element={<Register/>}/>
       <Route exact path="/mychat" element={<Chat/>}/>

       </Routes>
      

       </Router>

     
    </div>
  )
}

export default App
