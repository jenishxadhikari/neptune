import { LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  pending: boolean
  label: string
  variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost"
}

export function SubmitButton({ pending, label, variant = "default" }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" variant={variant} disabled={pending}>
      {pending && <LoaderCircle className="size-4 animate-spin" />}{" "}
      {label}
    </Button>
  )
}
