import { type NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginWithCredentials } from "@/features/auth/services/login";
import {
  createAuthSessionKey,
  deleteAuthSessionTokens,
  saveAuthSessionTokens,
} from "@/lib/auth/tokenStore";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) {
          return null;
        }

        const user = await loginWithCredentials({ username, password });

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? user.username,
          role: user.role,
          instansi_id: user.instansi_id,
          instansi_name: user.instansi_name,
          username: user.username,
          accessToken: "accessToken" in user ? user.accessToken : undefined,
          refreshToken: "refreshToken" in user ? user.refreshToken : undefined,
          usertype_id: "usertype_id" in user ? user.usertype_id : undefined,
          usertype_name:
            "usertype_name" in user ? user.usertype_name : undefined,
          is_active: "is_active" in user ? user.is_active : undefined,
          image: "image" in user ? user.image : undefined,
          photo_thumb: "photo_thumb" in user ? user.photo_thumb : undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (typeof user.accessToken === "string") {
          const authSessionKey = createAuthSessionKey();
          await saveAuthSessionTokens(authSessionKey, {
            accessToken: user.accessToken,
            refreshToken: user.refreshToken ?? null,
            storedAt: Date.now(),
          });
          token.authSessionKey = authSessionKey;
        }

        token.role = user.role;
        token.instansi_id = user.instansi_id;
        token.instansi_name = user.instansi_name;
        token.username = user.username;
        token.usertype_id = user.usertype_id;
        token.usertype_name = user.usertype_name;
        token.is_active = user.is_active;
        token.picture = user.image ?? user.photo_thumb ?? token.picture;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.instansi_id = token.instansi_id;
        session.user.instansi_name = token.instansi_name;
        session.user.username = token.username;
        session.user.usertype_id = token.usertype_id;
        session.user.usertype_name = token.usertype_name;
        session.user.is_active = token.is_active;
      }

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (typeof token?.authSessionKey === "string") {
        await deleteAuthSessionTokens(token.authSessionKey);
      }
    },
  },
};

export default NextAuth(authOptions);
