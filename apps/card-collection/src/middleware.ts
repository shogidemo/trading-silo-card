import { NextRequest, NextResponse } from "next/server";

const retired = (path: string) => /^\/images\/(silos|grains|traders)\//.test(path) || path.startsWith("/screenshots/");

export function middleware(request: NextRequest) {
  let path = request.nextUrl.pathname;
  if (path === "/_next/image") {
    const source = request.nextUrl.searchParams.get("url");
    if (source) {
      try { path = new URL(source, request.nextUrl.origin).pathname; } catch { return NextResponse.next(); }
    }
  }
  if (retired(path)) return new NextResponse("This media is no longer distributed.", {
    status: 410, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
  });
  return NextResponse.next();
}

export const config = { matcher: ["/images/:path*", "/screenshots/:path*", "/_next/image"] };
