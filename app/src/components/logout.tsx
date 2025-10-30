"use client"

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { logout } from '@/features/auth/actions'

export function Logout() {
  async function handleLogout() {
    const result = await logout()
    if (result?.success) {
      toast.success(result.message)
    }
  }
  return (
    <Button type="submit" variant="destructive" onClick={handleLogout}>
      Logout
    </Button>
  )
}
