import React from 'react';
import { Link } from 'react-router-dom';

import '../../assets/css/error.css'


const Error = () => {
    return (
      <article className='error-page'>
        <div className='title-wrap'>
          <h2>정상적이지 않은 접근입니다.</h2>
        </div>
        <div className='content-wrap'>
          <p>존재하지 않는 페이지거나, 페이지에 접근할 권한이 없습니다.</p>
          <p><Link to='/post/' className='button'>게시글 목록으로 이동</Link></p>
        </div>
      </article>
    );
}

export default Error;