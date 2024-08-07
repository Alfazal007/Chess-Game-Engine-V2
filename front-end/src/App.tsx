import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { LandingPage } from "./components/LandingPage";
import { SignUp } from "./components/Signup";
import { useEffect, useState } from "react";
import { SignIn } from "./components/Signin";
import Game from "./components/Game";

export interface User {
    accessToken: string;
    refreshToken: string;
    username: string;
    id: string;
    email: string;
}

function App() {
    const [user, setUser] = useState<User | null>(null);

    const router = createBrowserRouter([
        {
            path: "/signup",
            element: <SignUp />,
        },
        {
            path: "/signin",
            element: <SignIn user={user} setUser={setUser} />,
        },
        {
            path: "/",
            element: <LandingPage user={user} />,
        },
        {
            path: "/game",
            element: <Game user={user} />,
        },
    ]);
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
