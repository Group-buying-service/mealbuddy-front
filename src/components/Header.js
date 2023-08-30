import React, { useContext, useEffect } from "react";
import { Link } from 'react-router-dom';
import '../assets/css/common.css';
import AuthContext from "./context/auth/AuthContext";
import { APILogin } from "../utils/api";

function Header() {
    const { login, logout, user, isLoggedIn } = useContext(AuthContext)

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
      console.log('login check')
      loginCheck()
    }, [])

    const submitLogout = () => {
      localStorage.setItem('token', '')
      logout()
    }

    return (
      <header class="header">    
        { isLoggedIn ? (
          <>
            <h1><Link to="/post/">밀버디</Link></h1>
            <div className="header-click">
              <p>환영합니다 {user.username}  님.</p>
              <button type="button" onClick={submitLogout}>로그아웃</button>
            </div>
          </>
        ) : (
          <>
            <h1>밀버디</h1>
            <div className="header-click">
              <Link to='/login/'>로그인</Link>
              <a href="{% url 'user:register' %}">회원가입</a>        
            </div>
          </>
        )}
          
      </header>
    );
}

export default Header
