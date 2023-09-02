import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APIcall } from "../../utils/api";
import AuthContext from "../context/auth/AuthContext";

import { dateFormat } from "../../utils/util";

const PostList = () => {
  const [ postList, setPostList ] = useState('');
  const [ paginator, setPaginator ] = useState('');
  const [ category, setCategory ] = useState('');
  const [ page, setPage ] = useState('1')
  const { isLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await APIcall('get', `/post/`);
      if (response.status === 'good'){
        setPostList(response.data.posts)
        setPaginator(response.data.paginator)
        setPage(response.data.paginator.current_page)
      }
      else {
        navigate('error')
      }
    }
    fetchData()
  }, [])

  const categorySearch = async (e) => {
    e.preventDefault();
    setCategory(e.target.category.value);
    const response = await APIcall('get', `/post/?category=${e.target.category.value}`);
    if (response.status === 'good'){
        setPostList(response.data);
    }
    else {
      navigate('error')
    }
  }

  const changePage = async (e) => {
    e.preventDefault();
    const target_page = e.target.innerText;
    console.log(target_page)
    // const response = await APIcall('get', `/post/?category=${e.target.category.value}`);
  }

  return (
    <article className="post-list">
      <div className="title-wrap">
        <h2 className="main-title">게시판</h2>
      </div>
      <div className="post-list-wrap">
        <div className="board-top"> 
          <form action="" method="get" onSubmit={categorySearch}>
            <label htmlFor="category">카테고리 선택:</label>
            <select id="category" name="category">
              <option value="">전체</option>
              <option value="족발,보쌈">족발 보쌈</option>
              <option value="찜,탕,찌개">찜 탕 찌개</option>
              <option value="돈까스,회,일식">돈까스 회 일식</option>
              <option value="피자">피자</option>
              <option value="고기구이">고기구이</option>
              <option value="양식">양식</option>
              <option value="치킨">치킨</option>
              <option value="중식">중식</option>
              <option value="아시안">아시안</option>
              <option value="백반,죽,국수">백반 죽 국수</option>
              <option value="도시락">도시락</option>
              <option value="분식">분식</option>
              <option value="카페,디저트">카페 디저트</option>
              <option value="페스트푸드">패스트푸드</option>
            </select>
            <button type="submit">필터 적용</button>
          </form>
        </div>
        {postList.length > 0 ? (
          <table className="table list">
            <thead>
              <tr>
                <td>번호</td>
                <td>제목</td>
                <td>카테고리</td>
                <td>작성자</td>                                        
                <td>작성일</td>
                <td>완료여부</td>                    
              </tr>
            </thead>
            <tbody>
              {postList.map((post) => (
                <tr className="post-wrap" key={post.id}>
                  <td>{post.id}</td>
                  <td><Link to={`/post/${post.id}/`}>{post.title}</Link></td>
                  <td>{post.category}</td>
                  <td>{post.writer.username}</td>
                  <td>{dateFormat(post.created_at)}</td>
                  <td>{post.is_complete ? 'O' : 'X'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <p>작성된 게시물이 없습니다.</p>
          )
        }
        {paginator && (
          <ul className='page-list'>
          {paginator.prev_button && <li><a href={`/chat/list/?page=${paginator.prev_button}`} className='page button gray pn-button'>PREV</a></li>}
          {paginator.page_range.map((item, index) => (
            <li key={index}>
            {item === paginator.current_page? (
              <p className='page button gray current-page'>{item}</p>
            ) : (
              <a key={index} href={`/post/`} className='page button gray' onClick={changePage}>{item}</a>
            )}
            </li>
          ))}
          {paginator.next_button && <li><a href={`/chat/list/?page=${paginator.next_button}`} className='page button gray pn-button'>NEXT</a></li>}
        </ul>
        )}
      </div>
      {isLoggedIn && (
        <>
          <Link to='/post/write/'>글 작성하기</Link>
        </>
      )}
    </article>
  )
}

export default PostList