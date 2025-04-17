import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, FileText, Activity } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Veridose</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div>
            <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700 mr-2">
              <Link href="/auth/login">
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/register">
                Register
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Secure Clinical Trial Management
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Veridose is a blockchain-integrated system for managing and analyzing patient reports from drug
                    trials with advanced AI analysis.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/auth/login">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg?height=550&width=550"
                  alt="Veridose Platform"
                  className="rounded-lg object-cover shadow-lg"
                  width={550}
                  height={550}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Veridose provides a comprehensive solution for clinical trial management
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Shield className="h-12 w-12 text-emerald-600" />
                <h3 className="text-xl font-bold">Blockchain Security</h3>
                <p className="text-sm text-gray-500 text-center">
                  Immutable records ensure data integrity throughout the clinical trial process
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <FileText className="h-12 w-12 text-emerald-600" />
                <h3 className="text-xl font-bold">Streamlined Reporting</h3>
                <p className="text-sm text-gray-500 text-center">
                  Simplified submission and management of patient reports for hospitals
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Activity className="h-12 w-12 text-emerald-600" />
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-sm text-gray-500 text-center">
                  Advanced anomaly detection and result summarization using AI
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="text-lg font-bold">Veridose</span>
            </div>
            <p className="text-sm text-gray-500">Secure clinical trial management with blockchain technology</p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-sm font-medium">Company</div>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="#" className="hover:underline">
                About
              </Link>
              <Link href="#" className="hover:underline">
                Careers
              </Link>
              <Link href="#" className="hover:underline">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-sm font-medium">Legal</div>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="hover:underline">
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-gray-500">© 2025 Veridose. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
