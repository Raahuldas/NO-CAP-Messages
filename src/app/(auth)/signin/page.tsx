'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signinSchema } from '@/schemas/signinSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from "next-auth/react"
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';


function Page() {
    const {toast} = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof signinSchema>>(
        {
            resolver: zodResolver(signinSchema),
            defaultValues: {
                identifier: '',
                password: ''
            },
        }
    )

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        console.log("Result - ",result);
        

        if (result?.error) {
            console.log("Login error - ", result.error);
            //error message toast
            toast({
                title: "Error",
                description: result.error,
                variant: 'destructive'
            })
        }
        if (result?.url) {
            console.log(result.url);
            //redirect on dashboard
            router.replace("/dashboard")
        }
    }
    return (
        <div className="min-h-screen flex justify-center items-center bg-zinc-900">
            <div className="border p-12 rounded w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white ">
                <h1 className="font-semibold text-3xl text-center mb-2 drop-shadow-md">Signin</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username/Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username/Email" {...field}  />
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
                            Submit
                        </Button>
                        <Button className='w-full' type='button' onClick={() => signIn('google')}> Signin with Google</Button>
                    </form>
                </Form>
                <p className="mt-2 text-center ">Not a member? <a href="/signup" className="font-medium text-blue-600">Signup</a></p>
            </div>
        </div>
    )
}

export default Page