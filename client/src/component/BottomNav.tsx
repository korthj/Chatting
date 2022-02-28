import React, { useState, useEffect, useCallback } from "react";
import {Link,useLocation, useNavigate} from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import '../styled/BottomNav.scss';

const BottomNav = () => {
    //
    const locationState:any = useLocation();
    
    return (    
        <div className="Bottom_Nav">
            <Link to="/oops">
                <HomeIcon color="disabled"/>
                <p>홈</p>
            </Link>
            <Link to="/chat/friend" state={{userId:locationState.state.userId}}>
                <PeopleAltIcon color="disabled"/>
                <p>사람</p>
            </Link>
            <Link to={`/chat/list`} state={{userId:locationState.state.userId}}>
                <MessageIcon color="disabled"/>
                <p>메시지</p>
            </Link>
            <Link to="/oops">
                <AccountCircleIcon color="disabled"/>
                <p>마이페이지</p>
            </Link>
            <Link to="/oops">
                <BusinessCenterIcon color="disabled"/>
                <p>채용</p>
            </Link>
        </div>
    );
}

export default BottomNav;