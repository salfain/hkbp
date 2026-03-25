import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  // Memperluas tipe Session
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }

  // Memperluas tipe User
  interface User extends DefaultUser {
    id: string
    role: string
  }
}

declare module 'next-auth/jwt' {
  // Memperluas tipe JWT
  interface JWT extends DefaultJWT {
    id: string
    role: string
  }
}
