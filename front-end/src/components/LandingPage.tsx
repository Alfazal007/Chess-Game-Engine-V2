import { User } from "@/App";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage = ({
    user,
}: {
    user: User | null;
}) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/signin")
        } else {
            console.log({ user })
        }
    }, [user])

    return (
        <div className="bg-slate-800 h-screen">
            <div className="pt-10 flex">
                <div className="ml-10">
                    <img src="/assets/landingboard.png" />
                </div>
                <div className="ml-10 ">
                    <p className="text-white font-bold pt-10 text-5xl">
                        Play Chess Online
                    </p>
                    <p className="text-white font-bold text-5xl ml-10">
                        on the #1 Site!
                    </p>
                    <button
                        onClick={() => { navigate("/game") }}
                        className="bg-button-green text-xl rounded-lg text-white h-16 w-40 ml-24 mt-2
                    "
                    >
                        Play Now
                    </button>
                </div>
            </div>
        </div>
    );
};
