import Link from 'next/link'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthWrapperProps {
  title: string
  description: string
  children: React.ReactNode
  type: "login" | "register"
}

export function AuthWrapper({ title, description, children, type }: AuthWrapperProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter>
        {
          type === "login" ? (
            <div className="text-sm flex items-center justify-center w-full gap-1">
              <p>Don&apos;t have an account?</p>
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="w-full text-center text-sm flex items-center justify-center gap-1">
              <p>Already have an account?</p>
              <Link href="/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          )
        }
      </CardFooter>
    </Card>
  )
}
