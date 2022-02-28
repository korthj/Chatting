import React, { useState, useEffect } from "react";
import {Link, useLocation, useNavigate, useOutletContext} from 'react-router-dom';
import {io} from "socket.io-client";
import config from '../config';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import '../styled/ChatList.scss';
// import TextContainer from '../TextContainer/TextContainer';
// import Messages from '../Messages/Messages';
// import InfoBar from '../InfoBar/InfoBar';
// import Input from '../Input/Input';

const URL = config.URL;
const socket = io(URL); 

const ChatList = () => {   
  //  
  let locationState:any = useLocation();
  let {users,message}:any = useOutletContext();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(''); 
  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([{ 
    userId:'',
    message:''
  }]); 
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {       
    //     
    const stateUserId = locationState.state.userId;
    if(stateUserId === undefined)navigate('/');
    
    setUserId(stateUserId);  

    if(locationState.state.messages !== undefined) {
      //
      setMessages(locationState.state.messages);
    };
        
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
      if(data.roomList.filter((e:any) => e.userId === stateUserId)[0].roomUser !== undefined){
        //현재 유저가 속한 채팅방 리스트 찾기
        const list = data.roomList.filter((e:any) => e.userId === stateUserId)[0].roomUser; 
        if(list !== undefined)setRoomList(list);
      };
      setUserList(data.userList);
    });   
  }, []);

  const newMessageFunc = () => {
    //
    let min = Math.ceil(0);
    let max = Math.floor(100);
    return Math.floor(Math.random() * (max - min)) + min;
    
  };
    
  return ( 
      <div className="ChatList">
          <div className="Chat_List_Header"> 
              <div className="Message">
                  <div className="Name"> 
                    메시지
                    <Link className="New_Message" to={''}>새 메시지</Link>
                  </div>
              </div> 
          </div>
          <div className="Chat_List_Body">
              <div className="Chat_List_Rooms">
                  <ul className="Chat_Rooms">  
                      {roomList.map((elem, index:number) => { 
                        // const lastMessage = messages.filter((e:any) => e.sendUserId === elem.userId);
                          return(
                            <li key={index}>
                                <Link to={`/chat/room`} state={{sendUserId:userId,receiveUserId:elem.userId, messages:messages}}>
                                    <div className="Profile_Img">
                                      <AccountBoxIcon />
                                    </div>
                                    <div className="Chat_List_Room_Child">
                                      <div className="Talk">
                                        <p className="Friend_Name">{elem.userId}</p>
                                        <p className="Friend_Position">프론트 엔드</p>
                                        {/* <p className="Chat_Text">{lastMessage !== undefined ? lastMessage.message : ''}</p> */}
                                        <p className="Chat_Text">dummy</p>

                                      </div>
                                      <div className="Chat_Status">
                                        {/* <span className="Time">{lastMessage !== undefined ? lastMessage.sendTime : '어제'}</span> */}
                                        <span className="Time">어제</span>
                                        <span className="Chat_Unread_Balloon">{newMessageFunc()}</span>
                                      </div>
                                    </div>
                                </Link>
                            </li>    
                          )}
                      )}
                      {roomList.length <= 0 ? 
                        <li>
                          <div className="Empty_Chat">
                            채팅방이 없습니다.
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

export default ChatList; 
