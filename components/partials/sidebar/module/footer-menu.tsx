import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "@/components/svg";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

const FooterMenu = () => {
  const { data: session } = useSession();

  const getInitials = (fullName: string) => {
    if (!fullName) return "NA";
    const nameParts = fullName.trim().split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  };

  const avatarUrl = session?.user?.avatar_url ?? null;
  const fullName = session?.user?.full_name ?? "";

  return (
    <div className="space-y-5 flex flex-col items-center justify-center pb-6">
      {/* Settings button */}
      <button className="w-11 h-11 mx-auto text-default-500 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-primary hover:text-primary-foreground">
        <Settings className="h-8 w-8" />
      </button>

      {/* Avatar */}
      <div>
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
    </div>
  );
};

export default FooterMenu;
