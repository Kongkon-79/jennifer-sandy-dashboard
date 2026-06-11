"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long.",
    }),
    rememberMe: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });


const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const decodedEmail = decodeURIComponent(email || "")
  const router = useRouter();
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });


  const {mutate, isPending} = useMutation({
    mutationKey: ["reset-password"],
    mutationFn : async (values: {email:string, newPassword:string})=>{
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,{
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(values)
      })
      return res.json();
    },
    onSuccess: (data)=>{
      if(!data?.success){
        toast.error(data?.message || "Something went wrong");
        return
      }else{
        toast.success(data?.message || "Password reset successfully");
        router.push("/login")
      }
    }
  })
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload ={
      email: decodedEmail,
      newPassword: values?.password
    }
    mutate(payload)
  }
  return (
    <div className="w-full max-w-[496px] px-4">
      <div className="absolute top-8 right-8 hidden md:block">
        <Link href="/" className="text-sm text-gray-500 font-medium transition-colors hover:text-primary hover:underline">
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h3 className="text-3xl md:text-[36px] font-bold text-primary mb-2">
          Change Password
        </h3>
        <p className="text-sm md:text-base text-gray-500">
          Enter your email to recover your password
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Create New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="w-full h-[48px] text-base font-medium leading-[120%] text-black rounded-[8px] outline-none p-4 border border-gray-300 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
                      placeholder="********"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <Eye size={20} onClick={() => setShowPassword(!showPassword)} />
                      ) : (
                        <EyeOff
                          size={20}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={confirmShowPassword ? "text" : "password"}
                      className="w-full h-[48px] text-base font-medium leading-[120%] text-black rounded-[8px] outline-none p-4 border border-gray-300 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
                      placeholder="********"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600"
                    >
                      {confirmShowPassword ? (
                        <Eye size={20} onClick={() => setConfirmShowPassword(!confirmShowPassword)} />
                      ) : (
                        <EyeOff
                          size={20}
                          onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                        />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              disabled={isPending}
              className={`text-base font-medium text-white cursor-pointer leading-[120%] rounded-[8px] py-4 w-full h-[51px] transition-opacity ${
                isPending ? "opacity-50 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
              }`}
              type="submit"
            >
              {isPending ? "Loading..." : "Change Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
