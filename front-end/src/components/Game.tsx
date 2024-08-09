import { User } from "@/App";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { ChessBoard } from "./ChessBoard";
import { useSocket } from "@/hooks/useSocket";
import { Button } from "./ui/button";
import {
    CHAT,
    CONNECT,
    Game_Over,
    MOVE,
    START,
} from "@/messageTypes/simpleTypes";

const Game = ({ user }: { user: User | null }) => {
    const socket = useSocket();
    const navigate = useNavigate();
    const [chess, setChess] = useState<Chess>(new Chess());
    const [board, setBoard] = useState<
        | ({
              square: Square;
              type: PieceSymbol;
              color: Color;
          } | null)[][]
    >(chess.board());
    const [gameId, setGameid] = useState("");
    const [started, setStarted] = useState(false);
    useEffect(() => {
        if (!user) {
            navigate("/signin");
            return;
        }
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            console.log({ event });
            const message = JSON.parse(event.data);
            console.log({ message });
            switch (message.type) {
                case START:
                    // setBoard(chess.board());
                    setGameid(message.gameId);
                    setStarted(true);
                    console.log("Init game");
                    break;
                case MOVE:
                    // const move = message.payload;
                    chess.move(message.payload);
                    setBoard(chess.board());
                    console.log("Movement made");
                    break;
                case Game_Over:
                    console.log("Game over");
                    navigate("/");
                    break;
                case CHAT:
                    console.log(message.message);
            }
        };
    }, [socket]);

    if (!socket || !user) return <div>Connecting </div>;

    return (
        <div className="pl-6 pt-6 bg-slate-800 h-screen">
            <div>
                <ChessBoard
                    chess={chess}
                    user={user}
                    board={board}
                    setBoard={setBoard}
                    gameId={gameId}
                    socket={socket}
                />
            </div>
            <div>
                <Button
                    onClick={() => {
                        socket.send(
                            JSON.stringify({
                                type: CONNECT,
                                connectPayload: {
                                    email: user.email,
                                    token: user.accessToken,
                                },
                            })
                        );
                    }}
                >
                    Start game
                </Button>
            </div>
        </div>
    );
};

export default Game;
