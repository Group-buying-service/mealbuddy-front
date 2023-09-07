// react
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

// context
import AuthContext from "./context/auth/AuthContext";

// API
import { APILogin, APIcall, BASE_WS_URL } from "../utils/api";

// assets
import '../assets/css/header.css'
import logo from '../assets/images/logo.png'

const Notification = ({ isLoggedIn }) => {

  const [ notificationSocket, setNotificationSocket ] = useState('');
  const [ notification, setNotification ] = useState({chat:''});

  useEffect(() => {
    console.log('noti')
    if (isLoggedIn) {
      connectWS();
    }
    }, [isLoggedIn])

  const connectWS = async () => {
    const token = localStorage.getItem('token');
    const notificationSocket = new WebSocket(
      BASE_WS_URL
      + '/ws/notification/'
      + `?token=${token}`
      );

    setNotificationSocket(notificationSocket)

    notificationSocket.onmessage = async function(e) {
      const data = JSON.parse(e.data);
      if (data.type === "init") {
        setNotification(data)
        console.log(data)
      }
      else {
        setNotification(prevNotification => {
          const updatedNotification = {
            ...prevNotification,
            ...data
          };
          return updatedNotification
        })
      }
    }
  
    notificationSocket.onclose = (e) => {
      const code = (e.code);
      console.error('Chat socket closed unexpectedly')
    };
  
    notificationSocket.onerror = (e) => {
      console.log(e)
      alert("연결에 실패했습니다.")
    }
  }

  return (
    <ul>
      {notification.chat && notification.chat.map((value, key) => {
        return (<Link key={key} to={`/chat/${value[0]}`}>{value[1]}</Link>)
      })}
    </ul>
  )
}

const Weather = ({ user, infoState, setWeather }) => {
  const [ weatherData, setWeatherData ] = useState('');

  const weatherList = {
    '비': 'rainy',
    '비/눈': 'rainy',
    '눈': 'snow',
    '소나기': 'rainy',
    '맑음': 'sunny',
    '구름많음': 'partlycloud',
    '흐림': 'cloud',
  }

  const setWeatherProps = (data) => {
    if (weatherList[data.강수형태]) {
      setWeather(weatherList[data.강수형태])
    }
    else if (weatherList[data.날씨]) {
      setWeather(weatherList[data.날씨])
    }
    else {
      setWeather('sunny')
    }
  }
  
  useEffect(() => {
    setWeatherData('')
    const fetchWeatherData = async (lat, lon) => {
      const response = await APIcall('get', `/openAPI/weather/?lat=${lat}&lon=${lon}`);
      if (response.status === 'good') {
        setWeatherData(response.data);
        setWeatherProps(response.data)
      }
    }
    fetchWeatherData(user.lat, user.lon);
  }, [user])
  
  return (
    <>
      { infoState ==='OPEN' && (
        <div className="info-wrap">
          <div className="location">{user.address}</div>
          <ul className="weather-wrap">
            {weatherData && Object.entries(weatherData).map(([key, value]) => {
              return (<li key={key}>{key} : {value}</li>)
            })}
          </ul>
        </div>
        )
      }
    </>
  )
}

const Header = () => {
    const { login, logout, user, isLoggedIn } = useContext(AuthContext);
    const [ infoState, setInfoState ] = useState('CLOSE');
    const [ weather, setWeather ] = useState('sunny');
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

    const toggleInfo = () => {
      setInfoState(infoState === 'CLOSE' ? 'OPEN' : 'CLOSE')
    }

    return (
      <header className="header">    
        <h1><Link to="/post/"><img src={logo} alt="밀 버디"></img></Link></h1>
        { isLoggedIn ? (
          <>
            <div className="header-click">
              <Link to='/user/update/'>환영합니다 {user.username}  님</Link>
              <button type="button" className={`toggle-info ${weather}`} onClick={toggleInfo}>▼</button>
              <button type="button" onClick={submitLogout}>로그아웃</button>
            </div>
            <Weather user={user} infoState={infoState} setWeather={setWeather}/>
            <Notification isLoggedIn={isLoggedIn}/>
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
