import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware (req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(
          new URL(token.role === 'ADMIN' ? '/admin' : '/jemaat', req.url)
        )
      }
      return null
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Proteksi Route Admin
    if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/jemaat', req.url)) // Lempar kembali ke panel jemaat
    }
  },
  {
    callbacks: {
      authorized: () => true // Biarkan fungsi middleware() di atas yang menangani logika
    }
  }
)

export const config = {
  matcher: ['/admin/:path*', '/jemaat/:path*', '/login']
}
