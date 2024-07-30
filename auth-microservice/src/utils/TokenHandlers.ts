import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

function createAccessToken(user: User): string {
    const token = jwt.sign(
        {
            email: user.email,
            id: user.id,
        },
        process.env.ACCESSTOKENSECRET || "",
        {
            expiresIn: process.env.ACCESSTOKENEXPIRY,
        }
    );
    return token;
}

function createRefreshToken(user: User): string {
    const token = jwt.sign(
        {
            username: user.username,
            email: user.email,
            id: user.id,
        },
        process.env.REFRESHTOKENSECRET || "",
        {
            expiresIn: process.env.REFRESHTOKENEXPIRY,
        }
    );
    return token;
}

export { createAccessToken, createRefreshToken };
