import { User } from "@/App";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { ChessBoard } from "./ChessBoard";
import { useSocket } from "@/hooks/useSocket";

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

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case Init_Game:
                    setBoard(chess.board());
                    setStarted(true);
                    console.log("Init");
                    break;
                case MoveType:
                    // const move = message.payload;
                    chess.move(message.payload);
                    setBoard(chess.board());
                    console.log("Movement made");
                    break;
                case Game_Over:
                    console.log("Game over");
                    break;
            }
        };
    }, [socket]);

    if (!socket) return <div>Connecting </div>;

    return (
        <div className="pl-6 pt-6 bg-slate-800 h-screen">
            <div>
                <ChessBoard chess={chess} board={board} setBoard={setBoard} />
            </div>
            <div>{/* add play button here */}</div>
        </div>
    );
};

export default Game;

// const onClick = async () => {
//     const res = await axios.get("http://localhost:8000/user/current-user", {
//         headers: {
//             Authorization: `Bearer ${user?.accessToken}`,
//         },
//     });
//     console.log({ res });
// };
