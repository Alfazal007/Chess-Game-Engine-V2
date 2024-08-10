import { WebSocket } from "ws";
import { User } from "./User";
import { Game } from "./Game";
import { ConnectMessage, ExchangeMessages } from "../types/MessageInterfaces";
import axios from "axios";
import { authLink } from "../constants";
import { CHAT, CONNECT, Game_Over, MOVE, START } from "../types/MessageType";
import { updateRedis } from "../RedisUpdate";
import { GameHandlerClient } from "../generated/GameHandler";

export class GameManager {
    // variables
    private static client: GameManager;
    private playerWaiting: User | null;
    private games: Game[];
    private players: Set<string>;
    private idToGame: Map<string, Game>;
    private static gameStub: GameHandlerClient;

    // constructor
    constructor(gameStub: GameHandlerClient) {
        this.playerWaiting = null;
        this.games = [];
        this.players = new Set();
        this.idToGame = new Map();
        if (!GameManager.gameStub) {
            GameManager.gameStub = gameStub;
        }
    }

    private static createGame = (gameData: {
        id: string;
        playerId1: string;
        playerId2: string;
    }) => {
        return new Promise((resolve, reject) => {
            GameManager.gameStub.CreateGame(gameData, (error, response) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    };

    // methods
    public static getInstance(gameStub: GameHandlerClient): GameManager {
        if (!GameManager.client) {
            GameManager.client = new GameManager(gameStub);
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
                    (this.playerWaiting.email || "") +
                    "::" +
                    (newPlayer.email || "");
                // make the grpc call to create a new game and if it successful only then create one here
                try {
                    const res: any = await GameManager.createGame({
                        id,
                        playerId1: this.playerWaiting.email || "",
                        playerId2: newPlayer.email || "",
                    });
                    if (!res || !res.created || res.created != true) {
                        ws.close();
                        return false;
                    }
                } catch (err) {
                    ws.close();
                    return false;
                }
                const newGame = new Game(this.playerWaiting, newPlayer, id);
                this.games.push(newGame);
                this.idToGame.set(id, newGame);
                // await updateRedis("", "", id, "", START);
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
            } else if (messageType.type == MOVE) {
                // check for move payload
                if (!messageType.movePayload) {
                    ws.send(
                        JSON.stringify({
                            message: "invalid payload",
                        })
                    );
                    return;
                }
                // check for valid and complete data
                if (
                    !messageType.movePayload.from ||
                    messageType.movePayload.from.trim() == "" ||
                    !messageType.movePayload.to ||
                    messageType.movePayload.to.trim() == "" ||
                    !messageType.movePayload.gameId ||
                    messageType.movePayload.gameId.trim() == ""
                ) {
                    ws.send(
                        JSON.stringify({
                            message: "invalid payload",
                        })
                    );
                    return;
                }
                // find the required game
                const requiredGame = this.games.find(
                    (game) => game.id == messageType.movePayload?.gameId
                );
                if (!requiredGame) {
                    ws.send(
                        JSON.stringify({
                            message: "invalid game",
                        })
                    );
                    return;
                }
                // check if it is this players game
                if (
                    requiredGame.player1.ws != ws &&
                    requiredGame.player2.ws != ws
                ) {
                    ws.send(
                        JSON.stringify({
                            message: "You are not part of this game",
                        })
                    );
                    return;
                }
                await requiredGame.makeMove(
                    messageType.movePayload.from,
                    messageType.movePayload.to,
                    ws
                );
                if (requiredGame.board.isGameOver()) {
                    this.games = this.games.filter(
                        (game) => game.id != requiredGame.id
                    );
                    this.players.delete(requiredGame.player1.email || "");
                    this.players.delete(requiredGame.player2.email || "");
                    requiredGame.player1.ws.send(
                        JSON.stringify({
                            type: Game_Over,
                            payload: {
                                winner:
                                    requiredGame.board.turn() === "w"
                                        ? "black"
                                        : "white",
                            },
                        })
                    );
                    requiredGame.player1.ws.close();
                    requiredGame.player2.ws.send(
                        JSON.stringify({
                            type: Game_Over,
                            payload: {
                                winner:
                                    requiredGame.board.turn() === "w"
                                        ? "black"
                                        : "white",
                            },
                        })
                    );
                    requiredGame.player2.ws.close();
                }
            } else {
                ws.close();
            }
        });
    }
}
// normal connect wont add the player u need to send auth information with it
// TODO:: already in a game logic
