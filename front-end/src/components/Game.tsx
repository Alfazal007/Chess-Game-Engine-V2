import { User } from "@/App";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Game = ({ user }: { user: User | null }) => {
    console.log({ accessToken: Cookies.get("accessToken") });
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/signin");
        }
    }, []);
    return <div>This is a game page</div>;
};

export default Game;
