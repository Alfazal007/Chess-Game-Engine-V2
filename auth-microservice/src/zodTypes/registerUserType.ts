import { z } from "zod";

export const registerUserType = z.object({
    username: z
        .string({ message: "Username not provided" })
        .min(6, { message: "The length of username should be atleast 6" })
        .max(20, { message: "The length of username should be atmost 20" }),
    email: z.string({ message: "Email not provided" }).email({
        message: "Invalid email",
    }),
    password: z
        .string({ message: "Password not provided" })
        .min(6, { message: "The length of password should be atleast 6" })
        .max(20, { message: "The length of password should be atmost 20" }),
});
