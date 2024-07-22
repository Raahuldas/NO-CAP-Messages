'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { User } from "next-auth"
import { useSession } from "next-auth/react"


function page() {
const {toast} = useToast()
  const {data : session} = useSession();

  console.log(session);
  
  const user = session?.user as User;

  const baseUrl = `${window.location.protocol}/${window.location.host}`;
  let profileUrl;
  if (user?.name) {
    profileUrl = `${baseUrl}/u/${user.name}`
  }else{
     profileUrl = `${baseUrl}/u/${user?.username}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title:"Copied to clipboard"
    })
  }
  

  return (
    <div className='p-6 mx-auto bg-slate-50 min-h-[42rem]' >
      <div className="w-2/3 mx-auto">
        <h1 className="font-bold text-4xl pt-6 text-center mb-8">
          User Dashboard
        </h1>

        <div className="flex w-full items-center my-8 ">
          <Input type="text" value={profileUrl} className=" bg-gray-200 mr-1" readOnly />
          <Button type="submit" onClick={copyToClipboard}>Copy</Button>
        </div>

        <Separator />
        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <MessageCard />
          <MessageCard />
          <MessageCard />
        </div>

      </div>
    </div>
  )
}

export default page