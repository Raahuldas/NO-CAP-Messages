'use client'

import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import { User } from 'next-auth';
import Link from 'next/link';

function Navbar() {
    const {data: session} = useSession();
    
    const user: User = session?.user
    return (
        <div className='px-8 py-3 mx-auto shadow-md bg-slate-900 '>
            <div className="flex items-center justify-between">
                <Link href="/" className="border py-2 px-3 rounded-sm bg-slate-300 cursor-pointer">
                🧢 NO-CAP 
                </Link>
                <div className="uppercase text-white ">
                     {user && "Welcome, " + (user.username || user.name)}
                </div>
                <div>
                    <Button className='bg-slate-700 hover:bg-red-600' onClick={() => signOut()}>
                        LogOut
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Navbar