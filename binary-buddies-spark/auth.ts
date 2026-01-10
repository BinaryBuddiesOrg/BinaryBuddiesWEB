import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Sync user to Odoo on every sign-in
            try {
                const odooUrl = process.env.ODOO_API_URL || 'http://localhost:8069';
                const response = await fetch(`${odooUrl}/api/bbweb/users/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'call',
                        params: {
                            google_id: account?.providerAccountId,
                            email: user.email,
                            name: user.name,
                            image_url: user.image,
                        },
                        id: Date.now(),
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to sync user to Odoo:', response.status);
                }
            } catch (error) {
                console.error('Failed to sync user to Odoo:', error);
                // Don't block sign-in if sync fails
            }
            return true; // Allow sign-in
        },
        async session({ session, token }) {
            // Add user id and googleId to session
            if (session.user && token.sub) {
                session.user.id = token.sub;
                // Add Google account ID for verification
                session.user.googleId = token.googleId as string;
            }
            return session;
        },
        async jwt({ token, account }) {
            // Store googleId from account on first sign-in
            if (account) {
                token.googleId = account.providerAccountId;
            }
            return token;
        },
    },
})
