import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APILogin } from '../../utils/api';

const Login = () => {

  const { login, isLoggedIn } = useContext(AuthContext);
  const [ errors, setErrors ] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/post/');
    }
    // setErrors(false);
  }, [isLoggedIn, navigate])

  const submitLogin = (e) => {
    e.preventDefault()

    const fetchData = async () => {
      const formData = new FormData(e.target)
      const response = await APILogin(formData)
      if (response.status === 'good') {
        login(response.data);
        setErrors(false)
        navigate('/post/');
      }
      else {
        // console.log(response.data.errors)
        setErrors(true)
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
            <div className='error'>이메일이나 패스워드가 올바르지 않습니다.</div>
          </>
        )}
        <div className='form-wrap'>
          <label htmlFor='id_email'>이메일</label>
          <input type='text' name='email' id='id_email' required/>
        </div>
        <div className='form-wrap'>
          <label htmlFor='id_password'>비밀번호</label>
          <input type='password' name='password' id='id_password' required/>
        </div>
        <div className='form-wrap'>
          <button type='submit' className='button'>로그인</button>
        </div>
      </form>
    </article>
  )
}

export default Login