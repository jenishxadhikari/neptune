'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './cell-action'
import { UserColumn } from '../schemas'

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: 'id',
    header: () => {
      return <h2>Id</h2>
    }
  },
  {
    accessorKey: 'name',
    header: () => {
      return <h2>Name</h2>
    }
  },
  {
    accessorKey: 'email',
    header: () => {
      return <h2>Email</h2>
    }
  },
  {
    accessorKey: 'role',
    header: () => {
      return <h2>Role</h2>
    }
  },
  {
    accessorKey: 'createdAt',
    header: () => {
      return <h2>Joined At</h2>
    }
  },
  {
    id: 'actions',
    header: () => <div className="font-medium">Actions</div>,
    cell: ({ row }) => (
      <CellAction
        path="users"
        label="User"
        data={{
          id: row.original.id,
          name: row.original.name
        }}
      />
    )
  }
]
