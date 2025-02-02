import React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import EventList from "../components/EventList"
import TicketList from "../components/TicketList"
import { MetricsSection } from "../components/metrics-section"
import { SalesChart } from "../components/sales-chart"

export default function Main() {
  const [activeTab, setActiveTab] = useState("events")

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-3 xs:py-4 sm:py-6 md:py-8 px-3 xs:px-4 sm:px-6">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 xs:mb-6 sm:mb-8 md:mb-12 p-2 xs:p-3 sm:p-4 rounded-lg">
          Event Management System
        </h1>

        <div className="space-y-4 xs:space-y-6 sm:space-y-8 md:space-y-12">
          {/* Metrics Section */}
          <div className="px-0 xs:px-2">
            <MetricsSection />
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-lg p-3 xs:p-4 sm:p-6">
            <SalesChart />
          </div>

          {/* Tabs */}
          <div className="space-y-3 xs:space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full max-w-[300px] xs:max-w-[400px]">
                <TabsTrigger value="events" className="flex-1 text-sm xs:text-base">Events</TabsTrigger>
                <TabsTrigger value="tickets" className="flex-1 text-sm xs:text-base">Tickets</TabsTrigger>
              </TabsList>
              <TabsContent value="events" className="mt-3 xs:mt-4">
                <EventList />
              </TabsContent>
              <TabsContent value="tickets" className="mt-3 xs:mt-4">
                <TicketList />
              </TabsContent>
            </Tabs>
          </div>

          {/* Status Bar */}
          <div className="bg-white rounded-lg p-2 xs:p-3 sm:p-4 flex flex-col xs:flex-row items-start xs:items-center justify-between text-xs sm:text-sm text-gray-500 space-y-2 xs:space-y-0">
            <div className="text-[11px] xs:text-xs sm:text-sm">
              Last updated: {new Date().toLocaleTimeString()} (Every 15 seconds)
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2">
              <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-500 rounded-full" />
              <span className="text-[11px] xs:text-xs sm:text-sm">Real-time updates active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}