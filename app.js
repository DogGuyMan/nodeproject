/*node js 기본 내장 모듈 불러오기 파일과 관련된 처리*/
const fs = require('fs');
/* 익스프레스 모듈 불러오기*/
const express = require('express')
/* 소켓 모듈 불러오기 */
const socket = require('socket.io');
/*node js 기본 내장 모듈 불러오기*/
const http = require('http');
/*익스프레스 객체 생성*/
const app = express();
/*익스프레스 http 서버 생성*/
const server = http.createServer(app);
/*생성된 서버를 socket.io에다 바인딩*/
const io = socket(server);
// UUID
const { v4: uuidv4 } = require('uuid');
console.log(uuidv4());


/* 정적파일을 제공하기 위해 미들웨어(Middleware)를 사용하는 코드입니다.
app.use()를 사용하여 원하는 미들웨어를 추가하여 조합할 수 있습니다!
기본적으로는 클라이언트가 
http://서버주소/css 로 액세스 할 경우 액세스가 거부됩니다.
서버측에서는 아무런 작업을 하지않았기 때문이죠
*/
app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

app.get('/', function(request, response) {
    fs.readFile('./static/index.html', function(err,data){
        if(err){
            response.send('에러');
        }
        else{
            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.write(data);
            response.end();
        }
        /**/
    })
});

io.sockets.on('connection', function(socket){

    //새로운 유저가 접속한경우 다른 소켓에도 알려주기
    socket.on('newUser', function(name){
        console.log(name + ' 님이 접속하였습니다.');
        socket.name = name;
        io.sockets.emit('update', {
            type: 'connect', 
            name: 'SERVER', 
            message: name + '님이 접속했습니다'
        })
    })
    //전송한 메세지 받기
    socket.on('message', function(data){
        //받은 데이터에 누가 보냈는지 이름 추가
        data.name = socket.name;
        console.log(data);
        //
        socket.broadcast.emit('update', data);
    })
    socket.on('disconnect', function(){
        console.log(socket.name + '님이 나가셨습니다.');
        socket.broadcast.emit('update', {
            type:'disconnection',
            name: 'SERVER',
            message: socket.name + '님이 나가셨습니다.'
        });
    })

    /*
    console.log('유저 접속됨')
    socket.on('send', function(data){
        console.log('전달된 메세지 :', data.msg);
    })
    socket.on('disconnect', function(){
        console.log('접속 종료')
    })
    */
})

/*서버를 8080 포트로 listen*/
server.listen(8080, function(){
    console.log('서버 실행중!!!');
})
