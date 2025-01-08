import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/products"];
const isPublic = createRouteMatcher(publicRoutes);

export default clerkMiddleware((auth, req) => {
  if (isPublic(req)) {
    return;
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
