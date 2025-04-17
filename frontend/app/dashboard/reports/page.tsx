"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, ArrowRight, FileCheck } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getCurrentUser } from "@/lib/auth"

interface Report {
  id: string
  trialId: string
  trialName: string
  patientId: string
  date: string
  status: string
}

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(getCurrentUser())
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      // In a real app, you'd fetch the actual reports
      // For now, we'll create mock data
      const mockReports = [
        {
          id: "r1",
          trialId: "t1",
          trialName: "Drug XYZ Efficacy Trial",
          patientId: "P001",
          date: "2023-06-15",
          status: "submitted",
        },
        {
          id: "r2",
          trialId: "t1",
          trialName: "Drug XYZ Efficacy Trial",
          patientId: "P002",
          date: "2023-06-18",
          status: "submitted",
        },
        {
          id: "r3",
          trialId: "t2",
          trialName: "Vaccine ABC Safety Trial",
          patientId: "P003",
          date: "2023-07-01",
          status: "finalized",
        },
        {
          id: "r4",
          trialId: "t2",
          trialName: "Vaccine ABC Safety Trial",
          patientId: "P004",
          date: "2023-07-05",
          status: "finalized",
        },
      ]

      setReports(mockReports)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReport = () => {
    router.push("/dashboard/reports/submit")
  }

  const handleViewReport = (reportId: string) => {
    router.push(`/dashboard/reports/${reportId}`)
  }

  const handleViewFinalReport = (trialId: string) => {
    router.push(`/dashboard/reports/final/${trialId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>
      case "finalized":
        return <Badge className="bg-green-100 text-green-800">Finalized</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  // Group reports by trial
  const reportsByTrial = reports.reduce((acc: Record<string, Report[]>, report) => {
    if (!acc[report.trialId]) {
      acc[report.trialId] = []
    }
    acc[report.trialId].push(report)
    return acc
  }, {})

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Reports</h1>
            <p className="text-muted-foreground">View and manage patient reports for clinical trials</p>
          </div>
          {user?.role === "hospital" && (
            <Button onClick={handleSubmitReport} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Submit Report
            </Button>
          )}
        </div>

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ) : Object.keys(reportsByTrial).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-center text-muted-foreground mb-4">No reports available yet.</p>
              {user?.role === "hospital" && (
                <Button onClick={handleSubmitReport} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Your First Report
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(reportsByTrial).map(([trialId, trialReports]) => {
              const allFinalized = trialReports.every((report) => report.status.toLowerCase() === "finalized")
              const trialName = trialReports[0].trialName

              return (
                <Card key={trialId}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{trialName}</CardTitle>
                      <CardDescription>
                        {trialReports.length} report{trialReports.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                    {allFinalized && (user?.role === "manufacturer" || user?.role === "regulator") && (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => handleViewFinalReport(trialId)}
                      >
                        <FileCheck className="h-4 w-4" />
                        View Final Report
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trialReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.patientId}</TableCell>
                            <TableCell>{formatDate(report.date)}</TableCell>
                            <TableCell>{getStatusBadge(report.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewReport(report.id)}>
                                View
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
