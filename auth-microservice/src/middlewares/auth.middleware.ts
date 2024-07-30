import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface User {
    id: string;
    username: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

const isLoggedIn = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let accessToken =
            req.cookies.accessToken || req.headers.authorization || "";
        if (!accessToken) {
            return res
                .status(403)
                .json(new ApiError(403, "Forbidden request! Re-login"));
        }
        if (accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.replace("Bearer ", "");
        }
        let userInfo;
        try {
            userInfo = jwt.verify(
                accessToken,
                process.env.ACCESSTOKENSECRET || ""
            ) as JwtPayload;
        } catch (error) {
            return res
                .status(403)
                .json(
                    new ApiError(
                        403,
                        "Forbidden request! Re-login Invalid jwt Or Refresh Tokens"
                    )
                );
        }
        const userOfThisToken = await prisma.user.findFirst({
            where: {
                AND: [{ id: userInfo.id }, { email: userInfo.email }],
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });

        if (!userOfThisToken) {
            return res
                .status(403)
                .json(
                    new ApiError(
                        403,
                        "Forbidden request! Re-login No user with this token in DB"
                    )
                );
        }
        req.user = userOfThisToken;
        return next();
    }
);

export { isLoggedIn };
