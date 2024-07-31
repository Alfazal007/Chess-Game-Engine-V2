import { WebSocket } from "ws";
import { User } from "./User";
import { Game } from "./Game";
import { ConnectMessage, ExchangeMessages } from "../types/MessageInterfaces";
import axios from "axios";
import { authLink } from "../constants";
import { CHAT, CONNECT } from "../types/MessageType";

export class GameManager {
    // variables
    private static client: GameManager;
    private playerWaiting: User | null;
    private games: Game[];
    private players: Set<string>;
    private idToGame: Map<string, Game>;

    // constructor
    constructor() {
        this.playerWaiting = null;
        this.games = [];
        this.players = new Set();
        this.idToGame = new Map();
    }

    // methods
    public static getInstance(): GameManager {
        if (!GameManager.client) {
            GameManager.client = new GameManager();
        }
        return GameManager.client;
    }

    // add a new player
    public async addPlayer(
        ws: WebSocket,
        message: ConnectMessage
    ): Promise<boolean> {
        // TODO:: Authenticate user here
        try {
            const isAuthenticated = await axios.post(authLink, {
                email: message.email,
                token: message.token,
            });
            if (isAuthenticated.status != 200) {
                ws.send(
                    JSON.stringify({
                        message: "Relogin",
                    })
                );
                ws.close();
                return false;
            }
            const newPlayer: User = {
                email: message.email,
                token: message.token,
                ws: ws,
            };
            if (!this.playerWaiting) {
                this.playerWaiting = newPlayer;
                ws.send(
                    JSON.stringify({
                        connected: true,
                    })
                );
            } else {
                // create a new game as we have both users authenticated
                const id =
                    (this.playerWaiting.email || "") + (newPlayer.email || "");
                console.log(id);
                const newGame = new Game(this.playerWaiting, newPlayer, id);
                this.games.push(newGame);
                this.idToGame.set(id, newGame);
                this.playerWaiting = null;
                // TODO:: Add this game to the database
            }
            this.players.add(newPlayer.email || "");
            return true;
        } catch (error: any) {
            console.log(error.message);
            ws.close();
            return false;
        }
    }

    addHandlers(ws: WebSocket) {
        ws.on("message", async (message) => {
            let messageType: ExchangeMessages;
            try {
                messageType = JSON.parse(message.toString());
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        message: "Invalid payload",
                    })
                );
                return;
            }
            if (messageType.type == CONNECT) {
                if (!messageType.connectPayload) {
                    ws.send(
                        JSON.stringify({
                            message: "invalid payload",
                        })
                    );
                    ws.close();
                    return;
                }
                if (!messageType.connectPayload.email) {
                    ws.send(
                        JSON.stringify({
                            message: "Invalid data",
                        })
                    );
                    ws.close();
                }
                if (this.players.has(messageType.connectPayload.email)) {
                    ws.send(
                        JSON.stringify({
                            message:
                                "There is an existing connection, close it first",
                        })
                    );
                    ws.close();
                }
                const connected = await this.addPlayer(
                    ws,
                    messageType.connectPayload
                );
                if (!connected) {
                    return;
                }
            } else if (messageType.type == CHAT) {
                if (!messageType.chatPayload) {
                    ws.send(
                        JSON.stringify({
                            message: "invalid payload",
                        })
                    );
                    return;
                }
                // find the game
                const requiredGame = this.games.find(
                    (game) => game.id === messageType.chatPayload?.gameId
                );
                if (!requiredGame) {
                    return;
                }
                requiredGame.sendTextMessage(
                    messageType.chatPayload.message,
                    ws
                );
            } else {
                ws.close();
            }
        });
    }
}
// normal connect wont add the player u need to send auth information with it
// TODO:: already in a game logic
