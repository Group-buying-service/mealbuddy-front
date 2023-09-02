import React, { useContext, useState } from "react";
import AuthContext from "./context/auth/AuthContext";
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
    <aside>
      {mode === 'OPEN' ? (
        <>
          <textarea name="food-chat" id="food-chat" cols="50" rows="20" value={message} readOnly></textarea>
          <button id="food-choicer" onClick={getFoodChoice}>음식 추천 받기</button>
          <button id="food-choicer-open" onClick={() => {setMode('CLOSE')}}>닫기</button>
        </>
      ):
      (
        <>
          <button id="food-choicer-open" onClick={() => {setMode('OPEN')}}>열기</button>
        </>
      )}
    </aside>
  )
}

export default FoodChoicer