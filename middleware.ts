import {auth, moderatingRoles} from "@/auth"

export default auth((req, ctx) => {
    const pathname = req.nextUrl.pathname;
    if (pathname === "/") return;
    const accessDeniedResponse = Response.redirect(new URL("/", req.nextUrl.origin));
    // Prevent Access to any other page except you are logged in
    if (req.auth == null) return accessDeniedResponse;
    const session = req.auth;
    // Prevent Access to any other page except you own minecraft
    if (!session.postLogin.success) return accessDeniedResponse;

    // Require moderator or admin role to access admin pages
    if (pathname.startsWith("/admin") && !moderatingRoles.includes(session.postLogin.role)) return accessDeniedResponse;
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|login).*)"
    ],
}