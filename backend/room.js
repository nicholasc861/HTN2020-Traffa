const OpenTok = require('opentok');
const { OPENTOK_API_KEY, OPENTOK_API_SECRET } = process.env; 
const opentok = new OpenTok(OPENTOK_API_KEY, OPENTOK_API_SECRET);

const createRoom = (io, users, room, endRoom) => {
    let sessionId;
    // Create a video conference session with Vonage API for the two users
    opentok.createSession({mediaMode: "route"}, (error, session) => {
        if (error) {
            console.log(`Error creating session: ${error}`);
        } else {
            sessionId = session.sessionId;
            console.log(`Created session between ${users[0]} and ${users[1]} with session ${sessionId}`);
        }
    })

    users.forEach((user, index) => {
        const otherUser = index ? users[0] : users[1];

        // Array storing users that they already talked to, don't match again
        user.usersAlreadyMatched.push(otherUser.user_id);

        // Subscribe to new room for 1-on-1 chat
        user.socket.join(room);

        // Pass the session Id for the Vonage Video Conference to the client
        io.to(user.socket.id).emit('joinroom', otherUser.nickname, sessionId);

        // Handle chat messages
        user.socket.on('sendChatMsg', chat)
        user.socket.on('userLeave', userLeave)

        const chat = (msg) => {
            user.socket.to(room).emit('receiveChatMsg', msg);
        }

        const removeSocketListeners = () => {
            user.socket.off('sendChatMsg');
            user.socket.off('userLeave');
        }

        const userLeave = () => {
            removeSocketListeners();
            user.socket.leave(room);
            endRoom(room);
        }

    
    })

    return true;
}

const endRoom = () => {

}

module.exports = { createRoom, endRoom };