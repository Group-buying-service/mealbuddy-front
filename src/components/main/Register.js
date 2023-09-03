import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APIRegister, kakaoAPIcall } from '../../utils/api';

const Register = () => {

  const { login, isLoggedIn } = useContext(AuthContext);
  const [ errors, setErrors ] = useState([]);
  const [ address, setAddress ] = useState('');
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
        {errors.email&&(
            <>
            {errors.email.map((item, index)=> {
              return <div className='error' key={index}>{item}</div>
            })}
            </>
          )
        }
        <div className='form-wrap'>
          <label htmlFor='id_email'>이메일</label>
          <input type='text' name='email' id='id_email' required/>
        </div>
        {errors.username&&(
            <>
            {errors.username.map((item, index)=> {
              return <div className='error' key={index}>{item}</div>
            })}
            </>
          )
        }
        <div className='form-wrap'>
          <label htmlFor='id_username'>유저명</label>
          <input type='text' name='username' id='id_username' required/>
        </div>
        {errors.password&&(
            <>
            {errors.password.map((item, index)=> {
              return <div className='error' key={index}>{item}</div>
            })}
            </>
          )
        }
        <div className='form-wrap'>
          <label htmlFor='id_password'>비밀번호</label>
          <input type='password' name='password' id='id_password' required/>
        </div>
        {errors.password2&&(
            <>
            {errors.password2.map((item, index)=> {
              return <div className='error' key={index}>{item}</div>
            })}
            </>
          )
        }
        <div className='form-wrap'>
          <label htmlFor='id_password2'>비밀번호 확인</label>
          <input type='password' name='password2' id='id_password2' required/>
        </div>
        <div className='form-wrap'>
          <label htmlFor='id_address'>주소</label>
          <input type='text' name='address' id='id_address' value={address} required readOnly placeholder='동까지만 입력됩니다.'/>
          <button type='button' className='button' onClick={handleDaumPostcode}>주소찾기</button>
          <button type='button' className='button' onClick={getCurrentAddress}>현재 위치로 하기</button>
        </div>
        <div className='form-wrap'>
          <input className='button' type='submit' value="회원가입"/>
        </div>
      </form>
    </article>
  )
}

export default Register