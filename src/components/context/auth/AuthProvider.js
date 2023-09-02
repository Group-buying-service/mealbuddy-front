import React, { useReducer } from 'react';
import AuthContext from './AuthContext';
import { kakaoAPIcall } from '../../../utils/api';

// 초기 상태 정의
const initialState = {
  isLoggedIn: false,
  user: null,
};

// 리듀서 함수 정의
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case 'UPDATE':
      return {
        ...state,
        user: action.payload.user,
      }
    default:
      return state;
  }
};

// AuthProvider 컴포넌트
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const getCoords = async (address) => {
    const response = await kakaoAPIcall('get', `/search/address.json?query=${encodeURIComponent(address)}`)
    let lat = '';
    let lon = '';
    if (response.status === 'good') {
      lon = parseFloat(response.data.address.x);
      lat = parseFloat(response.data.address.y);
    }
    return [lat, lon]
  }

  const login = async (user) => {
    [user.lat, user.lon] = await getCoords(user.address);
    dispatch({ type: 'LOGIN', payload: { user } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (user) => {
    dispatch({ type: 'UPDATE', payload: { user } });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;