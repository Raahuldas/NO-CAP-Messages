'use client'

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { messageSchema } from "@/schemas/messageSchema"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import axios, { AxiosError } from "axios"
import { useToast } from "@/components/ui/use-toast"
import { ApiResponse } from "@/types/ApiResponse"

function Page() {
  const params = useParams<{ username: string }>()
  const username = params.username;
  const {toast} =useToast()

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  })

  const onSubmit = async (data : z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post("/api/send-message",{...data, username});
      console.log(response);
      toast({
        title: "Message sent successfully",
        description: response.data.message
      })
      form.reset({...form.getValues(),content: ""});
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="w-2/3 mx-auto">
      <h1 className='text-center text-5xl font-bold my-8'>Public Profile Link</h1>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Write your anonymous message here"
                      {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-center">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page