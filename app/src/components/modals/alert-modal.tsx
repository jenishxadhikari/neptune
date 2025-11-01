'use client'

import { LoaderCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/modals/modal'

interface AlertModalProps {
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

export function AlertModal({ title, description, isOpen, onClose, onConfirm, loading }: AlertModalProps) {
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          Delete
        </Button>
      </div>
    </Modal>
  )
}
