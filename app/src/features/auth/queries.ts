import "server-only"

import { eq } from "drizzle-orm"

import { db } from "@/db"
import { users } from "@/db/schema"

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    })
    return user ? user : null
  } catch (error) {
    console.error('[GET_USER_BY_EMAIL_ERROR] : ', error);
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: false
      }
    })
    return user ? user : null
  } catch (error) {
    console.error('[GET_USER_BY_ID_ERROR] : ', error);
    return null
  }
}