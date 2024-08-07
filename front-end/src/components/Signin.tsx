import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { loginUserType } from "@/zodTypes/loginUserType";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useState } from "react";
import { User } from "@/App";

export const SignIn = ({
    user,
    setUser,
}: {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}) => {
    const navigate = useNavigate();
    const [isSending, setIsSending] = useState<boolean>(false);

    const form = useForm<z.infer<typeof loginUserType>>({
        resolver: zodResolver(loginUserType),
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof loginUserType>) {
        try {
            setIsSending(true);
            const res = await axios.post(
                "http://localhost:8000/user/login",
                values
            );
            console.log(res);
            if (res.status != 200) {
                toast({
                    title: "Issue signing in",
                    description: `${res.data.message}`,
                });
                return;
            }
            toast({
                title: "Signin successful",
            });
            console.log(res.data)
            setUser({
                accessToken: res.data.data.accessToken as string,
                refreshToken: res.data.data.refreshToken as string,
                email: res.data.data.userAfterUpdate.email as string,
                id: res.data.data.userAfterUpdate.id as string,
                username: res.data.data.userAfterUpdate.username as string,
            });
            navigate("/");
            // redirect to singin page
        } catch (err: any) {
            toast({
                title: "Issue signing in",
                description: `There was an error signing in ${err.message}`,
            });
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="md:border-2 p-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="w-60 md:w-96">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-12 md:text-xl"
                                                placeholder="username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-60 md:w-96">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="password"
                                                {...field}
                                                className="h-12 md:text-xl"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {!isSending && <Button type="submit">Login</Button>}
                    </form>
                </Form>
                <p>Don't have an account? <p className="text-blue-500 cursor-pointer" onClick={() => { navigate("/signup") }}>Signup</p></p>
            </div>
        </div>
    );
};
