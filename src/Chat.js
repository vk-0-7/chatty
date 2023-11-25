import { useState, useEffect } from 'react';
import './chat.scss';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { AiOutlineSend, AiOutlinePlus } from 'react-icons/ai'
import io from "socket.io-client"
// import queryString from 'query-string';
import Lottie from 'react-lottie';
import ScrollableFeed from 'react-scrollable-feed'
import { findOtherUser } from './utils';
import { addmesssage } from './redux/messageSlice';
import CreateGroup from './components/creategroup';
import animationData from './animation/typing_animation.json'
import Navbar from './components/navbar';
// const socket = io(ENDPOINT);
// import io from 'socket.io-client'
var socket, selectedchatCompare;





function Chat() {
  const storeedMessage = useSelector((state) => state.message);
  console.log(storeedMessage);

  const dispatch = useDispatch()
  const [name, setname] = useState('');
  const [room, setroom] = useState('');
  const [alluserDetail, setallUserDetail] = useState([]);
  const [user, setUser] = useState();
  const [userSelectedToChat, setUserSelectedToChat] = useState({});
  const [typing, settyping] = useState(false)
  const [isTyping, setisTyping] = useState(false)
  // console.log(JSON.parse(localStorage.getItem('userInfo')));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userInfo')));

  }, [])

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };





  const [message, setmessage] = useState('')
  const [chat, setchat] = useState([])
  const [opengroup, setOpenGroup] = useState(false);
  const [allmessages, setAllMessages] = useState([]);
  const [socketConnected, setsocketConnected] = useState(false)



  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userInfo'));

    socket = io(process.env.REACT_APP_API_LINK);
    socket.emit("setup", userData);
    socket.on('connected', () => setsocketConnected(true))
    socket.on('typing', () => setisTyping(true))
    socket.on('stop typing', () => setisTyping(false))
  }, [])


  const fetchchats = async () => {

    try {

      const chatsdata = await axios.get(process.env.REACT_APP_API_LINK + 'api/chat', { params: { "currUserId": JSON.parse(localStorage.getItem('userInfo'))._id } }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('chat data ::::', chatsdata.data)
      setchat(chatsdata.data)

    } catch (error) {
      console.log('error')
    }
  }

  useEffect(() => {

    fetchchats();


  }, [])



  const getallMessages = async () => {
    try {

      const allchats = await axios.get(process.env.REACT_APP_API_LINK + 'api/message/' + userSelectedToChat?._id, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('all chats data ::::', allchats)
      setAllMessages(allchats.data)
      dispatch(addmesssage(allchats.data));

      socket.emit('join chat', userSelectedToChat._id)

    } catch (error) {
      console.log('error')
    }
  }

  useEffect(() => {
    if (userSelectedToChat._id) {
      getallMessages();
    }
    selectedchatCompare = userSelectedToChat._id;



  }, [userSelectedToChat?._id])







  const handlesendMessage = async () => {
    try {
      socket.emit('stop typing', userSelectedToChat._id)
      const sendmessage = await axios.post(process.env.REACT_APP_API_LINK + 'api/message/', { content: message, senderId: user._id, chatId: userSelectedToChat._id }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('message send ::::', sendmessage.data)
      setmessage("");

      socket.emit('new message', sendmessage.data)
      dispatch(addmesssage([...allmessages, sendmessage.data]));
      setAllMessages((prevmessages) => [...prevmessages, sendmessage.data]);

    } catch (error) {
      alert('error')
      console.log('error')
    }
  }

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log('message', newMessageReceived);
      if (selectedchatCompare !== newMessageReceived.chat._id) {
        //give notification
        console.log(selectedchatCompare, newMessageReceived.chat);
      }
      else {
        console.log(allmessages)
        let temp = [...allmessages];
        temp.push(newMessageReceived)
        // const newarr=[...allmessages,newMessageReceived];
        console.log(newMessageReceived);
        // console.log('new arr',newarr);
        setAllMessages((prevmessages) => [...prevmessages, newMessageReceived]);
        console.log(allmessages)
        console.log(temp)
        dispatch(addmesssage(temp));
      }
    })
  })


  const typingHandler = (e) => {
    setmessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      settyping(true)
      socket.emit('typing', userSelectedToChat._id)
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', userSelectedToChat._id);
        settyping(false);
      }

    }, timerLength)


  }




  return (
    <>
      {/* {console.log('all messages ::::', allmessages)} */}
      {/* {console.log('selected user ::::', userSelectedToChat)} */}
      {
        opengroup && <CreateGroup setOpenGroup={setOpenGroup} />
      }
      <Navbar />
      <div className='main_box'>

        <div className="user_box">
          <div className="user_inner_box">

            <div className="my_chats">
              <h3>MY CHATS</h3>
              <div className="create_group">
                <button onClick={() => setOpenGroup(true)}>
                  <p> Create Group </p>  <AiOutlinePlus />
                </button>
              </div>
            </div>

            {chat &&
              chat?.map((val, index) => {
                return (
                  <>
                    <div className='user_list' key={index} onClick={() => setUserSelectedToChat(val)} >
                      {val.isGroupChat ? <img src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg" alt="" /> : <img src={findOtherUser(val.users)[0].pic} alt="" />}
                      {!val.isGroupChat ? <p>
                        {findOtherUser(val.users)[0].name}
                      </p> : <p>{val.chatName}</p>}
                    </div>
                  </>
                )
              })
            }

          </div>
        </div>
        <div className="chat_box">

          {userSelectedToChat?._id && <h3>{userSelectedToChat?.isGroupChat ? userSelectedToChat?.chatName : findOtherUser(userSelectedToChat.users)[0].name}</h3>}
          <div className="chat_section">
            <ScrollableFeed>
              {
                storeedMessage?.map((val, index) => {
                  return (
                    <div key={index}>
                      {userSelectedToChat?.isGroupChat ? <div>
                        {val.sender._id == user._id ?
                          <div className='your_msg'>
                            <p>{val.content}</p>
                          </div> : <div className='other_msg'>
                            <img src={val.sender.pic} alt="" />
                            <p>{val.content}</p>
                          </div>}

                      </div> :
                        <div>
                          {val.sender._id == user._id ?
                            <div className='your_msg'>
                              <p>{val.content}</p>
                            </div> : <div className='other_msg'>
                              <img src={findOtherUser(userSelectedToChat.users)[0].pic} alt="" />
                              <p>{val.content}</p>
                            </div>}
                        </div>}
                    </div>
                  )
                })

              }
            </ScrollableFeed>
          </div>

          {
            isTyping ? <div style={{ position: "absolute", bottom: "8vh", left: "43vw" }}> <Lottie options={defaultOptions} width={60} style={{ marginBottom: 10, marginLeft: 0 }} /> </div> : <></>
          }
          <div className='form' >
            <input type="text" placeholder='write a message' name='chat' value={message} onChange={typingHandler} />

            <button onClick={handlesendMessage} ><AiOutlineSend /> </button>

          </div>



        </div>
      </div>
    </>
  );
}

export default Chat;
