import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { APIcall, kakaoAPIcall } from '../../utils/api';

import '../../assets/css/profile-update.css'

const ProfileUpdate = () => {

  const { user, login, isLoggedIn } = useContext(AuthContext);
  const [ errors, setErrors ] = useState([]);
  const [ address, setAddress ] = useState('');
  const [ username, setUsername ] = useState('');
  const navigate = useNavigate()

  const handleDaumPostcode =  () => {
    new window.daum.Postcode({
        oncomplete: async function(data) {
          let addr = data.jibunAddress || data.autoJibunAddress;
          const coordsData = await kakaoAPIcall('get', `/search/address.json?query=${encodeURIComponent(addr)}`)
          if (coordsData.status === 'good'){
            setCurrentAddress(coordsData.data.address.x, coordsData.data.address.y)
          }
          else {
            console.log(coordsData.data)
          }
        }
    }).open();
  }

  const setCurrentAddress = async (x, y) => {
    const response = await kakaoAPIcall('get', `/geo/coord2regioncode.json?x=${x}&y=${y}`)
      setAddress(response.data.address_name) 
  }

  const getCurrentAddress = () => {
    const getCoords = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const y = position.coords.latitude;
        const x = position.coords.longitude;
        setCurrentAddress(x, y);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  getCoords();
  }

  useEffect(() => {
    if (isLoggedIn) {
      setAddress(user.address);
      setUsername(user.username);
    }
    
  }, [isLoggedIn, user])

  const submitRegister = (e) => {
    e.preventDefault()

    const fetchData = async () => {
      const formData = new FormData(e.target)
      const response = await APIcall('post', '/user/update/', formData)
      if (response.status === 'good') {
        login(response.data);
        setErrors([])
        navigate('/post/');
      }
      else {
        setErrors(response.data.errors)
      }
    }
    fetchData()
  }

  const handelUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  return (
    <article className='profile-update-page'>
      <div className='title-wrap'>
        <h2>회원정보 수정</h2>
        <Link to='/user/delete/' className='button'>회원탈퇴</Link>
        <Link to='/user/passwordchange/' className='button'>비밀번호 변경</Link>
      </div>
      <form method='post' className='auth-form' onSubmit={ submitRegister }>
        <p className='form-wrap'>
          {errors.username&&(
              <>
              {errors.username.map((item, index)=> {
                return <div className='error' key={index}>{item}</div>
              })}
              </>
            )
          }
          <label htmlFor='id_username'>유저명</label>
          <input type='text' name='username' id='id_username' value={username} onChange={handelUsernameChange} required/>
        </p>
        <p className='form-wrap'>
          <label htmlFor='id_address'>주소</label>
          <input type='text' name='address' id='id_address' value={address} required readOnly placeholder='동까지만 입력됩니다.'/>
          <button type='button' className='button' onClick={handleDaumPostcode}>주소찾기</button>
          <button type='button' className='button' onClick={getCurrentAddress}>현재 위치로 지정</button>
        </p>
        <p className='form-wrap'>
          <button className='button' type='submit'>정보 수정</button>
        </p>
      </form>
    </article>
  )
}

export default ProfileUpdate