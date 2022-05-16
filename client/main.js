const form = document.getElementById('msgForm');
const socket = io('http://localhost:3000');
form.addEventListener('submit', send_message);

const myname = prompt('What is your name?')
socket.emit('new-user', myname)

socket.on('chat-message', data => {
    receive_message(`${data.name}: ${data.message}`);
})

socket.on('user-connected', Name => {
    receive_message(`${Name} connected`);
})

socket.on('user-disconnected', Name => {
    receive_message(`${Name} disconnected`);
})

// APPEND MESSAGES IN THREAD
class Message{
    constructor(person, msg){
        this.person = person
        this.msg = msg
    }
}

const scrollToBottom = () => {
    scrollingElement = document.getElementById('msgs')
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

let messageThread = [
    {
        person: 2,
        txtMsg: "These is a demo message"
    },
    {
        person: 1,
        txtMsg: "These is a demo message"
    },
    {
        person: 2,
        txtMsg: "These is a demo message"
    },
    {
        person: 1,
        txtMsg: "These is a demo message"
    },
    {
        person: 2,
        txtMsg: "These is a demo message"
    }
];

const appendMessage = (person, message) => {
    var obj = document.createElement('div');
    var msg = document.createElement('p');
    var msgcontainer = document.getElementById('msgs');
    var txtMsg = document.getElementById('txtMsg').value;
    messageThread.push(new Message(person, txtMsg));

    if(person === 1){
        obj.className = "col-9 offset-3 d-flex justify-content-end msg"
        msg.className = "text-white bg-primary px-3 pmsg"
    }else{
        obj.className = "col-9 d-flex justify-content-start msg"
        msg.className = "text-white px-3 bg-secondary pmsg"
    }  

    msg.appendChild(document.createTextNode(message))  
    document.getElementById('txtMsg').value = null;
    obj.appendChild(msg);
    msgcontainer.appendChild(obj);
    scrollToBottom();
}

messageThread.forEach(message => {
    var obj = document.createElement('div')
    var msg = document.createElement('p')
    var msgcontainer = document.getElementById('msgs')

    switch(message.person){
        case 1:
            obj.className = "col-9 offset-3 d-flex justify-content-end msg"
            msg.className = "text-white bg-primary px-3 pmsg"
            break
        case 2: 
            obj.className = "col-9 d-flex justify-content-start msg"
            msg.className = "text-white px-3 bg-secondary pmsg"
            break
    }
    msg.appendChild(document.createTextNode(message.txtMsg))
    obj.appendChild(msg);
    msgcontainer.appendChild(obj);
});

// SEND MESSAGES
function send_message(event) {
    event.preventDefault();
    const person = 1;
    var message = document.getElementById('txtMsg').value;
    appendMessage(person, message);
    socket.emit('send-chat-message', message);
}

// RECEIVE MESSAGES
function receive_message(message) {
    const person = 2;
    appendMessage(person, message);
}
