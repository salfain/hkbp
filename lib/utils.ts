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
