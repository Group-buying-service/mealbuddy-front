import React, { useContext, useState } from "react";

// context
import AuthContext from "./context/auth/AuthContext";

// API
import { APIcall } from "../utils/api";

const FoodChoicer = () => {
  const { user, isLoggedIn } = useContext(AuthContext)
  const [ message, setMessage ] = useState('')
  const [ mode, setMode ] = useState('CLOSE')

  const getFoodChoice = async () => {
    setMessage('로딩중입니다.')
    const response = await APIcall('get', `/openAPI/foodchoicer/?lat=${user.lat}&lon=${user.lon}`)
    setMessage(response.data)
  }

  return (
    <aside className={`foodchoicer ${mode}`}>
      {mode === 'OPEN' && isLoggedIn ? (
        <>
          <textarea name="food-chat" id="food-chat" value={message} readOnly></textarea>
          <div className="button-wrap">
            <button id="food-choicer" onClick={getFoodChoice} placeholder="위치정보와 날씨를 바탕으로 식사 메뉴를 추천해드립니다!">음식 추천 받기</button>
            <button id="food-choicer-open" onClick={() => {setMode('CLOSE')}}>닫기</button>
          </div>
        </>
      ):
      (
        <button id="food-choicer-open" onClick={() => {setMode('OPEN')}}></button>
      )}
    </aside>
  )
}

export default FoodChoicer