'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/models/user.model"
import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { Loader2, RefreshCw } from "lucide-react"



function Page() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshMessages,setRefreshMessages] = useState(false);
  const { data: session } = useSession();

  const user = session?.user as User;

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages");

  useEffect(() => {
  const fetchAcceptMessage = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      console.log(response);
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive"
      })
    }
  }

    fetchAcceptMessage()
  },[setValue, toast])

  let profileUrl: string ="";
  
  if (typeof window != "undefined") {
    const baseUrl = `${window.location.protocol}/${window.location.host}`;
    if (user?.name) {
      profileUrl = `${baseUrl}/u/${user.name}`
    } else {
      profileUrl = `${baseUrl}/u/${user?.username}`
    }
  }
    
  const onMessageDelete = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const handleAcceptMessages = async (data:boolean) => {
    console.log(data, 'data');
    try {
      const response = await axios.post("/api/accept-messages", { acceptMessages: data })
      console.log(response);
      setValue('acceptMessages', data);

      toast({
        title: "Accept message status updated",
      })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error switching message acceptance status",
        description: axiosError.response?.data.message
      })
    }

  }

  const getMessages = useCallback(async () => {
    setRefreshMessages(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-message");
      setMessages(response.data.messages || []);
      
      toast({
        title: "Messages refreshed"
      })
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Failed to fetch messages",
        description: axiosError.response?.data.message,
        variant: "destructive"
      })
    } finally{
      setRefreshMessages(false)
    }
  },[toast])
  
  useEffect(() => {
    if (!session || !session.user) return;
    getMessages();
  }, [session,getMessages])

  if (!session || !session.user) {
    return <div></div>
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied to clipboard"
    })
  }

  return (
    <div className='p-6 mx-auto bg-slate-50 min-h-[42rem]' >
      <div className="w-full md:w-2/3 mx-auto">
        <h1 className="font-bold text-4xl pt-6 text-center mb-8">
          User Dashboard
        </h1>

        <div className="flex w-full items-center my-8 ">
          <Input type="text" value={profileUrl} className=" bg-gray-200 mr-1" readOnly />
          <Button type="submit" onClick={copyToClipboard}>Copy</Button>
        </div>

        <div className="my-8 flex items-center gap-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleAcceptMessages} />
          <span className="">
            Accept Messages
          </span>
        </div>

        <Separator className="mb-4"/>
        <Button 
        variant="outline"
        onClick={getMessages} >
          {
            refreshMessages? <Loader2 className="animate-spin"/> : <RefreshCw/>
          }
        </Button>

        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.length > 0 ? messages.map((message) =>
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={onMessageDelete}
            />
          ) :
            <div>No message to display</div>
          }
        </div>

      </div>
    </div>
  )
}

export default Page