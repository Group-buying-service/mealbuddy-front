// react
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// utils
import { APIcall } from "../../utils/api";
import { dateFormat } from "../../utils/util";

const PostDetail = () => {
  const { post_id } = useParams();
  const [ post, setPost ] = useState([]);
  const [ mode, setMode ] = useState('');
  const [ isJoined, setIsJoined ] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {;
      const response = await APIcall('get', `/blog/detail/${post_id}/`);
      if (response.status === 'good'){
        setPost(response.data)
        setMode('RENDER')
      }
      else {
        setMode('LOADING')
      }
      const isJoinedRes = await APIcall('get', `/chat/API/${response.data.chat_id}/user/`);
      if (isJoinedRes.status === 'good') {
        setIsJoined(isJoinedRes.data.is_joined)
      }
    }
    fetchData()
  }, [post_id])

  const getChatPermission = async () => {
    const response = await APIcall('post', `/chat/API/${post.chat_id}/`)
    if (response.status === 'good') {
      navigate(`/chat/${post.chat_id}/`);
    }
    else {
      alert(response.data.message);
    }
  }

  const joinChat = async () => {
    navigate(`/chat/${post.chat_id}/`);
  }


  return (
    <article className="post-page">
      <div className="title-wrap">
        <h2>{post.title}</h2>
      </div>
      <div className="post-wrap">
        {mode === 'RENDER' ? (
          <>
            <p>{post.category}</p>
            <p>{post.writer.username}</p>
            <p>{dateFormat(post.created_at)}</p>
            <p>{post.join_number}/{post.target_number}</p>
            <p>{post.is_compelete ? 'O' : 'X'}</p>
            {isJoined ? 
            (
              <button type="button" onClick={joinChat}>참여하기</button>
            )
            : 
            (
              <button type="button" onClick={getChatPermission}>참여하기</button>
            )
            }

            
          </>
        ) : (
          <div>
            로딩중
          </div>
        )}
        
      </div>
    </article>
  )
}

export default PostDetail