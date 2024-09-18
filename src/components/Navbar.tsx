'use client'

import { z } from 'zod';
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { User } from 'next-auth';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from './ui/input';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUsernameSchema } from '@/schemas/updateUsernameSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from './ui/use-toast';
import { useDebounceCallback } from 'usehooks-ts'

function Navbar() {
    // const [usernameSheet, setUsernameSheet] = useState(false);

    const { data: session } = useSession();

    const user: User = session?.user;

    const [usernameMessage, setUsernameMessage] = useState("");
    const [username, setUsername] = useState("");
    const debouncedUsername = useDebounceCallback(setUsername, 500);

    const form = useForm<z.infer<typeof updateUsernameSchema>>({
        resolver: zodResolver(updateUsernameSchema),
        defaultValues: {
            username: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof updateUsernameSchema>) => {
        try {
            const res = await axios.post("/api/update-username", data);
            console.log(res);
            toast(
                {
                    title: "Username updated successfully",
                    description: "You will be logged out. please login again."
                }
            )
            setTimeout(() => {
                signOut();
            }, 3000);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            console.log("Error updating username", errorMessage);

        }
    }

    useEffect(() => {
        if (username) {
            const checkUsernameUnique = async () => {
                try {
                    const res = await axios.get(`/api/unique-username?username=${username}`);
                    console.log(res.data.message);
                    setUsernameMessage(res.data.message);

                } catch (error) {
                    console.log(error);
                    const axiosError = error as AxiosError<ApiResponse>;
                    const errorMessage: string = axiosError.response?.data.message as string;
                    console.log(axiosError.response?.data.message, "error message");

                    setUsernameMessage(errorMessage)
                }
            }
            checkUsernameUnique();
        } else {
            setUsernameMessage("")
        }
    }, [username]);

    return (
        <div className='px-1 lg:px-8 py-1 lg:py-3 mx-auto shadow-md bg-slate-900'>
            <div className="flex items-center justify-between w-full">
                <Link href="/">
                    <Button className="border border-gray-900 py-1 md:py-2 md:px-3 rounded-sm bg-slate-600 hover:bg-slate-500 cursor-pointer">
                        🧢 NO-CAP
                    </Button>
                </Link>
                <div className="uppercase text-white px-1 text-center">
                    {user && "Welcome, " + (user.username || user.name)}
                </div>
                <div>
                    {
                        user ?
                            <DropdownMenu>
                                <DropdownMenuTrigger className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold group shadow-sm ring-1 ring-inset ring-zinc-700 hover:bg-gray-50 ">
                                    <EllipsisHorizontalIcon className='size-6 text-white hover:text-zinc-800 group-hover:text-black' />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent >
                                    <DropdownMenuItem>
                                        <a
                                            href="#"
                                            aria-disabled="true"
                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                        >
                                            Account settings
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem >
                                        <Sheet>
                                            <SheetTrigger onClick={(e) => {
                                                e.stopPropagation();
                                                // setUsernameSheet(true)
                                            }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 data-[focus]:bg-gray-100 data-[focus]:text-gray-900">
                                                Update Username
                                            </SheetTrigger>
                                            
                                                <SheetContent side={'bottom'}>
                                                    <SheetHeader>
                                                        <SheetTitle>Update Username</SheetTitle>
                                                        <SheetDescription>
                                                            Update your username. Click save when you're done.
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <div className="grid gap-4 py-4 w-full sm:w-1/2 mx-auto">
                                                        <Form {...form}>
                                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="username"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Username</FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    placeholder="New Username..."
                                                                                    {...field}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e);
                                                                                        debouncedUsername(e.target.value)
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormDescription className={`${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>
                                                                                {usernameMessage}
                                                                            </FormDescription>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <Button type="submit" disabled={usernameMessage === "Username is available" ? false : true} >Save</Button>
                                                            </form>
                                                        </Form>

                                                    </div>
                                                </SheetContent>
                                        </Sheet>

                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <button
                                            onClick={() => signOut()}
                                            className=" w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-red-200 data-[focus]:text-gray-900"
                                        >
                                            Sign out
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            :
                            <Link href="/signin">
                                <Button className='bg-slate-700 hover:bg-slate-600'>
                                    Login
                                </Button>
                            </Link>
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar