"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Download, FileText, AlertTriangle } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { hasRequiredRole } from "@/lib/auth"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface FinalReport {
  id: string
  trialId: string
  summary: string
  anomalies: string[]
  patientOutcomes: {
    improved: number
    unchanged: number
    worsened: number
  }
  adverseEffects: {
    type: string
    count: number
  }[]
  date: string
}

interface Trial {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function FinalReportPage() {
  const router = useRouter()
  const params = useParams()
  const trialId = params.trialId as string

  const [finalReport, setFinalReport] = useState<FinalReport | null>(null)
  const [trial, setTrial] = useState<Trial | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!hasRequiredRole(["manufacturer", "regulator"])) {
      router.push("/dashboard")
      return
    }

    fetchData()
  }, [trialId, router])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // In a real app, you'd fetch the actual trial and final report data
      // For now, we'll create mock data

      // Mock trial data
      const mockTrial = {
        id: trialId,
        name: "Drug XYZ Efficacy Trial",
        description: "A clinical trial to evaluate the efficacy of Drug XYZ for treatment of condition ABC",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        status: "Completed",
      }

      // Mock final report data
      const mockFinalReport = {
        id: "fr-" + trialId,
        trialId: trialId,
        summary:
          "The trial showed a significant improvement in patient outcomes with Drug XYZ compared to placebo. 75% of patients showed improvement in symptoms with minimal adverse effects.",
        anomalies: [
          "3 patients reported unusual skin reactions that were not observed in previous studies",
          "Efficacy was notably lower in patients over 65 years of age",
        ],
        patientOutcomes: {
          improved: 75,
          unchanged: 15,
          worsened: 10,
        },
        adverseEffects: [
          { type: "Nausea", count: 12 },
          { type: "Headache", count: 8 },
          { type: "Dizziness", count: 5 },
          { type: "Skin Rash", count: 3 },
          { type: "Fatigue", count: 7 },
        ],
        date: "2024-01-15",
      }

      setTrial(mockTrial)
      setFinalReport(mockFinalReport)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const patientOutcomesData = finalReport
    ? [
        { name: "Improved", value: finalReport.patientOutcomes.improved },
        { name: "Unchanged", value: finalReport.patientOutcomes.unchanged },
        { name: "Worsened", value: finalReport.patientOutcomes.worsened },
      ]
    : []

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isLoading ? <Skeleton className="h-9 w-64" /> : `Final Report: ${trial?.name}`}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? <Skeleton className="h-5 w-96 mt-1" /> : `AI-analyzed results for the completed trial`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : finalReport ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Summary
                </CardTitle>
                <CardDescription>Generated on {formatDate(finalReport.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">{finalReport.summary}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="outcomes" className="space-y-4">
              <TabsList>
                <TabsTrigger value="outcomes">Patient Outcomes</TabsTrigger>
                <TabsTrigger value="adverse-effects">Adverse Effects</TabsTrigger>
                <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
              </TabsList>

              <TabsContent value="outcomes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Outcomes</CardTitle>
                    <CardDescription>Distribution of patient outcomes after treatment</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={patientOutcomesData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {patientOutcomesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="adverse-effects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Adverse Effects</CardTitle>
                    <CardDescription>Frequency of reported adverse effects</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={finalReport.adverseEffects}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="anomalies" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Detected Anomalies
                    </CardTitle>
                    <CardDescription>Unusual patterns detected by AI analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {finalReport.anomalies.map((anomaly, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{anomaly}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="mr-2 h-4 w-4" />
                Download Full Report
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-center text-muted-foreground mb-2">No final report available for this trial.</p>
              <p className="text-center text-sm text-muted-foreground">
                The trial may still be in progress or reports have not been finalized.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
