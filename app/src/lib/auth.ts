import "server-only"

import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

type SessionTokenPayload = {
  userId: string | number
  userRole: "admin" | "user"
};

const secretKey = process.env.SECRET!

export async function encryptToken(payload: SessionTokenPayload) {
  try {
    const sessionToken = jwt.sign(payload, secretKey, {
      expiresIn: '7d'
    })
    return sessionToken
  } catch (error) {
    console.error('[ENCRYPT_TOKEN_ERROR] : ', error);
    return null
  }
}

export async function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, secretKey) as SessionTokenPayload
    return payload
  } catch (error) {
    console.error('[VERIFY_TOKEN_ERROR] : ', error);
    return null
  }
}

export async function setSessionToken(token: string) {
  try {
    const cookieStore = await cookies()
    cookieStore.set('sessionToken', token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60)
    })
  } catch (error) {
    console.error('[SET_SESSION_TOKEN_ERROR] : ', error);
  }
}

export async function deleteSessionToken() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('sessionToken')
  } catch (error) {
    console.error('[DELETE_SESSION_TOKEN_ERROR] : ', error);
  }
}

export async function auth() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('sessionToken')?.value
    let payload: SessionTokenPayload | null = null
    if(sessionToken){
      payload = await verifyToken(sessionToken)
    }
    return payload
  } catch (error) {
    console.error('[DELETE_SESSION_TOKEN_ERROR] : ', error);
    return null
  }
}