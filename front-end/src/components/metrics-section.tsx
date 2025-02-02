import { DollarSign, Users, Calendar, Ticket } from 'lucide-react'
import { MetricCard } from "./metric-card"
import React from "react"

const metrics = [
  {
    title: "Total Revenue (Dummy Data)",
    icon: DollarSign,
    prefix: "$",
    value: "75,231.89",
    change: "+20.1% from last month",
  },
  {
    title: "Active Events (Dummy Data)",
    icon: Calendar,
    value: "23",
    change: "+2 from last week",
  },
  {
    title: "Total Attendees (Dummy Data)",
    icon: Users,
    value: "13,596",
    change: "+10.7% from last month",
  },
  {
    title: "Tickets Have Sold (Dummy Data)",
    icon: Ticket,
    value: "1,205",
    change: "+5.4% from last week",
  },
]

export function MetricsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="w-full">
          <MetricCard
            title={metric.title}
            icon={metric.icon}
            value={metric.value}
            prefix={metric.prefix}
            change={metric.change}
          />
        </div>
      ))}
    </div>
  )
}