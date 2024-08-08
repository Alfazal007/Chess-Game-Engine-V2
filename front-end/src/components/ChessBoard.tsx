import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { Dispatch, SetStateAction, useState } from "react";

export const ChessBoard = ({
    board,
    chess,
    setBoard,
}: // socket,
{
    // socket: WebSocket;
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
                                                // socket.send(
                                                //     JSON.stringify({
                                                //         type: MoveType,
                                                //         payload: {
                                                //             from,
                                                //             to: squareRepresentation,
                                                //         },
                                                //     })
                                                // );

                                                chess.move({
                                                    from,
                                                    to: squareRepresentation,
                                                });
                                                // console.log(chess.isGameOver());
                                                setBoard(chess.board());
                                                // TODO:: send data over the websocket
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
