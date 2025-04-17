import type * as React from "react"

const ChartStyle = {
  root: "relative",
}

const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className={ChartStyle.root}>{children}</div>
}

const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pointer-events-none absolute z-10 opacity-0 transition-opacity duration-100 data-[state=open]:opacity-100">
      {children}
    </div>
  )
}

const ChartTooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-md border bg-popover p-4 text-sm shadow-sm">{children}</div>
}

const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-center">{children}</div>
}

const ChartLegendContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>
}

const Chart = () => {
  return null
}

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }
