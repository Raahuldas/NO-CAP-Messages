'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { signupSchema } from "@/schemas/signupSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation"

function Page() {
    const { toast } = useToast();
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isUsernameChecking, setIsUsernameChecking] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debouncedUsername = useDebounceCallback(setUsername,500);
    const router = useRouter();

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        console.log("this is working");
        
        const checkUsernameUniqueness = async () => {
            if (username) {
                setIsUsernameChecking(true);
                setUsernameMessage("");

                try {
                    const response = await axios.get(`/api/unique-username?username=${username}`);
                    console.log(response);

                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    console.log(axiosError.response?.data.message);
                    
                    setUsernameMessage(axiosError.response?.data.message ?? "Error while checking username")
                } finally{
                    setIsUsernameChecking(false)
                }
            }else{
                setUsernameMessage("")
            }
        } 
        checkUsernameUniqueness()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/signup", data);
            console.log(response);
            toast({
                title: "Success",
                description: response.data.message
            })

            router.replace(`/verify/${username}`);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            console.log("There was a problem with your signup!, please try again.", errorMessage);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="border p-12 rounded w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                <h1 className="">Signup</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username..." {...field}
                                        onChange={(e)=>{
                                            field.onChange(e);
                                            debouncedUsername(e.target.value)
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                    <div className={` ${usernameMessage == "Username is available"?"text-green-500":"text-red-500"} text-sm px-1`}>{usernameMessage}</div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit">
                            {
                                isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page