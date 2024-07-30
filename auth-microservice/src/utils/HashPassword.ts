import bcrypt, { hash } from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    return isPasswordCorrect;
}

export { hashPassword, comparePassword };
