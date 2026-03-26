import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import bcrypt from 'bcryptjs'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fungsi Hash Password sebelum disimpan ke database
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12)
}

// Fungsi Komparasi Password saat Login
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const formatDateTimeLocal = (date: Date) => {
  const d = new Date(date)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}
