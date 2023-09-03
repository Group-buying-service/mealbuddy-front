import React from "react";
import { Link } from "react-router-dom";

import '../../assets/css/index.css'


const IndexPage = () => {

  return (
    <>
      <div className="title-wrap">
        <h2>인덱스페이지</h2>
      </div>
      <div className="index-content">
        <p>
          우리 동네 사람들과 배달 공동구매를 해봐요!
        </p>
        <p>
          새로운 사람들과의 만남이 기다리는 밀 버디.
        </p>
        <p>
          배달비 절약은 덤으로!
        </p>
      </div>
      <div className="index-button">
        <Link to='/login/' className="button">로그인</Link>
        <Link to='/register/' className="button">회원가입</Link>
      </div>
    </>
  )
}

export default IndexPage