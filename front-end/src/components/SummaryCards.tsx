import { Card, CardContent } from "./ui/card"
import { DollarSign, Users, Calendar, Ticket } from "lucide-react"
import React from "react"


const summaryData = [
  {
    title: "Total Revenue",
    icon: DollarSign,
    prefix: "$",
    value: "75,231.89",
    change: "+20.1% from last month",
    iconBackground: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Active Events",
    icon: Calendar,
    value: "23",
    change: "+2 from last week",
    iconBackground: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    title: "Total Attendees",
    icon: Users,
    value: "13,596",
    change: "+10.7% from last month",
    iconBackground: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
  {
    title: "Tickets Sold",
    icon: Ticket,
    value: "1,205",
    change: "+5.4% from last week",
    iconBackground: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
]

export default function SummaryCards() {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => (
        <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-base sm:text-lg font-medium text-gray-600">{item.title}</p>
                <div className={`p-1.5 sm:p-2 rounded-full ${item.iconBackground}`}>
                  <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.iconColor}`} />
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {item.prefix && <span className="text-xl sm:text-2xl mr-1">{item.prefix}</span>}
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">{item.change}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}