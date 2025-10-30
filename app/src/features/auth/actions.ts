"use server"

import z from "zod";
import argon2 from "argon2";

import { db } from "@/db";
import { users } from "@/db/schema";

import { deleteSessionToken, encryptToken, setSessionToken } from "@/lib/auth";

import { loginSchema, registerSchema } from "./schemas";
import { getUserByEmail } from "./queries";

export async function register(data: z.infer<typeof registerSchema>) {
  try {
    const validateData = registerSchema.safeParse(data)
    if (!validateData.success) {
      return {
        success: false,
        message: 'Invalid form fields!'
      }
    }

    const { name, email, password } = validateData.data

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return {
        success: false,
        message: 'Email already exists, please use a different email or login.'
      }
    }

    const hashedPassword = await argon2.hash(password)
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword
    })

    return {
      success: true,
      message: 'Registration successful! Login to continue."'
    }
  } catch (error) {
    console.error('[USER_REGISTER_ERROR] : ', error);
    return {
      success: false,
      message: 'Failed to register! Please try again.'
    }
  }
}

export async function login(data: z.infer<typeof loginSchema>) {
  try {
    const validateData = loginSchema.safeParse(data)
    if (!validateData.success) {
      return {
        success: false,
        message: 'Invalid form fields!'
      }
    }

    const { email, password } = validateData.data

    const user = await getUserByEmail(email)
    if (!user) {
      return {
        success: false,
        message: 'Invalid login credentials!'
      }
    }

    const verifyPassword = await argon2.verify(user.password, password)
    if (!verifyPassword) {
      return {
        success: false,
        message: 'Invalid login credentials!'
      }
    }

    const payload = {
      userId: user.id,
      userRole: user.role
    }

    const sessionToken = await encryptToken(payload)
    if (!sessionToken) {
      return {
        success: false,
        message: 'Failed to login! Please try again.'
      }
    }

    await setSessionToken(sessionToken)

    return {
      success: true,
      message: 'Login Successful.'
    }
  } catch (error) {
    console.error('[USER_LOGIN_ERROR] : ', error);
    return {
      success: false,
      message: 'Failed to login! Please try again.'
    }
  }
}

export async function logout() {
  try {
    await deleteSessionToken()
    return {
      success: true,
      message: 'Logout Successful.'
    }
  } catch (error) {
    console.error('[USER_LOGOUT_ERROR] : ', error);
    return {
      success: false,
      message: 'Failed to logout! Please try again.'
    }
  }
}