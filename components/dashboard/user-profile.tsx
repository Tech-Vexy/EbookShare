"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, Edit } from "lucide-react"
import type { AuthUser } from "@/lib/auth"

interface UserProfileProps {
  user: AuthUser
  stats: {
    totalUploads: number
    totalDownloads: number
    joinDate: string
  }
}

export function UserProfile({ user, stats }: UserProfileProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile
        </CardTitle>
        <CardDescription>Your account information and activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-accent text-accent-foreground text-lg">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium">{stats.totalUploads}</span>
                <span className="text-muted-foreground">uploads</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{stats.totalDownloads}</span>
                <span className="text-muted-foreground">downloads</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={user.emailVerification ? "default" : "secondary"}>
                {user.emailVerification ? "Verified" : "Unverified"}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Joined {formatDate(stats.joinDate)}</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-fit bg-transparent">
              <Edit className="mr-2 h-3 w-3" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
