import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/common.css';
import AuthContext from "./context/auth/AuthContext";
import { APILogin, APIcall } from "../utils/api";

const Weather = () => {
  const [ coords, setCoords ] = useState({});
  const [ weatherData, setWeatherData ] = useState('');
  
  useEffect(() => {

    const fetchWeatherData = async (lat, lon) => {
      const response = await APIcall('get', `/openAPI/weather/?lat=${lat}&lon=${lon}`);
      if (response.status === 'good') {
        setWeatherData(response.data);
      }
    }
    const getCoords = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });
          fetchWeatherData(lat, lon); // 좌표 정보를 받아온 후에 fetchData 호출
        },
        (error) => {
          console.error(error);
        }
      );
    };

    getCoords();
  }, [])
  
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
        <Weather />
        { isLoggedIn ? (
          <>
            
            <div className="header-click">
              <p>환영합니다 {user.username}  님.</p>
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
