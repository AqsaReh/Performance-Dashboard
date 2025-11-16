import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
    accessToken: string;
  }

  interface User extends DefaultUser {
    id: number;
    email: string;
    pno: string;
    nickname: string;
    full_name: string;
    title: string;
    department: string;
    division: string;
    company: string;
    mobile: string;
    manager_name: string | null;
    manager_email: string | null;
    is_active: boolean;
    auth_type: "ldap" | "local";
    logon_count: number;
    last_logon: string;
    avatar_url: string;
    signature_url: string;
    accessToken: string;
    roles: string[];
    permissions: string[];
  }

  interface JWT {
    id: number;
    email: string;
    pno: string;
    nickname: string;
    full_name: string;
    title: string;
    department: string;
    division: string;
    company: string;
    mobile: string;
    manager_name: string | null;
    manager_email: string | null;
    is_active: boolean;
    auth_type: "ldap" | "local";
    logon_count: number;
    last_logon: string;
    avatar_url: string;
    signature_url: string;
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
  }
}
