"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

import { useState } from "react";
import AddBlock from "../common/add-block";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LogoutFooter = () => {
  const { data: session } = useSession();

  const lang = usePathname().split("/")[1] || "en";
  const withLang = (path: string) => `/${lang}/${path.replace(/^\/+/, "")}`.replace(/\/{2,}/g, "/");
  
  return (
    <>
      {/* <AddBlock /> */}

      <div className=" bg-default-50 dark:bg-default-200 items-center flex gap-3  px-4 py-2 mt-5">
        <div className="flex-1">
          <div className=" text-default-700 font-semibold text-sm capitalize mb-0.5 truncate">
            {session?.user?.full_name || session?.user?.nickname || 'User'}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-default-600 truncate w-[158px]">
                  {session?.user?.email || 'No email'}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>{session?.user?.email || 'No email'}</p>
                <TooltipArrow className="fill-primary" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className=" flex-none">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: withLang("login") })}
            className="  text-default-500 inline-flex h-9 w-9 rounded items-center  dark:bg-default-300 justify-center dark:text-default-900"
          >
            <Icon
              icon="heroicons:arrow-right-start-on-rectangle-20-solid"
              className=" h-5 w-5"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default LogoutFooter;
