"use client";
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
import { COLORS } from "@/lib/colors";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import * as z from "zod";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code/`, {
        username: params.username,
        code: data.code,
      });
      toast.success("Identity Verified", {
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Verification failed", {
        description:
          axiosError.response?.data?.message ?? "Invalid or expired code",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/resend-code", {
        username: params.username,
      });
      toast.success("new code sent", {
        description: "Please check your email for the fresh verification code.",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Resend failed", {
        description:
          axiosError.response?.data?.message ?? "Could not send code.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className={`relative flex justify-center items-center min-h-screen ${COLORS.background} px-4 overflow-hidden`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-glow pointer-events-none" />

      <div
        className={`relative w-full max-w-md p-10 space-y-8 ${COLORS.card} rounded-2xl border ${COLORS.border} shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in duration-500`}
      >
        <div className="text-center space-y-2">
          <h1
            className={`text-4xl font-bold tracking-tighter lg:text-5xl ${COLORS.textMain}`}
          >
            Secure Entry
          </h1>
          <p className={`text-sm ${COLORS.textMuted}`}>
            Verifying account for{" "}
            <span className="text-white font-mono">@{params.username}</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${COLORS.textMain} text-xs uppercase tracking-widest font-bold`}
                  >
                    6-Digit Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`${COLORS.input} border-zinc-800 focus:border-white text-center text-2xl tracking-[0.5em] font-mono h-14 text-zinc-100`}
                      placeholder="000000"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={`w-full py-6 text-sm font-black uppercase tracking-widest transition-all ${COLORS.primary} ${COLORS.primaryHover} text-black rounded-md`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Verify Identity"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className={`text-xs ${COLORS.textMuted}`}>
            DIDN'T RECEIVE THE CODE?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-white font-bold hover:underline underline-offset-4"
            >
              {isResending ? "sending..." : "RESEND"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
