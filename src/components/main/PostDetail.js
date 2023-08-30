import React, { useState, useEffect, useParams } from "react";
import { APIcall } from "../../utils/api";

const PostDetail = () => {
  const { post_id } = useParams();
  const [ post, setPost ] = useState([]);
  const [ mode, setMode ] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let response = {};
      response = await APIcall('get', `/blog/detail/${post_id}`);
      // setPost(response.data.post)
      setMode('RENDER')
    }
    fetchData()
  },[post_id])

  return (
    <article className="post-page">
      <div className="post-wrap">
        {mode === 'RENDER' ? (
          <>
            <h2>{post.title}</h2>
            <p>{post.category}</p>
            <p>{post.writer}</p>
            <p>{post.created_at}</p>
            <p>{post.join_number}/{post.target_number}</p>
            <p>{post.is_compelete}</p>
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