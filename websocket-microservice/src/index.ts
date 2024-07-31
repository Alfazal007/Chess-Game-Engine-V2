import { WebSocketServer } from "ws";
import { configDotenv } from "dotenv";
import { GameManager } from "./utils/GameManager";
configDotenv();

const wss = new WebSocketServer({ port: 8001 });
const gameManager = GameManager.getInstance();

wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    gameManager.addHandlers(ws);

    ws.send("something");
});
