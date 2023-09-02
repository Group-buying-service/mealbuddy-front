// react
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

// utils
import { APIcall } from "../../utils/api";
import { dateFormat } from "../../utils/util";
import AuthContext from "../context/auth/AuthContext";

// context

const PostDetail = () => {
  const { post_id } = useParams();
  const [ post, setPost ] = useState([]);
  const [ mode, setMode ] = useState('');
  const { user, isLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {;
      const response = await APIcall('get', `/post/detail/${post_id}/`);
      if (response.status === 'good'){
        setPost(response.data)
        setMode('RENDER')
      }
      else {
        navigate('/error/')
      }
    }
    fetchData()
  }, [post_id, isLoggedIn, navigate])

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
    const response = await APIcall('post', `/post/detail/${post_id}/delete/`)
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
    const response = await APIcall('post', `/post/detail/${post_id}/edit/`, data)
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
    const response = await APIcall('post', `/post/detail/${post_id}/edit/`, data)
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
    <article className="post-page">
      {mode === 'RENDER' && (
      <>
        <div className="title-wrap">
          <h2>{post.title}</h2>
        </div>
          {isLoggedIn && user.id === post.writer.id && (
            <div className="post-button-wrap">
              <button type="button" onClick={postDelete}>게시글 삭제</button>
              {post.is_compelete ? 
                (<button type="button" onClick={startJoin}>모집 하기</button>)
                :
                (<button type="button" onClick={endJoin}>모집 완료</button>)
              }
            </div>
          )}
        <div className="post-wrap">
          <p>{post.category}</p>
          <p>{post.writer.username}</p>
          <p>{dateFormat(post.created_at)}</p>
          <p>{post.join_number}/{post.target_number}</p>
          <p>{post.is_compelete ? 'O' : 'X'}</p>
          {!post.is_compelete && post.is_joined ? 
            (
              <button type="button" onClick={joinChat}>참여하기</button>
            )
            : 
            (
              post.join_number < post.target_number && (<button type="button" onClick={getChatPermission}>참여하기</button>)
            )
          }
        </div>
      </>
      )
    }
    </article>
  )
}

export default PostDetail