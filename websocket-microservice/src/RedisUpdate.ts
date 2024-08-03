import { client } from "./index";
import { MOVE } from "./types/MessageType";

export async function updateRedis(
    from: string,
    to: string,
    gameId: string,
    color: string,
    type: string,
    player1Email: string = "",
    player2Email: string = ""
) {
    try {
        if (type == MOVE) {
            await client.lPush(
                "move",
                JSON.stringify({
                    type,
                    from,
                    to,
                    gameId,
                    color,
                    timestamp: new Date().getTime(),
                })
            );
        } else {
            await client.lPush(
                "move",
                JSON.stringify({
                    type,
                    gameId,
                    player1Email,
                    player2Email,
                    timestamp: new Date().getTime(),
                })
            );
        }
    } catch (error) {
        console.error("Redis error:", error);
    }
}
