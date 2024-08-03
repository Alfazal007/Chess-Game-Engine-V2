import { WebSocketServer } from "ws";
import { configDotenv } from "dotenv";
import { GameManager } from "./utils/GameManager";
import { createClient } from "redis";
configDotenv();

const wss = new WebSocketServer({ port: 8001 });
const gameManager = GameManager.getInstance();
const client = createClient({
    url: process.env.REDIS_URL,
});
redisClientHandler();

function redisClientHandler() {
    client
        .connect()
        .then(() => {
            console.log("connected redis successfully");
        })
        .catch((err) => {
            console.log(err);
        });
}

wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    gameManager.addHandlers(ws);

    ws.send("something");
});

export { client };
