"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentUser, type User } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"
// We will need an API function later: import { authAPI } from "@/lib/api"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      setName(currentUser.name)
    }
    setIsLoading(false)
  }, [])

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // TODO: Implement API call to update user profile
    console.log("Saving changes for:", name)
    toast({
      title: "Info",
      description: "Profile update functionality not yet implemented.",
    })
    // try {
    //   await authAPI.updateProfile({ name }); // Assuming an updateProfile function exists
    //   toast({ title: "Success", description: "Profile updated successfully." });
    //   // Optionally update user state or refetch
    // } catch (error) {
    //   console.error("Error updating profile:", error);
    //   toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    // } finally {
    //   setIsSaving(false);
    // }
    setIsSaving(false) // Remove this when API call is implemented
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  if (!user) {
    // This case should ideally be handled by the DashboardLayout redirecting
    return <DashboardLayout><p>Please log in to view settings.</p></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSaveChanges}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={user.role} disabled className="capitalize" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                {/* Assuming organization is part of the user object - needs verification */}
                <Input id="organization" value={(user as any).organization || 'N/A'} disabled />
                 <p className="text-xs text-muted-foreground">
                  Organization cannot be changed here.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
