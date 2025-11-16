"use client";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
const ProfileInfo = () => {
  const { data: session } = useSession();

  const lang = usePathname().split("/")[1] || "en";
  const withLang = (path: string) => `/${lang}/${path.replace(/^\/+/, "")}`.replace(/\/{2,}/g, "/");

  const getInitials = (fullName: string) => {
    if (!fullName) return "NA";
    const nameParts = fullName.trim().split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  };

  const avatarUrl = session?.user?.avatar_url ?? null;
  const fullName = session?.user?.full_name ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=" cursor-pointer">
        <div className="flex items-center">
          <Avatar className="w-10 h-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={fullName || "User"} />
            ) : (
              <Badge variant="soft" color="default" className="w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center">
                {getInitials(fullName)}
              </Badge>

            )}
          </Avatar>
        </div>

      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
          <Avatar className="w-10 h-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={fullName || "User"} />
            ) : (
              <Badge variant="soft" color="default" className="w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center">
                {getInitials(fullName)}
              </Badge>

            )}
          </Avatar>
          <div>
            <div className="text-sm font-medium text-default-800 capitalize ">
              {session?.user?.full_name || session?.user?.nickname || 'User'}
            </div>
            <span

              className="text-xs text-default-500  "
            >
              {session?.user?.title || session?.user?.department || ''}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {[
            {
              name: "profile",
              icon: "heroicons:user",
              href: "/users/profile"
            },
         
            // {
            //   name: "Settings",
            //   icon: "heroicons:paper-airplane",
            //   href: "/dashboard"
            // }, 
          ].map((item, index) => (
            <Link
              href={item.href}
              key={`info-menu-${index}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
                <Icon icon={item.icon} className="w-4 h-4" />
                {item.name}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
       
         

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
              <Icon icon="heroicons:phone" className="w-4 h-4" />
              Support
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {[
                  {
                    name: "portal",
                  },
                  {
                    name: "slack",
                  },
                  {
                    name: "whatsapp",
                  },
                ].map((item, index) => (
                  <Link href="/dashboard" key={`message-sub-${index}`}>
                    <DropdownMenuItem className="text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
                      {item.name}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="mb-0 dark:bg-background" />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: withLang("login") })}
          className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer"
        >
          <Icon icon="heroicons:power" className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileInfo;
