import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { auth } from '@/lib/auth'

export async function Navbar() {
  const session = await auth()
  return (
    <header className="bg-background/95 border-b">
      <MaxWidthWrapper className="flex h-14 items-center">
        <nav className="flex items-center justify-between w-full">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>Home</Link>

          {
            session ? (
              <div className='flex items-center gap-4'>
                <Link href="/profile" className={buttonVariants({ variant: "outline" })}>Profile</Link>
                {
                  session.userRole === "admin" &&
                  <Link href="/admin" className={buttonVariants({ variant: "outline" })}>Admin</Link>
                }
              </div>
            ) : (
              <Link href="/login" className={buttonVariants({ variant: "outline" })}>Sign In</Link>
            )
          }
        </nav>
      </MaxWidthWrapper>
    </header>
  )
}
