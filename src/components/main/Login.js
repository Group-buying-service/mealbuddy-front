import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APILogin } from '../../utils/api';

const Login = () => {

  const { login, isLoggedIn } = useContext(AuthContext);
  const [ errors, setErrors ] = useState([]);
  const navigate = useNavigate

  useEffect(() => {
    if (isLoggedIn) {
      // navigate('/');
    }
  }, [isLoggedIn, navigate])

  const submitLogin = (e) => {
    e.preventDefault()

    const fetchData = async () => {
      const formData = new FormData(e.target)
      const response = await APILogin(formData)
      if (response.status === 'good') {
        login(response.data);
        // navigate('/');
        setErrors([])
      }
      else {
        setErrors(response.data.errors)
      }
    }
    fetchData()
  }

  return (
    <article className='login-page'>
      <div className='title-wrap'>
        <h2>login</h2>
      </div>
      <form method='post' className='auth-form' onSubmit={ submitLogin }>
        {errors && (
          <>
              {errors.map((item, index) => {
                return (
                  <div className='error' key={index}>{item}</div>
                  )
                })
              }
          </>
        )}
        <div className='auth-wrap'>
            <p>
              <label htmlFor='id_email'>이메일</label>
              <input type='text' name='email' id='id_email' required/>
            </p>
            <p>
              <label htmlFor='id_password'>비밀번호</label>
              <input type='password' name='password' id='id_password' required/>
            </p>
            <input className='button gray' type='submit' value="로그인"/>
          </div>
      </form>
    </article>
  )
}

export default Login