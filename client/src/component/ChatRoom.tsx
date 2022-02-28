import React,{useState,useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {io} from 'socket.io-client';
import config from '../config';
import Send from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import '../styled/index.scss';
import '../styled/ChatRoom.scss';
import { SportsHockeyTwoTone } from '@mui/icons-material';

const URL = config.URL;
const socket = io(URL);

interface ChatRoomProps {
    sendUserId:string;
    receiveUserId:string;
    roomId:string;
};
  
interface Message{
    userId:string; 
    createdTime:string;
    message:string;
    users:string[];
    messages:string[];
}

const ChatRoom = (location:ChatRoomProps) => {
    //
    let locationState:any = useLocation();
    let navigate = useNavigate();

    const [sendUserId, setSendUserId] = useState(locationState.state.sendUserId);
    const [receiveUserId, setReceiveUserId] = useState(locationState.state.receiveUserId);
    const [userList, setUserList] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]); 
    const [roomData, setRoomData] = useState('');
    
 
    dayjs.locale('ko');
    const sendTime = dayjs().format('A HH:mm');
 
    useEffect(() => {
        //
        setSendUserId(locationState.state.sendUserId!); 
        setReceiveUserId(locationState.state.receiveUserId);

        socket.emit('Chat_Room_Join', {sendUserId:sendUserId,receiveUserId:receiveUserId},(error:Error) => {
            //이때 소켓에 커넥션이 되면 조인을 통해서 룸 아이디를 정할 수 있음. 그 순간에 룸 리스트에 저장 및 유저
            if(error) {
                alert(`다시 시도해주세요 - ${error}`);
            };      
        }); 
    }, [URL]);    
  
    useEffect(() => {     
        // 
        socket.on('message', (message) => { 
            //메시지 받아오기  
            setMessages(messages => [...messages, message]);
        }); 
          
        socket.on("roomData", (data) => {
            //  
            setRoomData(data.socketId);
        });  
    }, []); 

    const sendMessage = (e:any) => { 
        // 
        e.preventDefault();
        if(message) {
            socket.emit('sendMessage', 
            {sendUserId:sendUserId,receiveUserId:receiveUserId,socketId:roomData,message:message,sendTime:sendTime}, 
            () => setMessage('')); 
        }
    }

    return(   
        <div className="outerContainer">
            <div className="container">
                <div className="ChatRoom">
                    <div className="ChatRoom_Header">
                        <div className="Close_Icon">
                            <Link className="Close_Icon_Button" to={`/chat/list`} state={{userId:sendUserId,receiveUserId:receiveUserId,messages:messages}}>
                                <CloseIcon color="disabled"/>
                            </Link>
                        </div>
                        <div className="NameTag">
                            <div className="Name">{receiveUserId}</div>
                            <div className="Position">프론트엔드 개발자</div>
                        </div>
                    </div>

                    <div className="ChatRoom_Neck">
                        {/* 임시, 실제 서비스용으로 개발시 날짜 계산 */}
                        오늘
                    </div>

                    <div className="ChatRoom_Body"> 
                        <div className="Message_List">
                            <div className="Chatting">
                                {messages.map((elem, index:number) => {
                                    return(
                                        <div key={index}>
                                                {elem.sendUserId === sendUserId ? (
                                                    <div className="Chat_Send">
                                                        <div className="Chat_Send_Child">
                                                            <span className="Chat_Balloon">{elem.message}</span> 
                                                        </div>
                                                        <span className="Time">{elem.sendTime}</span>
                                                    </div>
                                                ) : (
                                                    <div className="Chat_Receive">
                                                        <div className="Chat_Receive_Child">
                                                            <span className="Chat_Balloon_Friend">{elem.message}</span>
                                                        </div>
                                                        <span className="Time">{elem.sendTime}</span>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                ) 
                                    }
                            </div>
                        </div>
                        <div className="Message_Box">
                            <form className="Message_Box_Form">
                                <div className="Form_Child">
                                    <input
                                    className="Form_Input"
                                    type="text"
                                    placeholder="메시지 입력"
                                    value={message}
                                    onChange={({ target: { value } }) => setMessage(value)}
                                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                                    />
                                    <button className="Form_Button" onClick={e => sendMessage(e)}>
                                        <Send color='disabled'/>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ChatRoom;