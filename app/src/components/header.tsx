import { LucideIcon } from 'lucide-react'

interface HeaderProps {
  icon: LucideIcon
  title: string
  description: string
  children?: React.ReactNode
}

export function Header({ title, description, icon: Icon, children }: HeaderProps) {
  return (
    <header className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-linear-to-br from-purple-100 to-pink-100 p-2">
          <Icon className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-3xl">
            {title}
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">{description}</p>
        </div>
      </div>
      {children}
    </header>
  )
}
