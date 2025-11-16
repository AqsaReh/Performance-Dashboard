import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import http from "@/config/http";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "muhammad.adeel",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          console.warn("No credentials provided.");
          return null;
        }

        try {
          console.log("Attempting to authenticate user:", credentials.username);
          console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

          const response: any = await http.post("/v1/login", {
            username: credentials.username,
            password: credentials.password,
          });

          console.log("Authentication response:", response);

          const { access_token, user } = response;

          // if (!access_token || !user) {
          //   console.error("Missing fields in authentication response.");
          //   return null;
          // }

          const userObj: User = {
            ...user,
            accessToken: access_token,
          };

          console.log("Authenticated user:", userObj);
          return userObj;
        } catch (error: any) {
          if (error.response) {
            console.error(
              `Authentication failed with status ${error.response.status}:`,
              error.response.data
            );
          } else {
            console.error("Authentication error:", error.message);
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
       // Handle session updates
      if (trigger === "update") {
        console.log("Session update received:", session);
        
        // If session contains user data, update the token
        if (session?.user) {
          return {
            ...token,
            ...session.user,
            avatar_url: session.user.avatar_url || token.avatar_url,
            signature_url: session.user.signature_url || token.signature_url,
            updatedAt: session.user.updatedAt || token.updatedAt,
          };
        }
        
        // If no specific user data, just return the token with updated timestamp
        return {
          ...token,
          updatedAt: Date.now(),
        };
      }

      // Handle initial JWT callback after sign-in
      if (user) {
        
        token.id = user.id;
        token.email = user.email;
        token.pno = user.pno;
        token.nickname = user.nickname;
        token.full_name = user.full_name;
        token.title = user.title;
        token.department = user.department;
        token.division = user.division;
        token.company = user.company;
        token.mobile = user.mobile;
        token.manager_name = user.manager_name;
        token.manager_email = user.manager_email;
        token.auth_type = user.auth_type;
        token.is_active = user.is_active;
        token.logon_count = user.logon_count;
        token.last_logon = user.last_logon;
        token.avatar_url = user.avatar_url;
        token.signature_url = user.signature_url; 
        token.accessToken = user.accessToken;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        token.roles = user.roles;
        token.permissions = user.permissions;
      }

      // Log token details
      console.log("JWT Callback - Token:", token);

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.email = token.email as string;
        session.user.pno = token.pno as string;
        session.user.nickname = token.nickname as string;
        session.user.full_name = token.full_name as string;
        session.user.title = token.title as string;
        session.user.department = token.department as string;
        session.user.division = token.division as string;
        session.user.company = token.company as string;
        session.user.mobile = token.mobile as string;
        session.user.manager_name = token.manager_name as string;
        session.user.manager_email = token.manager_email as string;
        session.user.auth_type = token.auth_type as 'ldap' | 'local';
        session.user.is_active = token.is_active as boolean;
        session.user.logon_count = token.logon_count as number;
        session.user.last_logon = token.last_logon as string;
        session.user.avatar_url = token.avatar_url as string;
        session.user.signature_url = token.signature_url as string;
        session.user.accessToken = token.accessToken as string;
        session.user.roles = token.roles as string[];
        session.user.permissions = token.permissions as string[];
      }

      // Log session details
      console.log("Session Callback - Session:", session);

      return session;
    },
  },
  pages: {
    signIn: "/v1/login",
    error: "/v1/login", // Error code passed in query string as ?error=
  },
};

async function refreshAccessToken(token: any) {
  try {
    console.log("Refreshing access token for user:", token.email);

    const response: any = await http.post("/refresh", {
      refresh_token: token.refreshToken,
    });

    console.log("Token refresh response:", response.data);

    const { access_token, refresh_token, role, email } = response.data;

    if (!access_token || !role) {
      console.error("Missing fields in token refresh response.");
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    return {
      ...token,
      accessToken: access_token,
      refreshToken: refresh_token || token.refreshToken, // Use new refresh token if provided
      role: role || token.role,
      email: email || token.email,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    };
  } catch (error: any) {
    if (error.response) {
      console.error(
        `Token refresh failed with status ${error.response.status}:`,
        error.response.data
      );
    } else {
      console.error("Token refresh error:", error.message);
    }
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
