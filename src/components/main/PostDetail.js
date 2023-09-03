//assets
import '../../assets/css/detail.css'

// react
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// context
import AuthContext from "../context/auth/AuthContext";

// utils
import { APIcall } from "../../utils/api";
import { dateFormat } from "../../utils/util";


const PostDetail = () => {
  const { postId } = useParams();
  const [ post, setPost ] = useState([]);
  const [ mode, setMode ] = useState('');
  const { user, isLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {;
      const response = await APIcall('get', `/post/detail/${postId}/`);
      if (response.status === 'good'){
        setPost(response.data)
        setMode('RENDER')
      }
      else {
        navigate('/error/')
      }
    }
    fetchData()
  }, [postId, isLoggedIn, navigate])

  const getChatPermission = async () => {
    const response = await APIcall('post', `/chat/${post.chat_id}/`)
    if (response.status === 'good') {
      navigate(`/chat/${post.chat_id}/`);
    }
    else {
      alert(response.data)
    }
  }

  const joinChat = () => {
    navigate(`/chat/${post.chat_id}/`);
  }

  const postDelete = async () => {
    const response = await APIcall('post', `/post/detail/${postId}/delete/`)
    if (response.status === 'good') {
      navigate(`/post/`);
    }
    else {
      navigate('/error/')
    }
  }

  const endJoin = async () => {
    const data = {
      is_compelete : true,
    }
    const response = await APIcall('post', `/post/detail/${postId}/edit/`, data)
    if (response.status === 'good') {
      setPost(response.data)
    }
    else {
      navigate('/error/')
      // alert("예기치 않은 오류가 발생했습니다.");
    }
  }

  const startJoin = async () => {
    const data = {
      is_compelete : false,
    }
    const response = await APIcall('post', `/post/detail/${postId}/edit/`, data)
    if (response.status === 'good') {
      setPost(response.data)
    }
    else {
      // console.log(response.data);
      navigate('/error/')
      // alert("예기치 않은 오류가 발생했습니다.");
    }
  }

  return (
    <article className="detail-page">
      {mode === 'RENDER' && (
      <>
        <div className="title-wrap">
          <h2>{post.title}</h2>
          {isLoggedIn && user.id === post.writer.id && (
            <div className="post-button-wrap">
              <button type="button" className='button delete-button' onClick={postDelete}></button>
              <Link to={`/post/${postId}/edit/`} className='button modify-button'></Link>
              {post.is_compelete ? 
                (<button type="button" className='button' onClick={startJoin}>모집 하기</button>)
                :
                (<button type="button" className='button' onClick={endJoin}>모집 끝내기</button>)
              }
            </div>
          )}
        </div>
        <div className="author-wrap">
          <p>{post.writer.username}</p>
          <p>{dateFormat(post.created_at)}</p>
          <p>|</p>
          <p className='category-wrap '>{post.category}</p>
          <p>|</p>
          <p>{post.is_compelete ? '모집 완료' : '모집 중'}</p>
          <p>|</p>
          <p>{post.join_number}/{post.target_number}</p>
            {post.is_joined ? 
              (
                <>
                  <p>|</p>
                  <button type="button" className='join-button' onClick={joinChat}>참여하기</button>
                </>
              )
              : 
              (
                !post.is_compelete && post.join_number < post.target_number && (
                  <>
                    <p>|</p>
                    <button type="button" className='join-button' onClick={getChatPermission}>참여하기</button>
                  </>
                )
              )
            }
        </div>
        <div className="post-wrap">
          <p>{post.content}</p>
          <div className='post-status'>
            
          </div>
        </div>
      </>
      )
    }
    </article>
  )
}

export default PostDetail