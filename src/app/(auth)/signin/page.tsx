'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import axios, { AxiosError } from 'axios'
import { useState } from "react"

import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/schemas/signInschema"
import { signIn } from "next-auth/react"



const page = () => {
  
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  
  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    const result = await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password
    })
    if(result?.error){
      if(result.error == 'CredentialsSignin'){
        toast('Failed',{
          description:"Login Failed"       
        })
      }
    }
    if(result?.url){
      router.replace('/dashboard')
    }
    
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Being Anonymous 
          </h1>
          <p className="mb-4 text-2xl">Sign In</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/username</FormLabel>
                    <Input placeholder="Email or username" {...field}
                    />
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
                  
                    <Input placeholder="password" {...field}
                    />
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  </>
                ):('Signup')
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page