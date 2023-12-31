import React, { useState } from "react";
import { APIcall } from "../../utils/api";
import { useNavigate } from "react-router-dom";

import '../../assets/css/postwrite.css'

const PostWrite = () => {

  const [ targetNumber, setTargetNumber ] = useState(2)
  const navigate = useNavigate()

  const submitWrite = async (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const response = await APIcall("post", '/post/write/', data)
    if (response.status === 'good'){
      navigate('/post/')
    }
  }

  return (
    <article className="write-page">
      <div className="title-wrap">
        <h2>글 작성하기</h2>
      </div>
      <form method="post" className="write-form" onSubmit={submitWrite}>
        <p className="form-wrap">
          <label htmlFor="id_title">제목</label>
          <input id="id_title" name="title"/>
        </p>
        <p className="form-wrap">
          <label htmlFor="id_category">카테고리</label>
          <select id="id_category" name="category">
            <option value="족발,보쌈">족발, 보쌈</option>
            <option value="찜,탕,찌개">찜, 탕, 찌개</option>
            <option value="돈까스,회,일식">돈까스, 회, 일식</option>
            <option value="피자">피자</option>
            <option value="고기구이">고기구이</option>
            <option value="양식">양식</option>
            <option value="치킨">치킨</option>
            <option value="중식">중식</option>
            <option value="아시안">아시안</option>
            <option value="백반,죽,국수">백반, 죽, 국수</option>
            <option value="도시락">도시락</option>
            <option value="분식">분식</option>
            <option value="카페,디저트">카페, 디저트</option>
            <option value="페스트푸드">패스트푸드</option>
          </select>
        </p>
        <p className="form-wrap">
          <label htmlFor="id_target_number">모집인원</label>
          <input type="number" min="2" max="10" id="id_target_number" name="target_number" value={targetNumber} onChange={(e) => setTargetNumber(e.target.value)}/>
        </p>
        <p className="form-wrap">
          <label htmlFor="id_content">내용</label>
          <textarea id="id_content" name="content"></textarea>
        </p>
        <p className="form-wrap">
          <button type="reset" className="button">리셋</button>
          <button type="submit" className="button">작성</button>
        </p>
      </form>
    </article>
  )
}

export default PostWrite