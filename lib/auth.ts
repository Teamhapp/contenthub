import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || user.isBanned) return null;

        // Guard against users without a password (e.g., future OAuth users)
        if (!user.password || typeof user.comparePassword !== "function") return null;

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          isBanned: user.isBanned,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isBanned = (user as any).isBanned || false;
      }

      // Periodically refresh permissions from DB to catch bans/role changes.
      // Re-check every 5 minutes (token.iat is in seconds).
      const now = Math.floor(Date.now() / 1000);
      const lastRefresh = (token.lastRefresh as number) || 0;
      if (now - lastRefresh > 300) {
        try {
          await dbConnect();
          const freshUser = await User.findById(token.id).select("role isBanned").lean();
          if (freshUser) {
            token.role = freshUser.role;
            token.isBanned = freshUser.isBanned || false;
          }
          token.lastRefresh = now;
        } catch {
          // If DB is unreachable, keep existing token data
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        (session.user as any).isBanned = token.isBanned;
      }
      return session;
    },
  },
};
