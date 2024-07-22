'use client'

import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import { User } from 'next-auth';

function Navbar() {
    const {data: session, status} = useSession();
    console.log(session,"session");
    console.log(status,"status");
    
    const user: User = session?.user
    return (
        <div className='px-8 py-3 mx-auto shadow-md'>
            <div className="flex items-center justify-between">
                <div className="border py-2 px-3 rounded-sm bg-slate-300">
                🧢 NO-CAP 
                </div>
                <div className="uppercase">
                     {user && "Welcome, " + (user.username || user.name)}
                </div>
                <div>
                    <Button className='bg-slate-800 hover:bg-red-600' onClick={() => signOut()}>
                        LogOut
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Navbar