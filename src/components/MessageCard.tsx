import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Message } from "@/models/user.model"
import dayjs from "dayjs"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type messageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}
function MessageCard({ message, onMessageDelete }: messageCardProps) {
    const { toast } = useToast()
    const handleDeleteMessage = async () => {
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`);
            console.log(response);

            onMessageDelete(message._id as string)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "message deleted successfully",
                description: axiosError.response?.data.message
            })
        }
    }
    return (
        <Card>
            <CardHeader className="flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <CardTitle>
                        {message.content}
                    </CardTitle>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardDescription>
                    {dayjs(message.createdAt).format('hh:mm A, DD-MM-YYYY')}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}

export default MessageCard