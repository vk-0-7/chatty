import React, { useState, useEffect } from 'react'
import axios from 'axios';
import styles from './navbar.module.scss'
import { useNavigate } from 'react-router-dom';
import { API_LINK } from '../utils/index';
import { AiOutlinePlus } from 'react-icons/ai'


const Navbar = () => {

    const navigate = useNavigate();

    const [searchquery, setSearchQuery] = useState();
    const [alluserDetail, setallUserDetail] = useState([]);
    const [opensidebar, setOpenSidebar] = useState(false);
    const [showprofile, setShowProfile] = useState(false);
    const [userSelectedToChat, setUserSelectedToChat] = useState();
    const user = JSON.parse(localStorage.getItem('userInfo'))

    // console.log(user);

    const mouseEnter = () => {
        setShowProfile(true)
    }

    const mouseLeave = () => {
        setShowProfile(false)
    }
    const handleLogOut = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }

    const userData = async () => {
        try {
            const usersdata = await axios.get(API_LINK + '/api/getallUser');
            console.log('users data::::', usersdata.data)
            setallUserDetail(usersdata.data)

        } catch (error) {
            console.log('error')
        }
    }

  useEffect(() => {

    userData();
  }, [])
  
   
    const accessChats = async (id) => {
        try {
            const chatdata = await axios.post(API_LINK + '/api/chat', { currUserId: user, userId: id });
            console.log('chat data::::', chatdata.data)
           

        } catch (error) {
            console.log('error')
        }
    }



    return (
        <div className={styles.main_div}>

            {opensidebar && <div className={styles.sidebar}>

                {alluserDetail &&
                    alluserDetail.filter((value) => value._id != user._id)?.map((val, index) => {
                        return (

                            <div className={styles.users_list} onClick={()=>accessChats(val._id) } key={index} >
                                <img src={val.pic} alt="" />
                                <p>
                                    {val?.name}
                                </p>
                            </div>

                        )
                    })
                }

                <AiOutlinePlus onClick={() => setOpenSidebar(false)} />

            </div>}

            <div className={styles.search_users}>
                <input type="text" placeholder='search' onChange={(e) => setSearchQuery(e.target.value)} onClick={(prev) => setOpenSidebar(true)} />


            </div>

            <h3>Talk-A-Tive</h3>

            <div className={styles.userinfo} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} >
                <img src={user?.pic} alt="" />
                {
                    showprofile && (
                        <div className={styles.userdetail}>
                            <div>
                                <img src={user?.pic} alt="no image" />
                                <h4>{user?.email}</h4>
                                <button onClick={handleLogOut}>Log Out</button>
                            </div>


                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default Navbar