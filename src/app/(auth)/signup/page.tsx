'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import axios, { AxiosError } from 'axios'
import { useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input"



const page = () => {
  const [usernameMessage, setUsernameMessage] = useState('')
  const [loader, setLoader] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  
  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

const checkUsernameIsUnique = async (value: string) => {
  if (!value) return;

  setLoader(true);
  setUsernameMessage("");

  try {
    const res = await axios.get(`/api/checkUsernameUnique?username=${value}`);
    setUsernameMessage(res.data.message);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
    console.log("Error checking unique username", error);
  } finally {
    setLoader(false);
  }
};

const debouncedCheckUsername = useDebounceCallback(checkUsernameIsUnique, 500);


  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await axios.post<ApiResponse>('/api/signup', data)
      console.log(data);
      toast.success('Success', {
          description: "Signup Successful",
          className:"bg-green-700 text-white text-sm",
          duration:3000,
      })
      router.replace(`/verify/${data.username}`);

    } catch (error) {
      console.log("Error during signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast.error('Signup failed', {
        description: errorMessage,
        className:'bg-red-700 text-white text-sm',
        duration:5000,
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Being Anonymous 
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                    <Input placeholder="username" {...field}
                    onChange={(e)=>{
                      field.onChange(e)
                      debouncedCheckUsername(e.target.value)
                    }}
                    />
                    {loader && <Loader2 className="animate-spin"/>}
                    <p className={`text-sm ${usernameMessage === "Username is available" ? "text-green-400" : "text-red-600"}`}>{usernameMessage} </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  
                    <Input placeholder="email" {...field}/>
                    <p className='text-gray-400 text-sm'>We will send you a verification code</p>
                    <FormMessage/>
                  <FormControl/>
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
          <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page