import React from "react";
import { Routes, Route } from 'react-router-dom';

// component
import Login from '../components/main/Login'
import PostDetail from "./main/PostDetail";
import PostList from "./main/PostList";
import PostWrite from "./main/PostWrite";
import Chat from "./main/Chat";
import IndexPage from "./main/IndexPage";
import Register from "./main/Register";
import Error from "./main/Error";
import ProfileUpdate from "./main/ProfileUpdate";
import UserDelete from "./main/UserDelete";
import PasswordChange from "./main/PasswordChange";
import PostEdit from "./main/PostEdit";



const Main = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<IndexPage />}></Route>
      <Route path="/login/" element={<Login />}></Route>
      <Route path="/register/" element={<Register />}></Route>
      <Route path="/post/:postId/" element={<PostDetail />}></Route>
      <Route path="/post/write/" element={<PostWrite />}></Route>
      <Route path="/post/:postId/edit/" element={<PostEdit />}></Route>
      <Route path="/post/" element={<PostList />}></Route>
      <Route path='/chat/:chat_id/' element={<Chat />}></Route>
      <Route path="/user/update/" element={<ProfileUpdate />}></Route>
      <Route path="/user/delete/" element={<UserDelete />}></Route>
      <Route path="/user/passwordchange/" element={<PasswordChange />}></Route>
      <Route path="/error/" element={<Error />}></Route>
      <Route path="*" element={<Error />}></Route> 
    </Routes>
    </>
  )
}

export default Main