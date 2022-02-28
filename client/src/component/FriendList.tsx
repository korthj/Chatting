import React, { useState, useEffect } from "react";
import {Link, useLocation} from 'react-router-dom';
import {io} from "socket.io-client";
import config from '../config';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import '../styled/FriendList.scss';
const URL = config.URL;
const socket = io(URL); 

const FriendList = () => {   
  //  
  let locationState:any = useLocation();
  const [userId, setUserId] = useState(''); 
  const [userList, setUserList] = useState([{
    userId:'',
    socketId:''
  }]);
  const [roomList, setRoomList] = useState([{ 
    userId:''
  }]); 
      
    
  useEffect(() => {       
    //     
    const stateUserId = locationState.state.userId;
    setUserId(stateUserId);  

    socket.emit('Get_Room_List', {userId:stateUserId},(error:Error) => {
      //
      if(error) {   
        alert(error);    
      }        
    });    
         
  }, []);         
        
  useEffect(() => {   
    // 
    const stateUserId = locationState.state.userId;
    socket.on('roomList', (data) => {    
      //   
      const list = data.roomList.filter((e:any) => e.userId === stateUserId)[0].roomUser;
      if(list !== undefined)setRoomList(list); 
      setUserList(data.userList.filter((e:any) => e.userId !== stateUserId));
    });   
  }, []);
    

  return ( 
      <div className="FriendList">
          <div className="Friend_List_Header"> 
              <div className="Message">
                  <div className="Friend"> 
                    People
                  </div>
              </div> 
          </div>
          <div className="Friend_List_Body">
              <div className="Friend_List_Rooms">
                  <ul className="Friend_Rooms">  
                      {userList.map((elem, index:number) => { 
                          return(
                            <li key={index}>
                                <Link to={`/chat/room`} state={{sendUserId:userId,receiveUserId:elem.userId}}>
                                    <div className="Profile_Img">
                                      <AccountBoxIcon />
                                    </div>
                                    <div className="Friend_List_Room_Child">
                                      <div className="Talk">
                                          <p className="Friend_Name">{elem.userId}</p>
                                          <p className="Friend_Position">Position</p>
                                      </div>
                                    </div>
                                </Link>
                            </li>    
                          )}
                      )}
                      {userList.length <= 0 ? 
                        <li>
                          <div className="Empty_Chat">
                            접속 중인 친구가 없습니다.
                          </div>
                        </li>
                        :
                        ''
                      }
                  </ul>
              </div>
          </div>
      </div>
  );  
}

export default FriendList; 
