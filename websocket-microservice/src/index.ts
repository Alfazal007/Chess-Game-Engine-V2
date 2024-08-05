import { WebSocketServer } from "ws";
import { configDotenv } from "dotenv";
import { GameManager } from "./utils/GameManager";
import { createClient } from "redis";
import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import path from "path";
import { ProtoGrpcType } from "./generated/create-game";
import { GameHandlerClient } from "./generated/GameHandler";

const packageDefinitionGame = protoLoader.loadSync(
    path.join(__dirname, "../proto/create-game.proto")
);

const gameProto = grpc.loadPackageDefinition(
    packageDefinitionGame
) as unknown as ProtoGrpcType;

const gameStub: GameHandlerClient = new gameProto.GameHandler(
    "localhost:8004",
    grpc.credentials.createInsecure()
);

configDotenv();

const wss = new WebSocketServer({ port: 8001 });
const gameManager = GameManager.getInstance(gameStub);

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
