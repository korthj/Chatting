import React, { useState, useEffect } from "react";
import {useParams, useSearchParams} from 'react-router-dom';
import {io} from "socket.io-client";
import config from '../config';

const URL = config.URL;
const socket = io(URL);

const UserList = () => {
  //
  const [userList, setUserList] = useState([]);
  const [userId , setUserId] = useState('');

  let params = useParams();

  useEffect(() => {
    // 
    setUserId(params.userid!);
    socket.emit('Get_User_List', ({user:{userId:userId}}), (error:Error) => {
      //
      if(error) {
        alert(`다시 시도해주세요. - ${error}`);
      }
    });

    socket.on('userList', (data) => {
      //
      setUserList(data);
    });

  }, [userId]);  
     
 
  return (
    <div>
      유저 선택시 유저 아이디와 룸 아이디 넘겨준다.
    </div>
  ); 
}

export default UserList;
 