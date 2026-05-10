import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DatabaseConnection } from "@/lib/Database";
import { equal } from "@/lib/Security";
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";

const providers: any[] = [];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        })
    );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

providers.push(
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
                console.error("Auth Authorize Error:", error);
                return null;
            }
        }
    })
);

export const authOptions: NextAuthOptions = {
    providers,
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
    },
    callbacks: {
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.sub = user.id;
                token.role = (user as any).role;
                token.rememberMe = (user as any).remember;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
