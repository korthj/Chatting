import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import '../styled/Login.scss';

export default function Login() {
  //
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');

  function loginAlert (){
    //
    alert('아이디를 입렵 해주세요.(아무거나 입력해도 됩니다.)');
  };

  return (
    <div className="Login">
      <div className="Login_Child">
        <h1 className="heading">로그인</h1>
        <div>
          <input className="Login_Input" type="id" onChange={(e) => setUserId(e.target.value)} placeholder="아이디" autoComplete='off'/>
        </div>

        <div>
          <input className="Password_Input" type="password" onChange={(e) => setUserPw(e.target.value)} placeholder="비밀번호" autoComplete='off'/>
        </div>

        <div className="Button">
          <Link to={`/oops`}>
            <button className="Sign_UP" type="submit">회원가입</button>
          </Link>

          <Link onClick={e => (userId !== '' || userPw !== '') ? null : loginAlert()} to={`/chat/list`} state={{userId:userId}}>
            <button className='Login_Button' type="submit">로그인</button>
          </Link>
        </div>
      </div>
    </div>
  );
}