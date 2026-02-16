import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return Response.redirect(signInUrl);
    }
    if (req.auth.user.role !== "admin") {
      return Response.redirect(new URL("/", req.url));
    }
  }

  if (
    (pathname.startsWith("/auction") || pathname.startsWith("/portal")) &&
    !pathname.startsWith("/api")
  ) {
    if (!req.auth) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/auction/:path*", "/portal/:path*"],
};
