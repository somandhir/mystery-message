"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { COLORS } from "@/lib/colors";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true); // START LOADING
    
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    setIsSubmitting(false); // STOP LOADING

    if (result?.error) {
      // Handle different types of errors (Wrong password vs User not found)
      if (result.error === 'CredentialsSignin') {
        toast.error("Login Failed", { description: "Incorrect username or password" });
      } else {
        toast.error("Error", { description: result.error });
      }
    }

    if (result?.url) {
      toast.success("Welcome back!");
      router.replace("/dashboard");
    }
  };

  return (
    <div className={`relative flex justify-center items-center min-h-screen ${COLORS.background} px-4 overflow-hidden`}>
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-glow pointer-events-none" />

      <div className={`relative w-full max-w-md p-10 space-y-8 ${COLORS.card} rounded-2xl border ${COLORS.border} shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in duration-500`}>
        
        <div className="text-center space-y-2">
          <h1 className={`text-4xl font-bold tracking-tighter lg:text-5xl ${COLORS.textMain}`}>
            Welcome Back
          </h1>
          <p className={`text-sm ${COLORS.textMuted}`}>
            Enter your credentials to access your messages.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${COLORS.textMain} text-xs uppercase tracking-widest font-bold`}>
                    Email / Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`${COLORS.input} border-zinc-800 focus:border-white text-zinc-100`}
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${COLORS.textMain} text-xs uppercase tracking-widest font-bold`}>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`${COLORS.input} border-zinc-800 focus:border-white text-zinc-100`}
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className={`w-full py-6 mt-4 text-sm font-black uppercase tracking-widest transition-all ${COLORS.primary} ${COLORS.primaryHover} text-black rounded-md`}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Access Dashboard"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className={`text-xs ${COLORS.textMuted}`}>
            NEW TO MYSTERY?{" "}
            <Link href="/sign-up" className="text-white font-bold hover:underline underline-offset-4">
              CREATE AN ACCOUNT
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;