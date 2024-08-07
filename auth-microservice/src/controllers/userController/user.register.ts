import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { registerUserType } from "../../zodTypes/registerUserType";
import { prisma } from "../../utils/prisma";
import { hashPassword } from "../../utils/HashPassword";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const result = registerUserType.safeParse(body);
    if (!result.success) {
        const errors: string[] = [];
        result.error.errors.map((err) => {
            errors.push(err.message);
        });
        return res
            .status(400)
            .json(new ApiError(400, "Invalid input data", errors));
    }
    // the data provided is ok proceed further to talk to the database
    try {
        const userFromDB = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: result.data.username,
                    },
                    {
                        email: result.data.email,
                    },
                ],
            },
        });
        if (userFromDB) {
            return res
                .status(400)
                .json(
                    new ApiError(
                        400,
                        "User with same username or email exists",
                        []
                    )
                );
        }

        // hash the password
        const hashedPassword = await hashPassword(result.data.password);
        try {
            const newUser = await prisma.user.create({
                data: {
                    email: result.data.email,
                    password: hashedPassword,
                    username: result.data.username,
                },
                select: {
                    email: true,
                    username: true,
                    id: true,
                    refreshToken: true,
                },
            });
            if (!newUser) {
                return res
                    .status(400)
                    .json(
                        new ApiError(400, "Issue talking to the database", [])
                    );
            }
            return res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        "New User created successfully",
                        newUser
                    )
                );
        } catch (err) {
            return res
                .status(400)
                .json(
                    new ApiError(
                        400,
                        "There was an issue talking to the database",
                        []
                    )
                );
        }
    } catch (err: any) {
        console.log(err.message);
        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "There was an issue talking to the database",
                    []
                )
            );
    }
});

export { registerUser };
