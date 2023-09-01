import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { APIcall } from "../../utils/api";
import AuthContext from "../context/auth/AuthContext";

const ChatUser = ({ chat_id, listedUser, owner, setUserList, getUserList }) => {

  const { user } = useContext(AuthContext);

  const actUserListProps = async () => {
    const userList = await getUserList();
      if (userList.status === 'good'){
        setUserList(userList.data)
      }
      else {

      }
    }

  const banUser = async (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const response = await APIcall('post', `/chat/API/${chat_id}/user/ban/`, data)
    if (response.status==='good'){
      await actUserListProps()
    }
    else {

    }
  }

  const exitChat = async(e) => {
    const response = await APIcall('delete', `/chat/API/${chat_id}/user/`)
    if (response.status==='good'){
      await actUserListProps()
    }
    else {

    }
  }

  return (
    <li>
      {listedUser.username}
      {user.id === owner.id && listedUser.id !== user.id ?
        (<form method="post" onSubmit={banUser}>
          <input type="hidden" value={listedUser.id} name="target_user_id"/>
          <button type="submit">강퇴</button>
        </form>)
        :
        (user.id !== owner.id && listedUser.id === user.id && (<button type="button" onClick={exitChat}>나가기</button>))
      }
    </li>
  )
}


const Chat = () => {
  const { chat_id } = useParams();
  const [ chatData, setChatData ] = useState('');
  const [ userList, setUserList ] = useState('');
  const [ chatSocket, setChatSocket ] = useState('');
  const { user } = useContext(AuthContext);

  const chatWindowRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }

  const connectWS = async () => {
    const token = localStorage.getItem('token');
    const chatSocket = new WebSocket(
      'ws://'
      + '127.0.0.1:8000'
      + '/ws/chat/'
      + chat_id
      + '/'
      + `?token=${token}`
      );
    setChatSocket(chatSocket)

    chatSocket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      if (data.type === "chat.message") {
        setChatData(prevChatData => {
          const updatedChatData = {
            ...prevChatData,
            messages: [...prevChatData.messages, data.message]
          };
          return updatedChatData;
        }); 
      }
      else if (data.type === 'chat.user.join') {
        setChatData(prevChatData => {
          const updatedChatData = {
            ...prevChatData,
            messages: [...prevChatData.messages, data.message]
          };
          return updatedChatData;
        }); 
      }
      else if (data.type === 'chat.user.leave') {
        if (data.user_id === user.id){
          navigate(`/post/`)
        }
        else {
          setChatData(prevChatData => {
            const updatedChatData = {
              ...prevChatData,
              messages: [...prevChatData.messages, data.message]
            };
            return updatedChatData;
          }); 
        }
      }
    };
  
    chatSocket.onclose = (e) => {
      //console.log(e)
      const code = (e.code);
      if (code === 4040){
        alert("방이 삭제되었습니다.");
        navigate('/post/');
      }
      else {
        console.error('Chat socket closed unexpectedly')
      }
    };
  
    chatSocket.onerror = (e) => {
      console.log(e)
      alert("연결에 실패했습니다.")
    }
  }

  const submitChat = async (e, form) => {
    const message = form.message.value
    chatSocket.send(JSON.stringify({
      'message': message,
    }));
    form.message.value = ''
  }

  const enterEvent =(e, form) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitChat(e, form)
    }
  }

  const getChatData = async () => {
    const response = await APIcall('get', `/chat/API/${chat_id}/`);
    return response
  }

  const getUserList = async () => {
    const response = await APIcall('get', `/chat/API/${chat_id}/user/list/`);
    return response
  }

  useEffect(() => {
    const fetchData = async () => {
      const chatData = await getChatData();
      const userList = await getUserList();
      if (chatData.status === 'good'){
        setChatData(chatData.data)
        connectWS();
      }
      else {
        navigate('/post/')
      }
      if (userList.status === 'good'){
        setUserList(userList.data)
      }
      else {
        navigate('/post/')
      }
    }
    fetchData()
  }, [chat_id])


  useEffect(scrollToBottom, [chatData])

  const chatWindowStyle = {
    height: '50vh',
    overflow: 'auto'
  }

  return (
    <article className="chat-page">
      <div className='title-wrap'>
        <h2>{chatData.title} - {chatData.join_number}/{chatData.target_number}</h2>
      </div>
      <ul className="user-list">
        {userList && 
          userList.map((item, index) => {
            // console.log(item)
            return <ChatUser key={index} chat_id={chat_id} listedUser={item.user} owner={chatData.writer} getUserList={getUserList} setUserList={setUserList}/>
          })}
      </ul>
      
      <div className="chat-window" ref={chatWindowRef} style={chatWindowStyle}>
        {chatData && 
          (chatData.messages.map((message, index) => {
            return (<div key={index} className='user-chat'>
              {/* <img src={`${BASE_URL}${chat.writer_profile_image}`} alt="user-icon"/> */}
              {message.user ? (
                <pre className="chat-content">{message.user.username} : {message.message}</pre>
              ) : (
                <pre className='chat-content'>{message.message}</pre>
              )}
            </div>)
          }))
        }
      </div>
      <form method="post" className="chat-form" onSubmit={(e) => e.preventDefault()}>
        <textarea id="id_message" name="message" onKeyDown={(e) => enterEvent(e, e.target.form)}></textarea>
        <button type="button" onClick={(e) => submitChat(e, e.target.form)}>메세지보내기</button>
      </form>
    </article>
  )
}

export default Chat