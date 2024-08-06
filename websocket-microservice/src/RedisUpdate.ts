import { client } from "./index";
import { MOVE } from "./types/MessageType";

export async function updateRedis(
    from: string,
    to: string,
    gameId: string,
    color: string,
    typeOfInformation: string
) {
    try {
        if (typeOfInformation == MOVE) {
            await client.lPush(
                "move",
                JSON.stringify({
                    typeOfInformation,
                    from,
                    to,
                    gameId,
                    color,
                    timestamp: new Date().getTime().toString(),
                })
            );
        }
    } catch (error) {
        console.error("Redis error:", error);
    }
}
