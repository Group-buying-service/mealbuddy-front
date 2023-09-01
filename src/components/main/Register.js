import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APILogin, APIRegister } from '../../utils/api';

const Register = () => {

  const { login, isLoggedIn } = useContext(AuthContext);
  const [ errors, setErrors ] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/post/');
    }
    // setErrors(false);
  }, [isLoggedIn, navigate])

  const submitRegister = (e) => {
    e.preventDefault()

    const fetchData = async () => {
      const formData = new FormData(e.target)
      const response = await APIRegister(formData)
      if (response.status === 'good') {
        login(response.data);
        setErrors([])
        navigate('/post/');
      }
      else {
        // console.log(response.data.errors)
        setErrors(response.data.errors)
      }
    }
    fetchData()
  }

  return (
    <article className='login-page'>
      <div className='title-wrap'>
        <h2>회원가입</h2>
      </div>
      <form method='post' className='auth-form' onSubmit={ submitRegister }>
        <div className='auth-wrap'>
            <p>
              {errors.email&&(
                  <>
                  {errors.email.map((item, index)=> {
                    return <div className='error' key={index}>{item}</div>
                  })}
                  </>
                )
              }
              <label htmlFor='id_email'>이메일</label>
              <input type='text' name='email' id='id_email' required/>
            </p>
            <p>
              {errors.username&&(
                  <>
                  {errors.username.map((item, index)=> {
                    return <div className='error' key={index}>{item}</div>
                  })}
                  </>
                )
              }
              <label htmlFor='id_username'>유저명</label>
              <input type='text' name='username' id='id_username' required/>
            </p>
            <p>
              {errors.password&&(
                  <>
                  {errors.password.map((item, index)=> {
                    return <div className='error' key={index}>{item}</div>
                  })}
                  </>
                )
              }
              <label htmlFor='id_password'>비밀번호</label>
              <input type='password' name='password' id='id_password' required/>
            </p>
            <input className='button gray' type='submit' value="회원가입"/>
          </div>
      </form>
    </article>
  )
}

export default Register