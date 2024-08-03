import { User } from "./User";
import { CHAT, Game_Over, MOVE } from "../types/MessageType";
import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { updateRedis } from "../RedisUpdate";
export class Game {
    player1: User;
    player2: User;
    id: string;
    board: Chess;
    moveCount: number;

    constructor(player1: User, player2: User, id: string) {
        this.player1 = player1;
        this.player2 = player2;
        this.id = id;
        this.board = new Chess();
        this.moveCount = 0;
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

    async makeMove(from: string, to: string, ws: WebSocket) {
        if (this.moveCount % 2 === 0 && ws !== this.player1.ws) {
            // this is player 1s move
            console.log("Not this user's turn right now");
            return;
        }
        if (this.moveCount % 2 !== 0 && ws !== this.player2.ws) {
            // this is player 2s move
            console.log("Not this user's turn right now");
            return;
        }
        try {
            this.board.move({
                from: from,
                to: to,
            });
            // redis updations here
            await updateRedis(
                from,
                to,
                this.id,
                this.board.turn() === "w" ? "black" : "white",
                MOVE
            );
        } catch (err) {
            // @ts-ignore
            console.log("There was an error in the sent move", err.message);
            return;
        }
        if (this.board.isGameOver()) {
            // disconnect the players
            this.player1.ws.send(
                JSON.stringify({
                    type: Game_Over,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white",
                    },
                })
            );
            this.player1.ws.close();
            this.player2.ws.send(
                JSON.stringify({
                    type: Game_Over,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white",
                    },
                })
            );
            this.player2.ws.close();
            return;
        }
        if (this.moveCount % 2 === 0) {
            this.player2.ws.send(
                JSON.stringify({
                    type: MOVE,
                    payload: {
                        from: from,
                        to: to,
                    },
                })
            );
        }
        if (this.moveCount % 2 !== 0) {
            this.player1.ws.send(
                JSON.stringify({
                    type: MOVE,
                    payload: {
                        from: from,
                        to: to,
                    },
                })
            );
        }
        console.log(this.board.ascii());
        this.moveCount++;
    }
}
// add move // board handlers
