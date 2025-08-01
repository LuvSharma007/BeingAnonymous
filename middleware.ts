import { NextResponse, NextRequest } from 'next/server'
export {default} from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt' 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req:request})
    const url = request.nextUrl

    if(token &&

        (
            url.pathname.startsWith('/signin') || 
            url.pathname.startsWith('/signup') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/')

        )

     ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      if(!token && url.pathname.startsWith('/dashboard')){
       return NextResponse.redirect(new URL('/signin', request.url))
     }



  return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}

