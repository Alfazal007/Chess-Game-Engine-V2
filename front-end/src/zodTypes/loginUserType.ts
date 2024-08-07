import { z } from "zod";

export const loginUserType = z.object({
    username: z.string({ message: "Username or email is not provided" }),
    password: z
        .string({ message: "Password not provided" })
        .min(6, { message: "The length of password should be atleast 6" })
        .max(20, { message: "The length of password should be atmost 20" }),
});
