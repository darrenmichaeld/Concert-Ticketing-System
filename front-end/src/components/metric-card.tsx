import { Card, CardContent } from "../components/ui/card"
import type { LucideIcon } from "lucide-react"
import React from "react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  prefix?: string
  icon: LucideIcon
}

export function MetricCard({ title, value, change, prefix, icon: Icon }: MetricCardProps) {
  return (
    <Card className="border-0 bg-white hover:shadow-lg transition-shadow duration-200">
      <CardContent className="pt-4 sm:pt-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" strokeWidth={1.5} />
            <h3 className="text-sm sm:text-base font-medium text-gray-900">{title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight">
              {prefix}
              {value}
            </p>
            <p className="text-sm sm:text-base text-gray-600">{change}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}