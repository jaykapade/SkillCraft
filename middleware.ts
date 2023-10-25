import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { isTeacher } from "./lib/teacher";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/api/webhook", "/api/test"],
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const pathname = req.nextUrl.pathname;
    if (
      auth.isApiRoute &&
      pathname.startsWith("/api/courses") &&
      req.method !== "GET"
    ) {
      if (isTeacher(auth.userId)) {
        console.log("Teacher Route");
      } else return new NextResponse("Unauthorized", { status: 401 });
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
