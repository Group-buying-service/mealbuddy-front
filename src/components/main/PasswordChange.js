import React, { useContext, useState } from 'react';
import { APIcall } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/AuthContext';


const PasswordChange = () => {

    const { logout }  = useContext(AuthContext);
    const [ errors, setErrors ] = useState([])
    const navigate = useNavigate();


    const submitChange = (e) => {
      e.preventDefault()
      const fetchData = async () => {
          const formData = new FormData(e.target)
          const response = await APIcall('post', '/user/changepassword/', formData)
          if (response.status === 'good') {
            logout()
            navigate(`/login/`);
            setErrors([])
          }
          else {
            console.log(response.data)
            setErrors(response.data)
          }
      }
      fetchData()
    }

    return (
      <article className='password-change-page'>
        <div className='title-wrap'>
          <h2>비밀번호 변경</h2>
        </div>
        <form method='post' className='auth-form' onSubmit={ submitChange }>
          {errors.error && errors.error.map((item, index) => {
            return (
              <div className='error' key={index}>{item}</div>
              )
            })
          }
          <div className='auth-wrap'>
            <p>
              <label htmlFor='id_current_password'>현재 비밀번호</label>
              <input type='password' name='current_password' id='id_current_password' required/>
            </p>
            <p>
              {errors.new_password1 && errors.new_password1.map((item, index) => {
                return (
                  <div className='error' key={index}>{item}</div>
                  )
                })
              }
              <label htmlFor='id_new_password1'>새 비밀번호</label>
              <input type='password' name='new_password1' id='id_new_password1' required/>
            </p>
            <p>
              <label htmlFor='id_new_password2'>새 비밀번호 확인</label>
              <input type='password' name='new_password2' id='id_new_password2' required/>
            </p>
            <input className='button gray' type='submit' value="변경하기"/>
          </div>
        </form>
      </article>
    );
}

export default PasswordChange;