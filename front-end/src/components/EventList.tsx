import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { Event } from "../components/lib/types"

interface EventListProps {
  events: Event[]
}

export default function EventList({ events }: EventListProps) {
  if (!events || events.length === 0) return <div className="text-center p-4">No events found.</div>

  return (
    <Card className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">Event List FROM CMS</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[600px] overflow-auto">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-1/4 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="w-1/6 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="w-1/6 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </TableHead>
                <TableHead className="w-1/6 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </TableHead>
                <TableHead className="w-1/4 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, index) => (
                <TableRow
                  key={event.id}
                  className={`transition-colors duration-200 hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <TableCell className="py-4 px-6 text-sm font-medium text-gray-900">{event.name}</TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-500">{event.venue}</TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-500">
                    {event.max_capacity?.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-500">
                    {event.start_time} - {event.end_time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

