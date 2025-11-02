"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Eye, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alert-modal"

import { deleteSong } from "@/features/admin/songs/actions"

type CellActionProps = {
  path: string
  label: string
  data: {
    id: string
    name: string
  }
}

export function CellAction({ path, label, data }: CellActionProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function onDelete() {
    setLoading(true)
    try {
      await deleteSong(data.id)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const handleView = () => {
    router.push(`/${path}/${data.id}`)
  }

  const handleEdit = () => {
    router.push(`/admin/${path}/edit/${data.id}`)
  }

  return (
    <div className="max-w-fit">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        title={`Delete ${label}`}
        description={`Are you sure you want to delete "${data.name}"? This action cannot be undone.`}
      />

      <div className="flex items-center gap-x-2">

        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-blue-50 hover:text-blue-600"
          onClick={handleView}
        >
          <Eye className="size-4" />
          <span className="sr-only">View {label}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-emerald-50 hover:text-emerald-600"
          onClick={handleEdit}
        >
          <Edit className="size-4" />
          <span className="sr-only">Edit {label}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-red-50 hover:text-red-600"
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Trash className="size-4" />
          <span className="sr-only">Delete {label}</span>
        </Button>
      </div>
    </div>
  )
}
