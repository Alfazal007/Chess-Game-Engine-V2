import { User } from "./User";
import { CHAT } from "../types/MessageType";
import { WebSocket } from "ws";
export class Game {
    player1: User;
    player2: User;
    id: string;

    constructor(player1: User, player2: User, id: string) {
        this.player1 = player1;
        this.player2 = player2;
        this.id = id;
        // send black and white information here as a new game has been initialized
        player1.ws.send(
            JSON.stringify({
                gameId: id,
                color: "white",
                opponentEmailToBeRemoved: player2.email,
            })
        );
        player2.ws.send(
            JSON.stringify({
                gameId: id,
                color: "black",
                opponentEmailToBeRemoved: player1.email,
            })
        );
    }

    sendTextMessage(message: string, sender: WebSocket) {
        let receiver: WebSocket;
        if (this.player1.ws === sender) {
            receiver = this.player2.ws;
        } else {
            receiver = this.player1.ws;
        }
        receiver.send(
            JSON.stringify({
                type: CHAT,
                message,
            })
        );
    }
}
// add move // board handlers
