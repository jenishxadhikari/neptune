import { format } from 'date-fns'

import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { getUsers } from '@/features/admin/users/queries'
import { UserClient } from '@/features/admin/users/components/user-client'
import { UserColumn } from '@/features/admin/users/schemas'

export default async function UsersPage() {
  const users = await getUsers()

  if (!users) {
    return (
      <section className="py-6 md:py-10">
        <MaxWidthWrapper>
          <h1 className="text-2xl font-bold">User not found</h1>
        </MaxWidthWrapper>
      </section>
    )
  }

  const formattedUsers: UserColumn[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: format(user.createdAt, 'MMMM do, yyyy'),
    updatedAt: format(user.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <section className='py-6 md:py-10'>
      <MaxWidthWrapper>
        <UserClient data={formattedUsers} />
      </MaxWidthWrapper>
    </section>
  )
}