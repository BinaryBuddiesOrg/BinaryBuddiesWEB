# Implementation Plan: Google OAuth Authentication

> **Goal:** Add Google Sign-In/Sign-Up to Binary Buddies Web for future blog authoring and commenting features.  
> **Critical Requirement:** Users can sign in but CANNOT access Odoo admin panel.

---

## Background

Binary Buddies Web currently has no authentication system. We need to add Google OAuth to enable:
- Future blog authoring by external users
- Blog commenting system
- User profiles and personalization

**Technology Choice:** Auth.js v5 (NextAuth.js) - the industry standard for Next.js authentication.

---

## User Review Required

> [!IMPORTANT]
> **Google Cloud Console Setup Required**
> Before implementation, you need to create OAuth 2.0 credentials in Google Cloud Console:
> 1. Go to [Google Cloud Console](https://console.cloud.google.com)
> 2. Create a new project or select existing
> 3. Navigate to APIs & Services → Credentials
> 4. Create OAuth 2.0 Client ID (Web Application)
> 5. Add authorized JavaScript origins:
>    - `http://localhost:3000` (development)
>    - `https://binarybuddies.com` (production)
> 6. Add authorized redirect URIs:
>    - `http://localhost:3000/api/auth/callback/google` (development)
>    - `https://binarybuddies.com/api/auth/callback/google` (production)

> [!CAUTION]
> **Security Consideration**
> The Odoo admin panel runs on port 8069 and is accessed via API proxy. Regular website users will NOT have access to Odoo because:
> 1. Odoo has its own authentication system (separate from website users)
> 2. Our API endpoints use `auth='public'` or require Odoo session cookies
> 3. Website users will only have JWT sessions from NextAuth, not Odoo sessions

---

## Proposed Changes

### Component 1: Package Installation

Install the required package:

```bash
npm install next-auth@beta
```

---

### Component 2: Auth Configuration

#### [NEW] [auth.ts](file:///home/messi/messi/HH/BBWeb/binary-buddies-spark/auth.ts)

Root-level auth configuration file using Auth.js v5 pattern:

```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      // Add user id to session
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
})
```

---

### Component 3: API Route Handler

#### [NEW] [route.ts](file:///home/messi/messi/HH/BBWeb/binary-buddies-spark/app/api/auth/[...nextauth]/route.ts)

NextAuth route handler for App Router:

```typescript
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

---

### Component 4: Environment Variables

#### [MODIFY] [.env.local](file:///home/messi/messi/HH/BBWeb/binary-buddies-spark/.env.local)

Add required environment variables (user must provide actual values):

```env
# NextAuth Configuration
AUTH_SECRET=<generate-with-npx-auth-secret>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Required for production
AUTH_URL=https://binarybuddies.com
```

---

### Component 5: Session Provider Integration

#### [MODIFY] [providers.tsx](file:///home/messi/messi/HH/BBWeb/binary-buddies-spark/app/providers.tsx)

Wrap app with SessionProvider:

```diff
 'use client';

 import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 import { ThemeProvider } from '@/components/ThemeProvider';
 import { TooltipProvider } from '@/components/ui/tooltip';
 import { useState } from 'react';
+import { SessionProvider } from 'next-auth/react';

-export function Providers({ children }: { children: React.ReactNode }) {
+export function Providers({ children, session }: { children: React.ReactNode; session?: any }) {
     const [queryClient] = useState(
         () =>
             new QueryClient({
                 defaultOptions: {
                     queries: {
                         staleTime: 5 * 60 * 1000,
                         gcTime: 10 * 60 * 1000,
                     },
                 },
             })
     );

     return (
-        <QueryClientProvider client={queryClient}>
-            <ThemeProvider defaultTheme="dark" storageKey="binary-buddies-theme">
-                <TooltipProvider>
-                    {children}
-                </TooltipProvider>
-            </ThemeProvider>
-        </QueryClientProvider>
+        <SessionProvider session={session}>
+            <QueryClientProvider client={queryClient}>
+                <ThemeProvider defaultTheme="dark" storageKey="binary-buddies-theme">
+                    <TooltipProvider>
+                        {children}
+                    </TooltipProvider>
+                </ThemeProvider>
+            </QueryClientProvider>
+        </SessionProvider>
     );
 }
```

---

### Component 6: User Menu Component

#### [NEW] [UserMenu.tsx](file:///home/messi/messi/HH/BBWeb/binary-buddies-spark/components/UserMenu.tsx)

A dropdown menu showing user info when logged in, or sign-in button when logged out:

```typescript
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Loader2 } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  if (!session) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => signIn("google")}
        className="glass border-primary/30 hover:bg-primary/10 transition-all duration-300"
      >
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const initials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border-2 border-primary/30">
            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="glass border-primary/30 bg-card/80 backdrop-blur-2xl min-w-[200px]"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### Component 7: Navbar Integration

#### [MODIFY] [Navbar.tsx](file:///home/messi/messi/HH/BBWeb/binary-buddies-spark/components/Navbar.tsx)

Add UserMenu next to theme toggle:

```diff
 import { useTheme } from "@/components/ThemeProvider";
+import { UserMenu } from "@/components/UserMenu";

 // ... existing code ...

           {/* Theme Toggle - Desktop */}
           {!isMobile && (
             <div className="hidden md:block">
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                 className="hover:bg-primary/10 transition-all duration-300"
               >
                 {theme === "dark" ? (
                   <Sun className="w-5 h-5 text-primary" />
                 ) : (
                   <Moon className="w-5 h-5 text-primary" />
                 )}
               </Button>
             </div>
           )}

+          {/* User Menu - Desktop */}
+          {!isMobile && (
+            <div className="hidden md:block">
+              <UserMenu />
+            </div>
+          )}

           {/* CTA Button - Desktop */}
```

Also add UserMenu to mobile menu (before theme toggle):

```diff
                   {/* Mobile CTA */}
+                  {/* User Menu - Mobile */}
+                  <div className="py-2">
+                    <UserMenu />
+                  </div>
+
                   <div className="pt-2 pb-4">
```

---

### Component 8: Next.js Config Update

#### [MODIFY] [next.config.ts](file:///home/messi/messi/HH/BBWeb/binary-buddies-spark/next.config.ts)

Exclude auth routes from Odoo proxy:

```diff
     // API rewrites to proxy Odoo backend
     async rewrites() {
         return [
             {
-                source: '/api/:path*',
-                destination: 'http://localhost:8069/api/:path*',
+                // Proxy Odoo API (except auth routes)
+                source: '/api/bbweb/:path*',
+                destination: 'http://localhost:8069/api/bbweb/:path*',
             },
         ];
     },
```

This ensures `/api/auth/*` routes are handled by NextAuth, while `/api/bbweb/*` routes go to Odoo.

---

### Component 9: Middleware Update (Optional)

#### [MODIFY] [middleware.ts](file:///home/messi/messi/HH/BBWeb/binary-buddies-spark/middleware.ts)

Add auth-related exclusions if needed for protected routes in future:

```diff
 export const config = {
     matcher: [
         /*
          * Match all request paths except for the ones starting with:
          * - _next/static (static files)
          * - _next/image (image optimization files)
          * - favicon.ico (favicon file)
          * - public folder files
+         * - api/auth (NextAuth routes)
          */
-        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
+        '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
     ],
 };
```

---

## File Summary

| Action | File | Description |
|--------|------|-------------|
| **NEW** | `auth.ts` | Root auth configuration |
| **NEW** | `app/api/auth/[...nextauth]/route.ts` | NextAuth route handler |
| **NEW** | `components/UserMenu.tsx` | User avatar/sign-in dropdown |
| **NEW** | `.env.local` | Environment variables (user creates) |
| **MODIFY** | `app/providers.tsx` | Add SessionProvider |
| **MODIFY** | `components/Navbar.tsx` | Add UserMenu component |
| **MODIFY** | `next.config.ts` | Update API proxy routes |
| **MODIFY** | `middleware.ts` | Exclude auth routes |

---

## Verification Plan

### Manual Browser Testing

**Prerequisites:**
1. Create `.env.local` with Google OAuth credentials
2. Run `npm install next-auth@beta`
3. Start dev server: `npm run dev`

**Test Steps:**

1. **Sign In Flow:**
   - Open http://localhost:3000
   - Verify "Sign In" button appears in navbar
   - Click "Sign In" → should redirect to Google OAuth
   - Complete Google sign-in → should redirect back to homepage
   - Verify user avatar appears in navbar with dropdown

2. **Session Persistence:**
   - After sign in, refresh the page
   - User should remain signed in
   - User avatar and dropdown should still be visible

3. **Sign Out Flow:**
   - Click on user avatar
   - Click "Sign Out" from dropdown
   - Verify user is logged out
   - "Sign In" button should reappear

4. **Mobile Menu:**
   - Resize browser to mobile width
   - Open hamburger menu
   - Verify Sign In/User avatar appears in mobile menu
   - Test sign in/out from mobile

5. **Odoo Admin Security:**
   - After signing in as website user
   - Try accessing http://localhost:8069/web
   - Should show Odoo login page (NOT auto-logged in)
   - This confirms website auth is separate from Odoo auth

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Website User                    Odoo Admin                    │
│   ────────────                    ──────────                    │
│                                                                 │
│   ┌──────────────┐               ┌──────────────┐              │
│   │ Google OAuth │               │ Odoo Login   │              │
│   │ (NextAuth)   │               │ (Separate)   │              │
│   └──────────────┘               └──────────────┘              │
│          │                              │                       │
│          ▼                              ▼                       │
│   ┌──────────────┐               ┌──────────────┐              │
│   │ JWT Session  │               │ Odoo Session │              │
│   │ (Browser)    │               │ (Cookie)     │              │
│   └──────────────┘               └──────────────┘              │
│          │                              │                       │
│          ▼                              ▼                       │
│   ┌──────────────┐               ┌──────────────┐              │
│   │ Next.js App  │               │ Odoo Admin   │              │
│   │ Frontend     │               │ Port 8069    │              │
│   └──────────────┘               └──────────────┘              │
│          │                                                      │
│          │ (Public API only)                                   │
│          ▼                                                      │
│   ┌──────────────────────────────────────────┐                 │
│   │ Odoo Public API                          │                 │
│   │ /api/bbweb/blogs, /api/bbweb/careers etc │                 │
│   │ (No admin access)                        │                 │
│   └──────────────────────────────────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Security Points:**
1. Website users authenticate via Google → NextAuth JWT
2. Odoo admin requires separate Odoo credentials
3. Public API endpoints don't require any authentication
4. Future blog creation will need a new Odoo API endpoint that validates NextAuth user
