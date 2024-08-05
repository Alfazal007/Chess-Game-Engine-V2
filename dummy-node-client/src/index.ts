import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import express from "express";
import { ProtoGrpcType } from "./generated/create-game";
import { GameHandlerClient } from "./generated/GameHandler";

const packageDefinitionGame = protoLoader.loadSync(
    path.join(__dirname, "../proto/create-game.proto")
);
const createGame = (gameData: {
    id: string;
    playerId1: string;
    playerId2: string;
}) => {
    return new Promise((resolve, reject) => {
        gameStub.CreateGame(gameData, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

const gameProto = grpc.loadPackageDefinition(
    packageDefinitionGame
) as unknown as ProtoGrpcType;

const gameStub: GameHandlerClient = new gameProto.GameHandler(
    "localhost:8004",
    grpc.credentials.createInsecure()
);

const app = express();
app.use(express.json());

const port = 8005;
let orders = {};

async function processAsync() {
    const res = await createGame({
        id: "someone1@gmail.comsomeone2@gmail.com",
        playerId1: "6c4936b1-af00-46ad-a1bf-4e3cda8da730",
        playerId2: "c987b5d5-d56a-436c-b957-25eb9ec77b35",
    });

    console.log({ res });
    console.log("ITachi");
}

processAsync();

app.listen(port, () => {
    console.log(`API is listening on port ${port}`);
});
