'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

function page() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const params = useParams<{ username: string }>()

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post("/api/verify", {
                username: params.username,
                code: data.code
            })
            console.log(response);
            toast({
                title: "Success",
                description: response.data.message
            })

            router.replace("/signin")

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Verification Failed",
                description: axiosError?.response?.data.message ?? "Error, Try again",
                variant: "destructive"
            })
        }
    }
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="border p-12 rounded w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                <h1 className="">verify</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="OTP " {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page