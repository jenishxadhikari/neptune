import z from "zod";

import { users } from '@/db/schema'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["user", "admin"]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const usersSchema = z.array(userSchema)

export const editUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(["user", "admin"])
})

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["user", "admin"])
})


export type User = typeof users.$inferSelect

export type UserColumn = {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  createdAt: string
  updatedAt: string
}
export type CellActionProps = {
  data: UserColumn
}

export type UserClientProps = {
  data: UserColumn[]
}