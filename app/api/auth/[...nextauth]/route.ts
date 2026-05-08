import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DatabaseConnection } from "@/lib/Database";
import { equal } from "@/lib/Security";
import User from "@/models/User";

const handler = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember Me", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                try {
                    await DatabaseConnection();
                    const user = await User.findOne({ username: credentials.username }).select("+password");

                    if (!user) return null;

                    const isPasswordCorrect = await equal(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return {
                            id: user._id.toString(),
                            name: user.username,
                            email: user.email,
                            role: user.role,
                            remember: credentials?.remember === "true"
                        };
                    }
                    return null;
                }
                catch (error: unknown) {
                    if (error instanceof Error) {
                        console.log("Auth Error: ", error.message);
                    }
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).role = token.role;
                const expiration = token.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
                session.expires = new Date(Date.now() + expiration * 1000).toISOString();
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = (user as any).role;
                token.rememberMe = (user as any).remember;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };