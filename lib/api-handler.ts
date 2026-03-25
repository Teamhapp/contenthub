import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";

interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isBanned?: boolean;
  };
}

interface HandlerOptions {
  requireAuth?: boolean;
  requireRole?: string | string[];
  connectDb?: boolean;
}

/**
 * API route wrapper that handles DB connection, auth, banned checks, and role validation.
 * Reduces boilerplate across all API routes.
 */
export function apiHandler(
  handler: (req: NextRequest, session: AuthSession | null, ...args: any[]) => Promise<NextResponse>,
  options: HandlerOptions = {}
) {
  const { requireAuth = false, requireRole, connectDb = true } = options;

  return async (req: NextRequest, ...args: any[]) => {
    try {
      // Connect to DB
      if (connectDb) {
        await dbConnect();
      }

      // Get session
      const session = (await getServerSession(authOptions)) as AuthSession | null;

      // Auth check
      if (requireAuth && !session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Banned check
      if (session?.user?.isBanned) {
        return NextResponse.json({ error: "Account is banned" }, { status: 403 });
      }

      // Role check
      if (requireRole && session) {
        const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
        if (!roles.includes(session.user.role)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      return await handler(req, session, ...args);
    } catch (error: any) {
      console.error(`API Error [${req.method} ${req.nextUrl.pathname}]:`, error.message);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Quick auth check for existing routes that don't use the wrapper yet.
 * Returns null if OK, or a NextResponse error if the user is banned/unauthorized.
 */
export async function requireAuthNotBanned(): Promise<{ session: AuthSession } | NextResponse> {
  const session = (await getServerSession(authOptions)) as AuthSession | null;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user?.isBanned) {
    return NextResponse.json({ error: "Account is banned" }, { status: 403 });
  }

  return { session };
}
