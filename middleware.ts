import { NextResponse } from "next/server";

export function middleware(request: any) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams.toString();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  if (searchParams) {
    requestHeaders.set("x-search", `?${searchParams}`);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|assets|docs|.*\\..*|_next).*)"],
};


