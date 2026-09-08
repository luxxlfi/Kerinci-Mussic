import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Inisialisasi Supabase Client di Middleware (Refresh Session Cookie)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. Cek User yang sedang aktif dari Supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Aturan Proteksi Route:
  
  // Jika akses /request tapi belum login -> lempar ke /login
  if (pathname.startsWith("/request") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika akses /admin atau /head-admin tapi belum login -> lempar ke /login
  if ((pathname.startsWith("/admin") || pathname.startsWith("/head-admin")) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Cek Role User (dari metadata Supabase)
  const role = user?.user_metadata?.role || user?.app_metadata?.role || "USER";

  // Jika akses /admin tapi bukan ADMIN / HEAD_ADMIN -> lempar ke homepage (/)
  if (pathname.startsWith("/admin") && role !== "ADMIN" && role !== "HEAD_ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Jika akses /head-admin tapi bukan HEAD_ADMIN -> lempar ke homepage (/)
  if (pathname.startsWith("/head-admin") && role !== "HEAD_ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Jalankan middleware di semua halaman, KECUALI file static (_next/static, images, favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};