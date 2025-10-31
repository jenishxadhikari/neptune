"use server"

import { getUserById } from "@/features/auth/queries"

export async function me(id: string) {
  try {
    const user = await getUserById(id)
    return user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      joinDate: user.createdAt
    } : null
  } catch (error) {
    console.error('[GET_ME_ERROR] : ', error);
    return null
  }
}