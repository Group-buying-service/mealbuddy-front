import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// context
import AuthContext from "../context/auth/AuthContext";
// API
import { APIcall } from "../../utils/api";
// utils
import { dateFormat } from "../../utils/util";
// assets
import '../../assets/css/list.css'


const PostList = () => {
  const [ postList, setPostList ] = useState('');
  const [ paginator, setPaginator ] = useState('');
  const [ category, setCategory ] = useState('');
  const { user, isLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await APIcall('get', `/post/`);
      if (response.status === 'good'){
        setPostList(response.data.posts)
        setPaginator(response.data.paginator)
      }
      else {
        navigate('error')
      }
    }
    fetchData()
  }, [])

  const categorySearch = async (e) => {
    e.preventDefault();
    if (category !== e.target.category.value){
      setCategory(e.target.category.value);
      const response = await APIcall('get', `/post/?category=${e.target.category.value}`);
      if (response.status === 'good'){
          setPostList(response.data.posts);
          setPaginator(response.data.paginator);
      }
      else {
        navigate('error')
      }
    }
  }

  const onPrevNextPageButton = async (e) => {
    e.preventDefault()
    const target_page = parseInt(e.target.getAttribute('href').split('=')[1])
    const response = await APIcall('get', `/post/?category=${category}&page=${target_page}`);
    if (response.status === 'good') {
      setPostList(response.data.posts);
      setPaginator(response.data.paginator);
    }
}

  const changePage = async (e) => {
    e.preventDefault();
    const target_page = e.target.innerText;
    const response = await APIcall('get', `/post/?category=${category}&page=${target_page}`);
    if (response.status === 'good') {
      setPostList(response.data.posts);
      setPaginator(response.data.paginator);
    }
  }

  return (
    <article className="post-list">
      <div className="title-wrap">
        <h2>{isLoggedIn&& user.address} 게시판</h2>
      </div>
      <div className="board-top"> 
        <form action="" method="get" onSubmit={categorySearch}>
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
          <button className='button' type="submit">필터 적용</button>
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
              <td>모집상태</td>
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
                <td>{post.join_number}/{post.target_number}</td>
                <td>{post.is_compelete ? '모집 완료' : '모집 중'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
          <p>작성된 게시물이 없습니다.</p>
        )
      }
      <div className="board-bottom">
        {paginator && (
          <ul className='pagination'>
          {paginator.prev_button && <li><a href={`/post/?page=${paginator.prev_button}`} onClick={onPrevNextPageButton} className='page button  pn-button'>PREV</a></li>}
          {paginator.page_range.map((item, index) => (
            <li key={index}>
            {item === paginator.current_page? (
              <a href={`/post/`} className='button current-page' onClick={changePage}>{item}</a>
            ) : (
              <a href={`/post/`} className='button' onClick={changePage}>{item}</a>
            )}
            </li>
          ))}
          {paginator.next_button && <li><a href={`/post/?page=${paginator.next_button}`} className='page button pn-button' onClick={onPrevNextPageButton}>NEXT</a></li>}
        </ul>
        )}
        {isLoggedIn && (
          <div className="btn-group">
            <Link className='modify-button' to='/post/write/'></Link>
          </div>
        )}
      </div>
    </article>
  )
}

export default PostList