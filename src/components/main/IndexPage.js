import React from "react";
import { Link } from "react-router-dom";


const IndexPage = () => {

  return (
    <>
      <h2>인덱스페이지</h2>
      <Link to='/login/'>로그인</Link>
      <Link to='/register/'>회원가입</Link>
    </>
  )
}

export default IndexPage