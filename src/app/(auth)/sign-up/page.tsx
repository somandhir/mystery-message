"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [debouncedUsername] = useDebounceValue(username, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success("Account created", { description: response.data.message });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Signup failed", {
        description:
          axiosError.response?.data?.message ?? "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative flex justify-center items-center min-h-screen ${COLORS.background} px-4 overflow-hidden`}
    >
      {/* Background Visuals */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-glow pointer-events-none" />

      <div
        className={`relative w-full max-w-md p-10 space-y-8 ${COLORS.card} rounded-2xl border ${COLORS.border} shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in duration-500`}
      >
        <div className="text-center space-y-2">
          <h1
            className={`text-4xl font-bold tracking-tighter lg:text-5xl ${COLORS.textMain}`}
          >
            Join Mystery Message
          </h1>
          <p className={`text-sm ${COLORS.textMuted}`}>
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${COLORS.textMain} text-xs uppercase tracking-widest font-bold`}
                  >
                    Username
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className={`${COLORS.input} border-zinc-800 focus:border-white focus:ring-0 transition-all text-zinc-100`}
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                      />
                      {isCheckingUsername && (
                        <Loader2 className="absolute right-3 top-3 animate-spin h-4 w-4 text-zinc-500" />
                      )}
                    </div>
                  </FormControl>
                  {usernameMessage && (
                    <p
                      className={`text-[11px] mt-1 font-semibold tracking-tight ${usernameMessage === "username is unique" ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${COLORS.textMain} text-xs uppercase tracking-widest font-bold`}
                  >
                    Email
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
                  <FormLabel
                    className={`${COLORS.textMain} text-xs uppercase tracking-widest font-bold`}
                  >
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
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className={`text-xs ${COLORS.textMuted}`}>
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="text-white font-bold hover:underline underline-offset-4"
            >
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
