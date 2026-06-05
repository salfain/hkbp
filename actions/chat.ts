'use server'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

type UserRole = 'ADMIN' | 'JEMAAT'
type ChatStatus = 'OPEN' | 'CLOSED'
type ParsedMessage =
  | { success: true; body: string }
  | { success: false; error: string }

const MAX_MESSAGE_LENGTH = 1000

async function requireUser (role?: UserRole) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Anda harus login untuk mengakses chat.')
  }

  if (role && session.user.role !== role) {
    throw new Error('Anda tidak memiliki akses ke fitur ini.')
  }

  return {
    id: session.user.id,
    role: session.user.role as UserRole
  }
}

function getMessageBody (formData: FormData): ParsedMessage {
  const body = String(formData.get('body') || '').trim()

  if (!body) {
    return { success: false, error: 'Pesan tidak boleh kosong.' }
  }

  if (body.length > MAX_MESSAGE_LENGTH) {
    return {
      success: false,
      error: `Pesan maksimal ${MAX_MESSAGE_LENGTH} karakter.`
    }
  }

  return { success: true, body }
}

function revalidateChatPaths () {
  revalidatePath('/admin')
  revalidatePath('/admin/chat')
  revalidatePath('/jemaat/chat')
}

export async function getJemaatChatThread () {
  const user = await requireUser('JEMAAT')

  const [jemaat, thread] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        nomorTelepon: true,
        sektor: true
      }
    }),
    prisma.chatThread.findUnique({
      where: { jemaatId: user.id },
      include: {
        jemaat: {
          select: {
            id: true,
            namaLengkap: true,
            email: true,
            nomorTelepon: true,
            sektor: true
          }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                namaLengkap: true,
                role: true
              }
            }
          }
        }
      }
    })
  ])

  if (!jemaat) {
    throw new Error('Data jemaat tidak ditemukan.')
  }

  if (thread) {
    return thread
  }

  return {
    id: '',
    jemaatId: user.id,
    status: 'OPEN' as const,
    lastMessageAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    jemaat,
    messages: []
  }
}

export async function getAdminChatInbox (selectedThreadId?: string) {
  await requireUser('ADMIN')

  const threads = await prisma.chatThread.findMany({
    orderBy: [{ lastMessageAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      jemaat: {
        select: {
          id: true,
          namaLengkap: true,
          email: true,
          nomorTelepon: true,
          sektor: true
        }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              namaLengkap: true,
              role: true
            }
          }
        }
      },
      _count: {
        select: { messages: true }
      }
    }
  })

  const selectedId =
    selectedThreadId && threads.some(thread => thread.id === selectedThreadId)
      ? selectedThreadId
      : threads[0]?.id

  const selectedThread = selectedId
    ? await prisma.chatThread.findUnique({
        where: { id: selectedId },
        include: {
          jemaat: {
            select: {
              id: true,
              namaLengkap: true,
              email: true,
              nomorTelepon: true,
              sektor: true
            }
          },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              sender: {
                select: {
                  id: true,
                  namaLengkap: true,
                  role: true
                }
              }
            }
          }
        }
      })
    : null

  return { threads, selectedThread }
}

export async function kirimPesanJemaat (formData: FormData) {
  try {
    const user = await requireUser('JEMAAT')
    const parsed = getMessageBody(formData)

    if (!parsed.success) {
      return { success: false, message: parsed.error }
    }

    const now = new Date()

    await prisma.$transaction(async tx => {
      const thread = await tx.chatThread.upsert({
        where: { jemaatId: user.id },
        update: {
          status: 'OPEN',
          lastMessageAt: now
        },
        create: {
          jemaatId: user.id,
          status: 'OPEN',
          lastMessageAt: now
        },
        select: { id: true }
      })

      await tx.chatMessage.create({
        data: {
          threadId: thread.id,
          senderId: user.id,
          body: parsed.body
        }
      })
    })

    revalidateChatPaths()
    return { success: true, message: 'Pesan berhasil dikirim.' }
  } catch (error) {
    console.error('Gagal mengirim pesan jemaat:', error)
    return { success: false, message: 'Gagal mengirim pesan.' }
  }
}

export async function kirimPesanAdmin (threadId: string, formData: FormData) {
  try {
    const user = await requireUser('ADMIN')
    const parsed = getMessageBody(formData)

    if (!parsed.success) {
      return { success: false, message: parsed.error }
    }

    const now = new Date()

    await prisma.$transaction(async tx => {
      const thread = await tx.chatThread.update({
        where: { id: threadId },
        data: {
          status: 'OPEN',
          lastMessageAt: now
        },
        select: { id: true }
      })

      await tx.chatMessage.create({
        data: {
          threadId: thread.id,
          senderId: user.id,
          body: parsed.body
        }
      })
    })

    revalidateChatPaths()
    return { success: true, message: 'Balasan berhasil dikirim.' }
  } catch (error) {
    console.error('Gagal mengirim pesan admin:', error)
    return { success: false, message: 'Gagal mengirim balasan.' }
  }
}

export async function ubahStatusPercakapan (
  threadId: string,
  status: ChatStatus
) {
  try {
    await requireUser('ADMIN')

    if (!['OPEN', 'CLOSED'].includes(status)) {
      return { success: false, message: 'Status percakapan tidak valid.' }
    }

    await prisma.chatThread.update({
      where: { id: threadId },
      data: { status }
    })

    revalidateChatPaths()
    return {
      success: true,
      message:
        status === 'OPEN'
          ? 'Percakapan dibuka kembali.'
          : 'Percakapan ditutup.'
    }
  } catch (error) {
    console.error('Gagal mengubah status percakapan:', error)
    return { success: false, message: 'Gagal mengubah status percakapan.' }
  }
}
