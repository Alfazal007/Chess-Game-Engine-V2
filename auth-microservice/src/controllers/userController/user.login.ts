import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { loginUserType } from "../../zodTypes/loginUserType";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/prisma";
import { comparePassword } from "../../utils/HashPassword";
import {
    createAccessToken,
    createRefreshToken,
} from "../../utils/TokenHandlers";
import { ApiResponse } from "../../utils/ApiResponse";

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const result = loginUserType.safeParse(body);
    if (!result.success) {
        const errors: string[] = [];
        result.error.errors.map((err) => {
            errors.push(err.message);
        });
        return res
            .status(400)
            .json(new ApiError(400, "Invalid input data", errors));
    }
    try {
        const userFromDB = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: result.data.username,
                    },
                    {
                        email: result.data.username,
                    },
                ],
            },
        });
        if (!userFromDB) {
            return res.status(400).json(new ApiError(400, "User not found"));
        }
        const isPasswordCorrect = await comparePassword(
            result.data.password,
            userFromDB.password
        );
        if (!isPasswordCorrect) {
            return res
                .status(400)
                .json(new ApiError(400, "Incorrect password"));
        }
        // update refresh token and access tokens
        const accessToken = createAccessToken(userFromDB);
        const refreshToken = createRefreshToken(userFromDB);
        let userAfterUpdate;
        try {
            const updatedUser = await prisma.user.update({
                where: {
                    id: userFromDB.id,
                },
                data: {
                    refreshToken,
                },
                select: {
                    email: true,
                    username: true,
                    id: true,
                },
            });
            if (!updatedUser) {
                return res
                    .status(400)
                    .json(new ApiError(400, "Issue talking to the database"));
            }
            userAfterUpdate = updatedUser;
        } catch (err) {
            return res
                .status(400)
                .json(new ApiError(400, "Issue talking to the database"));
        }
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, "Login successful", {
                    accessToken,
                    refreshToken,
                    userAfterUpdate,
                })
            );
    } catch (err) {
        return res
            .status(400)
            .json(new ApiError(400, "Issue talking to the database", []));
    }
});

export { loginUser };
