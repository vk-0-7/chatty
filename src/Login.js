import React from 'react'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Chat from './Chat';
import CircularProgress from "@mui/joy/CircularProgress";
import styles from './login.module.scss'
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const Login = () => {
  const navigate = useNavigate()
  const [btnLoader, setBtnLoader] = useState(false)

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    setBtnLoader(true);
    if (!user.password || !user.password) {
      toast.error('Enter valid Credentials');
    }
    else {
      try {
        console.log(process.env.REACT_APP_API_LINK);
        const data = await axios.post(process.env.REACT_APP_API_LINK + 'user/login',
          {

            "email": user.email,
            "password": user.password,

          });
        toast.success("Login Successfully")
        setBtnLoader(false);
        setTimeout(() => {
          navigate('/mychat')

        }, 2000);
        // console.log(data.data);
        localStorage.setItem('userInfo', JSON.stringify(data.data));

      } catch (error) {
        console.log('error in login api', error);
        toast.error('Error in login');
        setBtnLoader(false);
      }
    }

  };

  const handleGuest = () => {
    setUser({ ...user, email: "guest123@gmail.com", password: "pass123" })
  }

  return (
    <>

      <div className={styles.page}>

        <div className={styles.container}>
          <h2>
            Welcome Back <br /> Please Log In{" "}
          </h2>
          <div className={styles.input_section}>
            <input
              type="text"
              name="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleChange}
            />{" "}
            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
            />{" "}
            <br />
            <button onClick={handleLogin}>
              {btnLoader ? (
                <CircularProgress color="neutral" thickness={2} size="sm" />
              ) : (
                <span>Login</span>
              )}
            </button>
            <span style={{ marginTop: "10px", color: "white", cursor: "pointer", border: "1px solid white", padding: "5px", borderRadius: "5px" }} onClick={handleGuest} >
              Login as Guest
            </span>
          </div>
          <div className={styles.other_option}>
            <p>
              {" "}
              <span>New here? </span>
              <a href={"/register"}>
                <span> Register</span>
              </a>{" "}
            </p>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          theme="dark"
        />


      </div>
    </>
  )
}

export default Login