import React, { useContext, useState } from 'react';
import { APIcall } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/AuthContext';

const UserDelete = () => {

    const { logout }  = useContext(AuthContext);
    const [ error, setError ] = useState('')
    const navigate = useNavigate();


    const submitDelete = (e) => {
        e.preventDefault()
        
        const fetchData = async () => {
            const formData = new FormData(e.target)
            const response = await APIcall('post', '/user/delete/', formData)
            if (response.status === 'good') {
              logout()
              navigate(`/login/`);
              setError('')
            }
            else if (response.status === 'Unauthorized') {
              logout();
              navigate(`/login/`);
            }
            else {
              setError(response.data)
            }
        }
        fetchData()
    }


    return (
      <article className='user-delete-page'>
        <div className='title-wrap'>
          <h2>회원 탈퇴</h2>
        </div>
        <form method='post' className='auth-form' onSubmit={ submitDelete }>
          <p>정말로 회원탈퇴를 원하시면, 비밀번호를 다시 입력해주세요.</p>
          <p>탈퇴하기 버튼을 누르면 즉시 회원탈퇴 됩니다.</p>
          {error && (
            <div className='error'>{error}</div>
          )}
          <div className='form-wrap'>
            <label htmlFor='id_password'>비밀번호</label>
            <input type='password' name='password' id='id_password' required/>
          </div>
          <div className='form-wrap'>
            <input className='button' type='submit' value="탈퇴하기"/>
          </div>
        </form>
      </article>
    );
}

export default UserDelete;