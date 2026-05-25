import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginWithCredentials } from "@/features/auth/services/login";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
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
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);
