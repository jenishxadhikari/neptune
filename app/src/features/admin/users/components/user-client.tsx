import { User } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'

import { columns } from '@/features/admin/users/table/columns'
import { DataTable } from '@/features/admin/users/table/data-table'
import { UserClientProps } from '@/features/admin/users/schemas'

export function UserClient({ data }: UserClientProps) {
  return (
    <div className="space-y-6">
      <Header
        title="Users"
        description="Manage all the users in the system."
        icon={User}
      />
      <Separator />
      <DataTable searchKey="email" columns={columns} data={data} />
    </div>
  )
}
