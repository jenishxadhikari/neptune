"use client"

import { format } from "date-fns"
import { Calendar } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Logout } from "@/components/logout"

interface ProfileInfoProps {
  userData: {
    id: string
    name: string
    email: string
    joinDate: Date
  }
}
export function UserInfo({ userData }: ProfileInfoProps) {

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="text-center space-y-4">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarFallback className="bg-gray-200 text-gray-600 text-2xl">
            {userData?.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">{userData?.name}</h2>
          <p className="text-gray-600">{userData?.email}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Joined {format(userData.joinDate, 'MMMM do, yyyy')}</span>
        </div>

        <Logout />
      </CardContent>
    </Card>
  )
}
