import { User } from "@/App";
import { MOVE } from "@/messageTypes/simpleTypes";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { Dispatch, SetStateAction, useState } from "react";

export const ChessBoard = ({
    board,
    chess,
    user,
    setBoard,
    socket,
    gameId,
}: {
    gameId: string;
    user: User;
    socket: WebSocket;
    setBoard: Dispatch<
        SetStateAction<
            ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
        >
    >;
    chess: Chess;
    board:
        | ({
              square: Square;
              type: PieceSymbol;
              color: Color;
          } | null)[][];
}) => {
    const [from, setFrom] = useState<string | null>(null);
    const [to, setTo] = useState<string | null>(null);
    if (!socket) {
        return <div>Connecting...</div>;
    }
    return (
        <div>
            {board.map((row, i) => {
                return (
                    <div key={i} className="flex">
                        {row.map((square, j) => {
                            const squareRepresentation =
                                String.fromCharCode(97 + (j % 8)) +
                                "" +
                                (8 - i);
                            return (
                                <div
                                    key={j}
                                    className={`h-20 w-20 border  ${
                                        (i + j) % 2 == 0
                                            ? "bg-green-600"
                                            : "bg-white"
                                    }`}
                                    onClick={() => {
                                        console.log(
                                            "Clicked on ",
                                            squareRepresentation
                                        );
                                        if (!from) {
                                            setFrom(squareRepresentation);
                                        } else {
                                            setTo(squareRepresentation);
                                            try {
                                                socket.send(
                                                    JSON.stringify({
                                                        type: MOVE,
                                                        movePayload: {
                                                            from,
                                                            to: squareRepresentation,
                                                            gameId: gameId,
                                                        },
                                                    })
                                                );
                                            } catch (err) {
                                                console.log(err);
                                            } finally {
                                                setFrom(null);
                                                setTo(null);
                                            }
                                        }
                                    }}
                                >
                                    {square == null ? (
                                        <></>
                                    ) : (
                                        <div className="h-full">
                                            <img
                                                className="h-full"
                                                src={
                                                    "/assets/" +
                                                    square.color +
                                                    square.type +
                                                    ".png"
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
