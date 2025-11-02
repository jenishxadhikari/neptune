'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { SongColumn } from '@/features/admin/songs/schemas'

import { CellAction } from './cell-action'

export const columns: ColumnDef<SongColumn>[] = [
  {
    accessorKey: 'title',
    header: () => {
      return <h2>Title</h2>
    }
  },
  {
    accessorKey: 'artist',
    header: () => {
      return <h2>Artist</h2>
    }
  },
  {
    accessorKey: 'album',
    header: () => {
      return <h2>Album</h2>
    }
  },
  {
    accessorKey: 'genre',
    header: () => {
      return <h2>Genre</h2>
    }
  },
  {
    accessorKey: 'year',
    header: () => {
      return <h2>Year</h2>
    }
  },
  {
    accessorKey: 'duration',
    header: () => {
      return <h2>Duration</h2>
    }
  },
  {
    id: 'actions',
    header: () => <div className="font-medium">Actions</div>,
    cell: ({ row }) => (
      <CellAction
        path="songs"
        label="Song"
        data={{
          id: row.original.id,
          name: row.original.title
        }}
      />
    )
  }
]
