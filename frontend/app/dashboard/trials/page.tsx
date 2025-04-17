"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Calendar, Users, ArrowRight, BrainCircuit, Loader2 } from "lucide-react" // Added BrainCircuit, Loader2
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getCurrentUser, hasRequiredRole } from "@/lib/auth" // Added hasRequiredRole
import { trialsAPI, aiAPI } from "@/lib/api" // Added aiAPI
import { toast } from "@/components/ui/use-toast" // Added toast
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion" // Added Accordion

interface Trial {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
  hospitals: any[] // Consider defining a Hospital type if needed elsewhere
  manufacturer: {
    id: string
    name: string
  }
  // Add optional field for AI results
  aiPrediction?: any | null
}

// State for AI predictions (loading and results)
interface AIPredictionState {
  [trialId: string]: {
    isLoading: boolean;
    error: string | null;
    data: any | null; // Store the raw prediction data
  }
}

export default function TrialsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [trials, setTrials] = useState<Trial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [aiPredictions, setAiPredictions] = useState<AIPredictionState>({}) // State for AI results

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    fetchTrials()
  }, []) // Removed router dependency as it wasn't used here

  const fetchTrials = async () => {
    setIsLoading(true)
    try {
      const responseData = await trialsAPI.getAllTrials(); // Get the data
      // Ensure responseData is an array before setting state
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
      setIsLoading(false);
    }
  }

  const handlePredictAnomaly = async (trialId: string) => {
    setAiPredictions(prev => ({
      ...prev,
      [trialId]: { isLoading: true, error: null, data: null }
    }));

    try {
      const result = await aiAPI.predictTrialAnomaly(trialId);
      if (result.success) {
        setAiPredictions(prev => ({
          ...prev,
          [trialId]: { isLoading: false, error: null, data: result.data }
        }));
        toast({ title: "AI Analysis Complete", description: `Anomaly prediction finished for trial ${trialId}.` });
      } else {
        throw new Error(result.message || "AI prediction failed.");
      }
    } catch (error: any) {
      console.error(`Error predicting anomaly for trial ${trialId}:`, error);
      const errorMessage = error?.response?.data?.message || error.message || "Failed to get AI prediction.";
      setAiPredictions(prev => ({
        ...prev,
        [trialId]: { isLoading: false, error: errorMessage, data: null }
      }));
      toast({ title: "AI Analysis Failed", description: errorMessage, variant: "destructive" });
    }
  }


  const handleCreateTrial = () => {
    router.push("/dashboard/trials/create")
  }

  const handleViewTrial = (trialId: string) => {
    router.push(`/dashboard/trials/${trialId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clinical Trials</h1>
            <p className="text-muted-foreground">View and manage all clinical trials</p>
          </div>
          {user?.role === "manufacturer" && (
            <Button onClick={handleCreateTrial} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Trial
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : trials.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground mb-4">No clinical trials available yet.</p>
              {user?.role === "manufacturer" && (
                <Button onClick={handleCreateTrial} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Trial
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trials.map((trial) => (
              <Card key={trial.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{trial.name}</CardTitle>
                    <Badge className={getStatusColor(trial.status)}>{trial.status}</Badge>
                  </div>
                  <CardDescription>{trial.manufacturer.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{trial.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {formatDate(trial.startDate)} - {formatDate(trial.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{trial.hospitals?.length || 0} Hospitals</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => handleViewTrial(trial.id)}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  {/* AI Prediction Section */}
                  {hasRequiredRole(['manufacturer', 'regulator']) && (
                    <div className="mt-4 border-t pt-4">
                       <Button
                         variant="secondary"
                         className="w-full mb-2"
                         onClick={() => handlePredictAnomaly(trial.id)}
                         disabled={aiPredictions[trial.id]?.isLoading}
                       >
                         {aiPredictions[trial.id]?.isLoading ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                           <BrainCircuit className="mr-2 h-4 w-4" />
                         )}
                         {aiPredictions[trial.id]?.isLoading ? 'Analyzing...' : 'Predict Anomalies'}
                       </Button>

                       {/* Display AI Results */}
                       {aiPredictions[trial.id] && !aiPredictions[trial.id]?.isLoading && (
                         <div className="mt-2 text-xs p-2 rounded bg-muted">
                           {aiPredictions[trial.id]?.error ? (
                             <p className="text-red-600">Error: {aiPredictions[trial.id]?.error}</p>
                           ) : aiPredictions[trial.id]?.data ? (
                             <Accordion type="single" collapsible className="w-full">
                               <AccordionItem value="item-1">
                                 <AccordionTrigger className="text-xs py-1">View AI Analysis Summary</AccordionTrigger>
                                 <AccordionContent className="text-xs">
                                   <p><strong>Overall Hospital Prediction:</strong> {aiPredictions[trial.id]?.data?.overall_hospital_prediction?.label ?? 'N/A'}</p>
                                   <p>Anomalous Patients: {aiPredictions[trial.id]?.data?.overall_hospital_prediction?.anomaly_count ?? 'N/A'} / {aiPredictions[trial.id]?.data?.overall_hospital_prediction?.total_patients ?? 'N/A'}</p>
                                   {aiPredictions[trial.id]?.data?.overall_hospital_prediction?.aggregated_triggered_rules?.length > 0 && (
                                      <>
                                        <p className="mt-1"><strong>Triggered Rules:</strong></p>
                                        <ul className="list-disc pl-4">
                                          {aiPredictions[trial.id]?.data?.overall_hospital_prediction?.aggregated_triggered_rules.map((rule: string, index: number) => (
                                            <li key={index}>{rule}</li>
                                          ))}
                                        </ul>
                                      </>
                                    )}
                                   {/* Optionally add button/link to view full JSON */}
                                 </AccordionContent>
                               </AccordionItem>
                             </Accordion>
                           ) : (
                             <p>No prediction data available.</p>
                           )}
                         </div>
                       )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
