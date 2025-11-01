import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

import { Header } from '@/components/header'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminPage() {
  return (
    <section className='py-6 md:py-10'>
      <MaxWidthWrapper className="space-y-6">
        <Header
          title="Admin"
          description="Welcome to the admin page."
          icon={ShieldCheck}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Link href="/admin/users">
            <Card className='max-w-sm hover:scale-105 transition-all'>
              <CardHeader>
                <CardTitle className='text-xl'>Manage Users</CardTitle>
                <CardDescription>
                  View, edit, and control user accounts, roles, and permissions.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
