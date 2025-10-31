"use client"

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { logout } from '@/features/auth/actions'

export function Logout() {
  const router = useRouter()
  async function handleLogout() {
    const result = await logout()
    if (result?.success) {
      toast.success(result.message)
        router.push('/')
    }
    if(!result?.success){
      toast.error(result.message)
    }
  }
  return (
    <Button type="submit" variant="destructive" onClick={handleLogout}>
      Logout
    </Button>
  )
}
