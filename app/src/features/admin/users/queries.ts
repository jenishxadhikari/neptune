import { db } from "@/db/index";

import { usersSchema } from "./schemas";

export async function getUsers() {
  try {
    const users = await db.query.users.findMany()
    return usersSchema.parse(users)
  } catch (error) {
    console.error("[GET_USERS_ERROR] : ", error);
    return null
  }
}
