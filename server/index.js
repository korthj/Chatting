const express = require('express');
const cors = require('cors');
const {Server} = require("socket.io");
const e = require('express');

const app = express();
const DEFAULT_PORT = 3003;
const httpServer = require('http').createServer();

app.use(cors());
const io = new Server(httpServer, {cors: {
  origin: "http://localhost:3000", 
  credentials: true,
  pingTimeout:2000
}});

const userList = [{userId:'김철수',socketId:'0'},{userId:'김영희',socketId:'1'}];
const roomList = [{userId:'김철수',roomUser:[{userId:'김영희',roomId:'1'}]},{userId:'김영희',roomUser:[{userId:'김철수',roomId:'1'}]}];

//DB 대신 데이터를 저장하기 위해 임시로 메시지를 저장하는 변수

io.on('connect', (socket) => {
  //
  socket.on('Get_User_List', (data,callback) => {
    //유저 리스트 반환, 
    socket.join(data.user);

    io.emit('userList', userList);
  });


  socket.on('Get_Room_List', (data) => {
    //채팅방 리스트 반환, 처음 연결되며 유저 아이디별로 소켓에 조인하여 채팅방을 생성한다.(해당 솔루션에서만.)
    if(data.userId !== '' && userList.filter((e) => e.userId === data.userId).length === 0){
      //중복 유저가 없다는 가정하에, 채팅방 고유부호 추가
      data.socketId = socket.id;
      userList.push(data); 
      roomList.push({userId:data.userId,roomUser:[]});
      socket.join(data.userId);
    };

    //기존 유저가 로그인 할 수 있으니 소켓 아이디 얻기
    io.emit('roomList', {roomList:roomList, userList:userList});
  });

  socket.on('Chat_Room_Join', (data, callback) => {
    //채팅방 접속 할 때 채팅방 리스트에 소켓 아이디, 유저 아이디 추가 해야함
    let socketId;

    for(let i in roomList){
      //룸리스트에 메시지 받을 유저가 존재하는지 확인
      if(roomList[i].userId === data.receiveUserId && roomList[i].roomUser.length > 0){
        //없다면 i번 째 룸리스트에 메시지 받을 유저가 존재하는지 확인
        for(let j in roomList[i].roomUser){
          //없다면 메시지 받을 유저가 i번째 룸 리스트(유저)의 대화 상대에 존재하는지 확인 
          if(roomList[i].roomUser[j].userId !== data.sendUserId && data.sendUserId  !== ''){
            //없다면 룸 리스트의 i번째 유저의 대화 상대 목록에 메시지 받을 유저를 추가, socketid를 채팅방 키로 사용한다.
            roomList[i].roomUser.push({userId:data.sendUserId,roomId:socket.id});
            socketId = socket.id;
          }else if(roomList[i].roomUser[j].userId === data.sendUserId && data.sendUserId  !== ''){
            //대화 목록에 유저가 이미 존재한다면 기존 roomId(=socketId)만 저장
            socketId = roomList[i].roomUser[j].roomId;
          };
        };
      }else if(roomList[i].userId === data.receiveUserId && roomList[i].roomUser <= 0 ){
        //
            roomList[i].roomUser.push({userId:data.sendUserId,roomId:socket.id});
            socketId = socket.id;
      };

      //
      if(roomList[i].userId === data.sendUserId && roomList[i].roomUser.length > 0){
        //
        for(let j in roomList[i].roomUser){
          //
          if(roomList[i].roomUser.find(e => e.userId === data.receiveUserId) === undefined  && data.receiveUserId  !== ''){
            //
            roomList[i].roomUser.push({userId:data.receiveUserId,roomId:socket.id});
          }; 
        };
      }else if(roomList[i].userId === data.sendUserId && roomList[i].roomUser.length <= 0){
        //
        roomList[i].roomUser.push({userId:data.receiveUserId,roomId:socket.id});
      };
    };

    socket.join(socketId);
    
    io.emit('roomData', { "socketId":socketId});
    callback();
  });


  socket.on('sendMessage', (data, callback) => {
    //
    io.to(data.socketId).emit('message', {sendUserId:data.sendUserId, receiveUserId:data.receiveUserId, message: data.message, sendTime: data.sendTime});

    callback();
  });


  socket.on('disconnect', () => {
    // console.log('user disconnected', socket.id);
  })
});

httpServer.listen(DEFAULT_PORT);