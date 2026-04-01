import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { comparePassword } from '@/lib/utils'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login' // Halaman custom login kita nanti
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password wajib diisi')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('Email tidak terdaftar')
        }

        if (user.role === 'JEMAAT') {
          if (user.statusAkun === 'PENDING') {
            throw new Error(
              'Akun Anda sedang menunggu persetujuan (ACC) dari Admin.'
            )
          }
          if (user.statusAkun === 'DITOLAK') {
            throw new Error('Pendaftaran akun Anda ditolak oleh Admin.')
          }
        }

        const isPasswordValid = await comparePassword(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Password salah')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.namaLengkap,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session ({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  }
}
