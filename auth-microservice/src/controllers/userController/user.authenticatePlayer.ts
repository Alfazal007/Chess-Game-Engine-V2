import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../utils/prisma";

const authenticateCurrentUser = asyncHandler(
    async (req: Request, res: Response) => {
        const body: { email: string; token: string } = req.body;
        if (
            !body.email ||
            body.email.trim() == "" ||
            !body.token ||
            body.token.trim() == ""
        ) {
            return res.status(400).json({ isAuthenticated: false });
        }
        let userInfo;
        try {
            userInfo = jwt.verify(
                body.token,
                process.env.ACCESSTOKENSECRET || ""
            ) as JwtPayload;
        } catch (err) {
            return res.status(400).json({ isAuthenticated: false });
        }
        try {
            const user = await prisma.user.findFirst({
                where: {
                    AND: [{ id: userInfo.id }, { email: userInfo.email }],
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            });
            if (!user) {
                return res.status(400).json({ isAuthenticated: false });
            }
            if (user.email != body.email) {
                return res.status(400).json({ isAuthenticated: false });
            }
        } catch (err) {
            return res.status(400).json({ isAuthenticated: false });
        }
        return res.status(200).json({ isAuthenticated: true });
    }
);

export { authenticateCurrentUser };
