import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/common.css';
import AuthContext from "./context/auth/AuthContext";
import { APILogin, APIcall } from "../utils/api";

const Weather = ({user}) => {
  const [ weatherData, setWeatherData ] = useState('');
  
  useEffect(() => {
    setWeatherData('')
    const fetchWeatherData = async (lat, lon) => {
      const response = await APIcall('get', `/openAPI/weather/?lat=${lat}&lon=${lon}`);
      if (response.status === 'good') {
        setWeatherData(response.data);
      }
    }
    if (user){
      fetchWeatherData(user.lat, user.lon);
    }
  }, [user])
  
  return (
    <ul>
      {weatherData && Object.entries(weatherData).map(([key, value]) => {
        return (<li key={key}>{key} : {value}</li>)
      })}
    </ul>
  )
}


const Header = () => {
    const { login, logout, user, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(()=>{
      const loginCheck = async () => {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await APILogin()
          if (response.status === 'good') {
            login(response.data);
            // navigate('/');
          }
          else {
            console.log(response.data)
          }
        }
      }
      loginCheck()
    }, [])

    const submitLogout = () => {
      localStorage.setItem('token', '')
      logout()
      navigate('/')
    }

    return (
      <header className="header">    
        <h1><Link to="/post/">밀버디</Link></h1>
        <Weather user={user}/>
        { isLoggedIn ? (
          <>
            <div className="location">지역 : {user.address}</div>
            <div className="header-click">
              <Link to='/user/update/'>환영합니다 {user.username}  님.</Link>
              <button type="button" onClick={submitLogout}>로그아웃</button>
            </div>
          </>
        ) : (
          <>
            <div className="header-click">
              <Link to='/login/'>로그인</Link>
              <Link to='/register/'>회원가입</Link>     
            </div>
          </>
        )}
      </header>
    );
}

export default Header
