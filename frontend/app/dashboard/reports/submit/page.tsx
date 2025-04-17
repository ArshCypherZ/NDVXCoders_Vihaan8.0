"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { hasRequiredRole } from "@/lib/auth"
import { trialsAPI, reportsAPI } from "@/lib/api"

interface Trial {
  id: string
  name: string
}

export default function SubmitReportPage() {
  const router = useRouter()
  const [trials, setTrials] = useState<Trial[]>([])
  const [formData, setFormData] = useState({
    trialId: "",
    patientId: "",
    symptoms: "",
    treatment: "",
    outcome: "",
    adverseEffects: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTrials, setIsLoadingTrials] = useState(true)

  useEffect(() => {
    if (!hasRequiredRole(["hospital"])) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    fetchTrials()
  }, [router])

  const fetchTrials = async () => {
    setIsLoadingTrials(true)
    try {
      const responseData = await trialsAPI.getAllTrials(); // Get the data
      // Ensure responseData is an array before setting state
      // TODO: Implement actual filtering based on hospital participation if needed
      if (Array.isArray(responseData)) {
        setTrials(responseData);
      } else if (responseData && Array.isArray(responseData.trials)) { // Handle common case { trials: [...] }
        setTrials(responseData.trials);
      } else if (responseData && Array.isArray(responseData.data)) { // Handle common case { data: [...] }
         setTrials(responseData.data);
      } else {
        console.warn("API response for trials is not an array:", responseData);
        setTrials([]); // Default to empty array if response is not valid
      }
    } catch (error) {
      console.error("Error fetching trials:", error);
      setTrials([]); // Default to empty array on error
    } finally {
      setIsLoadingTrials(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.trialId || !formData.patientId || !formData.symptoms || !formData.treatment) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await reportsAPI.submitReport({
        ...formData,
        date: new Date().toISOString(),
      })

      toast({
        title: "Success",
        description: "Report submitted successfully",
      })

      router.push("/dashboard/reports")
    } catch (error: any) { // Add type annotation
      console.error("Error submitting report:", error)
      // Add user-friendly error toast
      toast({
        title: "Submission Failed",
        description: error?.response?.data?.message || "An unexpected error occurred while submitting the report.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Patient Report</h1>
          <p className="text-muted-foreground">Record patient data for clinical trials</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Patient Report</CardTitle>
              <CardDescription>Enter the details of the patient report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trialId">Clinical Trial</Label>
                <Select
                  value={formData.trialId}
                  onValueChange={(value) => handleSelectChange("trialId", value)}
                  disabled={isLoadingTrials}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trial" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingTrials ? (
                      <SelectItem value="loading" disabled>
                        Loading trials...
                      </SelectItem>
                    ) : trials.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No trials available
                      </SelectItem>
                    ) : (
                      trials.map((trial) => (
                        <SelectItem key={trial.id} value={trial.id}>
                          {trial.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  name="patientId"
                  placeholder="Enter patient identifier"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="Describe patient symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment</Label>
                <Textarea
                  id="treatment"
                  name="treatment"
                  placeholder="Describe treatment administered"
                  value={formData.treatment}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Textarea
                  id="outcome"
                  name="outcome"
                  placeholder="Describe patient outcome"
                  value={formData.outcome}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adverseEffects">Adverse Effects</Label>
                <Textarea
                  id="adverseEffects"
                  name="adverseEffects"
                  placeholder="Describe any adverse effects"
                  value={formData.adverseEffects}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/reports")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
