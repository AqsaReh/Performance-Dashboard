"use client";
import React, { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteLogo } from "@/components/svg";
import { useMediaQuery } from "@/hooks/use-media-query";
import { env } from "process";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username is required." })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message:
        "Only letters, numbers, dots, dashes and underscores are allowed.",
    }),
  password: z.string().min(3, { message: "Password is required." }),
});
const LogInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [passwordType, setPasswordType] = useState("password");
  const [callbackUrl, setCallbackUrl] = useState("");
  
  useEffect(() => {
    const urlCallbackUrl = searchParams.get("callbackUrl");
    if (urlCallbackUrl) {
      setCallbackUrl(decodeURIComponent(urlCallbackUrl));
    } else {
      setCallbackUrl(withLang("capex/dashboard"));
    }
  }, [searchParams]);
  
  const lang = usePathname().split("/")[1] || "en";

  const withLang = (path: string) => `/${lang}/${path.replace(/^\/+/, "")}`.replace(/\/{2,}/g, "/");

  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  function mapNextAuthError(code?: string) {
    switch (code) {
      case "CredentialsSignin":
        return "Invalid username or password.";
      default:
        return "We couldn't sign you in. Please try again.";
    }
  }

  const onSubmit = (data: any) => {
    if (env.NEXT_PUBLIC_ENV === "development") {
      console.log(data);
    }
    startTransition(async () => {
      let response = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
        callbackUrl: callbackUrl,
      });
      if (response?.ok) {
        toast.success("Login Successful");
        // redirect to the callback URL
        router.push(callbackUrl);
        reset();
      } else if (response?.error) {
        try {
          const e = JSON.parse(response.error);
          toast.error(e.message || "Sign-in failed. Please try again.");
        } catch {
          // Fallback for generic codes like "CredentialsSignin"
          toast.error(mapNextAuthError(response.error));
        }
      }
    });
  };
  return (
    <div className="w-full ">
      <Link href="" className="inline-block">
        <SiteLogo className="h-16 w-16 2xl:h-20 2xl:w-20 text-primary" />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Hey, Hello 👋
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Please enter your credentials to continue
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="2xl:mt-7 mt-8">
        <div className="relative">
          <Input
            removeWrapper
            type="text"
            id="username"
            size={!isDesktop2xl ? "xl" : "lg"}
            placeholder=" "
            disabled={isPending}
            {...register("username")}
            className={cn("peer", {
              "border-destructive": errors.username,
            })}
          />
          <Label
            htmlFor="username"
            className={cn(
              " absolute text-base text-default-600  rounded-t duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0]   bg-background  px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1",
              {
                " text-sm ": isDesktop2xl,
              }
            )}
          >
            Username
          </Label>
        </div>
        {errors.username && (
          <div className=" text-destructive mt-2">
            {errors.username.message}
          </div>
        )}

        <div className="relative mt-6">
          <Input
            removeWrapper
            type={passwordType === "password" ? "password" : "text"}
            id="password"
            size={!isDesktop2xl ? "xl" : "lg"}
            placeholder=" "
            disabled={isPending}
            {...register("password")}
            className={cn("peer", {
              "border-destructive": errors.password,
            })}
          />
          <Label
            htmlFor="password"
            className={cn(
              " absolute text-base  rounded-t text-default-600  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0]   bg-background  px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1",
              {
                " text-sm ": isDesktop2xl,
              }
            )}
          >
            Password
          </Label>
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
          >
            {passwordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-4 h-4 text-default-400" />
            ) : (
              <Icon
                icon="heroicons:eye-slash"
                className="w-4 h-4 text-default-400"
              />
            )}
          </div>
        </div>
        {errors.password && (
          <div className=" text-destructive mt-2">
            {errors.password.message}
          </div>
        )}

        <div className="mt-5  mb-6 flex flex-wrap gap-2">
          <div className="flex-1 flex  items-center gap-1.5 ">
            <Checkbox
              size="sm"
              className="border-default-300 mt-[1px]"
              id="isRemembered"
            />
            <Label
              htmlFor="isRemembered"
              className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
            >
              Remember me
            </Label>
          </div>
          {/* <Link href="/auth/forgot3" className="flex-none text-sm text-primary">
            Forget Password?
          </Link> */}
        </div>
        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {isPending && (
            <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
          )}
          {isPending ? "Loading..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default LogInForm;
