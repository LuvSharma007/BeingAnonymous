'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
import { Button } from "./button"
import {X} from 'lucide-react'
import { Message } from "@/model/User"
import { toast } from "sonner"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { any } from "zod"

type MessageCardProps = {
  message:Message
  onMessageDelete:(messageId:string) => void
}

const MessageCard = ({ message , onMessageDelete}:MessageCardProps) => {

  const handelDeleteConfirm = async ()=>{
    try {
      const response = await axios.delete<ApiResponse>(`/api/deleteMessage/${message._id}`)
      toast.success('Success',{
        description:response.data.message
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed",{
        description:axiosError.response?.data.message ?? 'Failed to delete message',
      })
    }
  }



  return (
      <Card>
      <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
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
          <AlertDialogAction onClick={handelDeleteConfirm} >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
      <p>Card Content</p>
      </CardContent>
      </Card>
  )
}

export default MessageCard