import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { APIcall, kakaoAPIcall } from '../../utils/api';

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
      setAddress(user.Address);
      setUsername(user.username);
    }
    
  }, [isLoggedIn])

  const submitRegister = (e) => {
    e.preventDefault()

    const fetchData = async () => {
      const formData = new FormData(e.target)
      const response = await APIcall('post', formData)
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
    <article className='login-page'>
      <div className='title-wrap'>
        <h2>회원정보 수정</h2>
      </div>
      <form method='post' className='auth-form' onSubmit={ submitRegister }>
        <div className='auth-wrap'>
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
              <input type='text' name='username' id='id_username' value={username} onChange={handelUsernameChange} required/>
            </p>
            <p>
              <label htmlFor='id_address'>주소</label>
              <input type='text' name='address' id='id_address' value={address} required readOnly placeholder='동까지만 입력됩니다.'/>
              <button type='button' onClick={handleDaumPostcode}>주소찾기</button>
              <button type='button' onClick={getCurrentAddress}>현재 위치로 하기</button>
            </p>
            <input className='button gray' type='submit' value="정보수정"/>
            <Link to='/user/passwordchange/'>비밀번호 변경</Link>
            <Link to='/user/delete/'>회원탈퇴</Link>
          </div>
      </form>
    </article>
  )
}

export default ProfileUpdate