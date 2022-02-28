import React from 'react';
import { BrowserRouter, Routes ,Route } from 'react-router-dom';
import Login from './component/Login'
import ChatLayout from './component/ChatLayout';
import ChatList from './component/ChatList';
import UserList from './component/UserList';
import ChatRoom from './component/ChatRoom';
import FriendList from './component/FriendList';
import ExceptionPage from './component/ExceptionPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Login/>}/>
        <Route path="chat" element={<ChatLayout/>}>
          <Route path="list" element={<ChatList/>}/>
          <Route path="friend" element={<FriendList/>}/>
          <Route path="user/:userid" element={<UserList/>}/>
        </Route>
        <Route path="chat/room" element={<ChatRoom sendUserId={''} receiveUserId={''} roomId={''}/>}/>
        <Route path="/oops" element={<ExceptionPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
