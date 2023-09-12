import React, { useContext, useState, useEffect } from "react";

// context
import AuthContext from "./context/auth/AuthContext";

// API
import { APIcall } from "../utils/api";
import { useNavigate } from "react-router-dom";

const FoodChoicer = () => {
  const { user, isLoggedIn } = useContext(AuthContext)
  const [ messages, setMessages ] = useState('')
  const [ mode, setMode ] = useState('CLOSE')
  const navigate = useNavigate()

  const getFoodChoice = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target)
    const response = await APIcall('post', `/openAPI/foodchoicer/`, data)
    setMessages(response.data)
  }

  const resetFoodChoice = async (e) => {
    e.preventDefault();
    const response = await APIcall('delete', `/openAPI/foodchoicer/`)
    if (response.status === 'good'){
      setMessages([{
        "role": "assistant",
        "content": "어떤 음식을 추천해드릴까요?"
      }])
    }
    else {
      navigate('/error/')
    }
  }

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const response = await APIcall("get", '/openAPI/foodchoicer/')
        if (response.status === 'good') {
          setMessages(response.data)
        }
        else {
          setMessages([{
            "role": "assistant",
            "content": "어떤 음식을 추천해드릴까요?"
          }])
        }
      }
      fetchData()
    }
  }, [user])

  return (
    <aside className={`foodchoicer ${mode}`}>
      {mode === 'OPEN' && isLoggedIn ? (
        <>
          <div className="foodchoicer-window">
            {messages.map((item, index) => {
              return (
                item.role === "user" ? (
                  <div key={index} className='user-chat foodchoicer-chat'>
                    <p className='chat-content'>{item.content}</p>
                  </div>
                ) : item.role === 'assistant' && (
                  <div key={index} className='ai-chat foodchoicer-chat'>
                    <p className='chat-content'>{item.content}</p>
                  </div>
                )
              );
            })}
          </div>
          <form onSubmit={getFoodChoice}>
            <input type="hidden" name="lat" value={user.lat}/>
            <input type="hidden" name="lon" value={user.lon}/>
            <div className="foodchoicer-form">
              <textarea name="message" id="food-chat" placeholder="위치정보와 날씨를 바탕으로 식사 메뉴를 추천해드립니다."></textarea>
              <button id="food-choicer" type="submit">질문</button>
            </div>
            <div className="button-wrap">
              <button id="foodchoicer-reset" type="button" onClick={resetFoodChoice}>초기화</button>
              <button id="foodchoicer-open" onClick={() => {setMode('CLOSE')}}>닫기</button>
            </div>
          </form>
        </>
      ) : (
        <button id="foodchoicer-open" onClick={() => {setMode('OPEN')}}></button>
      )}
    </aside>
  )
}

export default FoodChoicer