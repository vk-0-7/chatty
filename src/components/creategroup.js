import React, { useState, useEffect } from 'react'
import axios from 'axios';
import styles from './creategroup.module.scss'
// import { API_LINK } from '../utils/index';
import { AiOutlinePlus } from 'react-icons/ai'

const CreateGroup = ({ setOpenGroup }) => {

  const [alluserDetail, setallUserDetail] = useState([]);
  const [user, setUser] = useState();
  const [grouplist, setgroupList] = useState([])
  const [selectedUser, setSelectedUser] = useState([JSON.parse(localStorage.getItem('userInfo'))._id]);
  const [groupname, setGroupName] = useState('')
  // console.log(JSON.parse(localStorage.getItem('userInfo')));


  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userInfo')));
    

  }, [])

  const fetchData = async () => {
    try {
      const usersdata = await axios.get(REACT_APP_API_LINK + '/api/getallUser',);
      console.log('users data::::', usersdata.data)
      setallUserDetail(usersdata.data)

    } catch (error) {
      console.log('error')
    }
  }
  useEffect(() => {

    fetchData();

  }, [])

  const addUsertogroup = (id) => {
    if ((selectedUser.findIndex((val) => val == id)) == -1) {
      setSelectedUser([...selectedUser, id])
    }
    else {
      const newarr = selectedUser.filter((val) => val != id);
      setSelectedUser(newarr);
    }

  }

  const CreateGroup = async () => {
    try {
      const groupcreated = await axios.post(REACT_APP_API_LINK + '/api/group',{"name":groupname,users:JSON.stringify(selectedUser)});
      console.log('group data::::', groupcreated)
      fetchData();

    } catch (error) {
      console.log('error')
    }
  }

  //  console.log((selectedUser?.findIndex((val)=> val._id == -1)));


  return (
    <div className={styles.full_page} >
      <AiOutlinePlus onClick={() => setOpenGroup(false)} />
      <div className={styles.group_box}>

        <h2>Create Group Chat</h2>

        <input type="text" value={groupname} placeholder='enter group name' onChange={(e)=>setGroupName(e.target.value)} />

        <div className={styles.inner_group}>
          {alluserDetail &&
            alluserDetail.filter((value) => value._id != user._id)?.map((val, index) => {
              return (

                <div className={styles.users_list} style={{ border: (selectedUser?.findIndex((val) => val._id == -1)) ? "" : "3px solid black" }} key={index} onClick={()=>addUsertogroup(val._id)}  >
                  <img src={val.pic} alt="" />
                  <p>
                    {val?.name}
                  </p>
                </div>

              )
            })
          }
        </div>
        <button onClick={()=>CreateGroup()}>Create Group</button>
      </div>

    </div>
  )
}

export default CreateGroup