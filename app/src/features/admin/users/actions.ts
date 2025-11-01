"use server"

import z from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db/index";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";

import { updateUserSchema } from "./schemas";

export async function updateUser(data: z.infer<typeof updateUserSchema>) {
  console.log("server");
  
  try {
    const validatedFields = updateUserSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: "Invalid form fields" };
    }

    const { id, name, email, role } = validatedFields.data;

    const user = await db
      .update(users)
      .set({
        name,
        email,
        role,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    const updatedUser = user[0];
    if (!updatedUser) {
      return {
        success: false,
        message: "User not found or update failed.",
      };
    }

    return {
      success: true,
      message: "User updated successfully.",
    };
  } catch (error) {
    console.error("[UPDATE_USER_ERROR] : ", error);
    return {
      success: false,
      message: "Failed to update user! Please try again.",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    if (!id) {
      return { success: false, message: "User ID is required." };
    }

    const user = await auth()
    if (!user) {
      return {
        success: false,
        message: "Failed to delete user! Please try again.",
      };
    }

    if (user.userId == id) {
      return {
        success: false,
        message: "Can't delete yourself!",
      };
    }

    const deleted = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    const deletedUser = deleted[0];
    if (!deletedUser) {
      return { success: false, message: "User not found or already deleted." };
    }

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error) {
    console.error("[DELETE_USER_ERROR] : ", error);
    return {
      success: false,
      message: "Failed to delete user! Please try again.",
    };
  }
}