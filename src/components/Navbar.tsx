'use client'

import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import { User } from 'next-auth';
import Link from 'next/link';

function Navbar() {
    const { data: session } = useSession();

    const user: User = session?.user
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
                            <Button className='bg-slate-700 hover:bg-red-600' onClick={() => signOut()}>
                                LogOut
                            </Button>
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