import { useEffect, useState } from "react";

interface User {
    accessToken: string;
    refreshToken: string;
    username: string;
    id: string;
    email: string;
}

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        return () => {
            setUser(null);
        };
    }, [user]);
    return user;
};
