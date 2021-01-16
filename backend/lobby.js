const createRoom = require('./room.js')

class Lobby {
    constructor(io, lobbyCode) {
        this.io = io;
        this.lobbyCode = lobbyCode;
        this.userInLobby = [];
        this.activeRooms = [];

        this.getLobbyCode = this.getLobbyCode.bind(this);
        this.modifyNickname = this.modifyNickname.bind(this);
        this.addUserToLobby = this.addUserToLobby.bind(this);
        // this.endLobby = this.endLobby.bind(this);
        this.createRooms = this.createRooms.bind(this);
        this.endRoom = this.endRoom.bind(this);
        
    }

    // Set nickname sent from the front-end
    modifyNickname = (user_id, nickname) => {
        const user = this.userInLobby.find(element => (element === user_id));
        
        // Check that user exists and modify username propety
        if (!user){
            console.log("Cannot find specified user")
        } else {
            user.nickname = nickname;
        }
    }

    // Get lobby code to ensure correct lobby is joined
    getLobbyCode = () => {
        return this.lobbyCode;
    }

    // Add user to the lobby when joining
    addUserToLobby = (io, user_id, socket) => {
        this.userInLobby.push({
            io: io,
            id: user_id,
            nickname: "",
            usersAlreadyMatched: [],
            socket: socket
        });  
    };
    
    createRooms = () => {
        for (i = 0; i < this.userInLobby.length; i++) {
            let matchStatus = this.usersAlreadyMatched.find(element => (element === this.userInLobby[i].user_id)); 
            let matchStatusTwo = this.usersAlreadyMatched.find(element => (element === this.userInLobby[i+1].user_id)); 
            if ((matchStatus) && (matchStatusTwo)) {
                i += 1;
                continue;
            }
            else if ((matchStatus) && (!matchStatusTwo)) {
                continue;      
            }
            else if ((!matchStatus) && (matchStatusTwo)) {
                let temp = this.userInLobby[i];
                this.userInLobby[i] = this.userInLobby[i+1];
                this.userInLobby[i+1] = temp;
                continue;
            }
            else if ((!matchStatus) && (!matchStatusTwo)) {
                let matches = [this.userInLobby[i], this.userInLobby[i+1]];
                let roomString = String(this.userInLobby[i].user_id) + String(this.userInLobby[i+1].user_id);
                createRoom(this.io, matches, roomString);

                this.activeRooms.push(roomString);
            }
        }
    }

    endRooms = () => {
        this.io.to(this.lobbyCode).emit('closerooms')
    }

    endRoom = (room) => {
        this.activeRooms = this.activeRooms.filter((activeRoom) => activeRoom != room);
    }

}

module.exports = Lobby;