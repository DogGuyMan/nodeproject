var socket = io()
//접속할때 실행
socket.on('connect', function(){
    var name = prompt('반갑습니다!', '');

    if(!name){
        name = '익명'
    }

    socket.emit('newUser', name);
})

//새 유저가 왔다고 알림
socket.on('update', function(data){
    console.log('${data.name}: ${data.message}')
})

//메세지 전송함수 html oneclick send()
function send(){
    //입력 된 데이터 가져오기
    var messageval = document.getElementById('test').value
    //가져온걸 
    document.getElementById('test').value = ''
    //서버 이벤트에 있는 'message'에 이제 
    socket.emit('message', {type: 'messgage', message : messageval})
}

/*
접속시 실행 
socket.on('connect', function(){
    var input = document.getElementById('test');
    input.value = '접속 됨';
})


function send(){
    //입력된 데이터 가져오기
    var message = document.getElementById('test').value
    document.getElementById('test').value = "";
    socket.emit('send', {msg:message});
    //send 라는곳에 메세지 전달
}
*/