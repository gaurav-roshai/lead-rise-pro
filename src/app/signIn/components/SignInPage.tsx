"use client"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
})

export default function SigninPage() {
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully logged in");
          redirect("/dashboard");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    });
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <section className="flex h-screen font-sora">
      <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#1d91d8] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-white max-w-lg">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 mb-4">
             <Image
              src="/logo-lead.svg"
              alt="Logo"
              width={32}
              height={32}
              className="w-full h-full"
             />
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-0">
                  <span className="text-slate-800">Lead</span>
                  <span className="text-[#1D91D8]">Rise</span>
                  <sup className="text-xs ml-1 text-slate-600 font-medium">
                    Pro
                  </sup>
                </h1>
            </div>

          {/* Value Proposition */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Power your business with our 
              <span className="text-[#1d91d8]"> intelligent platform</span>
            </h2>
            
            <p className="text-xl text-slate-300 leading-relaxed">
              Join us to rely on our CRM platform to manage customer relationships, automate sales processes, and accelerate revenue growth.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#1d91d8] rounded-full"></div>
                <span className="text-slate-300">Advanced analytics and reporting</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#1d91d8] rounded-full"></div>
                <span className="text-slate-300">Great User Experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#1d91d8] rounded-full"></div>
                <span className="text-slate-300">Curated lead tracking for Startups</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">Powered by RoshAi</p>

          </div>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center items-center">
      <Card className="w-full max-w-md rounded-lg z-10">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Enter your information to login into an account
            </CardDescription>
	    		</CardHeader>
          <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-md flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl className="py-4 border-custom-black/40">
                      <Input
                        {...field}
                        type="johndoe@email.com"
                        placeholder="Email address"
                        className="placeholder:text-gray-500 font-light text-black bg-white"
                      />
                  </FormControl>
                </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl className="py-4 border-custom-black/40">
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                        className="placeholder:text-gray-500 text-black font-light bg-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="bg-[#1d91d8] hover:bg-gray-600 mt-5 py-5" type="submit">Login</Button>
              <div>
              <p className="text-xs text-center text-gray-500 mt-4">
                Don't have an account?
                <a href="/signUp" className="text-[#1d91d8] font-medium ml-1">
                  Sign Up
                </a>
              </p>
              </div>
            </form>
          </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}