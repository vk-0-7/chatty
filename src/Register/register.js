import { useState } from 'react'
import styles from './register.module.scss'
// import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from "@mui/joy/CircularProgress";
import Loader from '../components/loader';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const navigate=useNavigate();
    const [Loading, setLoading] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false);
    const [pic, setPic] = useState()
    const [user, setUser] = useState({

        name: "",
        email: "",
        password: "",
        cpassword: ""


    });

    const handleUpload = (e) => {
        setLoading(true);

        const pics = e.target.files[0];
        //  console.log(pics);
        if (pics.type == 'image/jpeg' || pics.type == 'image/png') {
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', "chat_app");
            data.append("cloud_name", "djtyrnbay");
            fetch("https://api.cloudinary.com/v1_1/djtyrnbay/image/upload", {
                method: 'post', body: data,
            }).then((res => res.json())).then((data) => {
                setPic(data.url.toString());
                setLoading(false)
                toast.success('Your Profile Picture is added');
                // console.log(data.url.toString());
            }).catch((err) => console.log("error occured while uploading image"))


        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });

    };

    const handleRegister = (e) => {
        setBtnLoader(true);
        if( !user.name || !user.password || !user.password ){
            toast.error('Enter valid Credentials');
        }
        else{
            try {
                const data = axios.post('http://localhost:8000/user/register',
                    {
                        "name": user.name,
                        "email": user.email,
                        "password": user.password,
                        "pic": pic
                    });
                toast.success("Registered Successfully")
                setBtnLoader(false);
                setTimeout(() => {
                    navigate('/')
                    
                }, 2000);
                
            } catch (error) {
                console.log('error in register api');
                toast.error('Error in registration');
                setBtnLoader(false);
            }
        }
       
    };

    return (
        <>
            {
                Loading && <Loader/>
            }
                
                    <div className={styles.page}>
                        <div className={styles.container}>
                            <h2>Register </h2>
                            <div className={styles.input_section}>

                                <div className={styles.profile_image}
                                //  style={{ backgroundImage:pic ? `url(${pic})` :'url("https://cdn-icons-png.flaticon.com/512/3177/3177440.png")',}} 
                                >
                                    {pic ? <img src={pic} alt="" /> : <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="" />}

                                    <input type="file" name='pic' className={styles.profile} placeholder='Your Profile' onChange={handleUpload} /> <br />
                                </div>


                                <input type="text" name='name' placeholder='Name' value={user.name} onChange={handleChange} /> <br />

                                <input type="text" name='email' placeholder='Email Address' value={user.email} onChange={handleChange} /> <br />
                                <input type="password" name='password' placeholder='Password' value={user.password} onChange={handleChange} /> <br />
                                <input type="password" name='cpassword' placeholder='Confirm Password' value={user.cpassword} onChange={handleChange} /> <br />

                                <button onClick={handleRegister}>
                                    {btnLoader ? (
                                        <CircularProgress color="neutral" thickness={2} size="sm" />
                                    ) : (
                                        <span>Sign up</span>
                                    )}

                                </button>


                            </div>
                            <div className={styles.other_option}>

                                <p> <span>Already have an account?</span>
                                    <a href={'/'}><span> Log in</span></a> </p>

                            </div>

                        </div>
                    </div>
            <ToastContainer
                position='top-right'
                autoClose={5500}
                hideProgressBar={true}
                newestOnTop={false}
                theme='dark'
                // toastStyle={{ backgroundColor: "#fdd4a9", color: "#053527" }}
            />

        </>
    )
}

export default Register