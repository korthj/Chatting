import React, { useEffect } from "react";
import {Outlet, useLocation, Navigate} from 'react-router-dom';
import BottomNav from './BottomNav';
import '../styled/ChatLayout.scss';

const ChatLayout = () => {
  //
  const locationState:any = useLocation();

  return (
    <div className="outerContainer">
        {locationState.state !== null && locationState.state.userId !== '' ? 
          <div className="container">
            <Outlet context={{users:locationState.state.userId,message:locationState.state.messages}}/> 
            <BottomNav/>
          </div>
        : 
          <Navigate to="/"/>
        }
    </div>
  );
}

export default ChatLayout;
