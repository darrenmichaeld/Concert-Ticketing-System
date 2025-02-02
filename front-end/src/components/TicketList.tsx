import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { Ticket, TicketsResponse } from "../components/lib/types"

export default function TicketList() {
  const fetchTickets = async (): Promise<Ticket[]> => {
    const response = await fetch("http://localhost:3000/tickets")
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data: TicketsResponse = await response.json()
    return data.data
  }

  const {
    data: tickets,
    isLoading,
    error,
  } = useQuery<Ticket[], Error>({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
    refetchInterval: 15000,
  })

  if (isLoading) return <div className="text-center p-4">Loading tickets...</div>
  if (error) return <div className="text-center p-4 text-red-500">Error fetching tickets: {error.message}</div>
  if (!tickets || tickets.length === 0) return <div className="text-center p-4">No tickets found.</div>

  return (
    <Card className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">Ticket List FROM CMS</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[600px] overflow-auto">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-1/6 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </TableHead>
                <TableHead className="w-1/6 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </TableHead>
                <TableHead className="w-1/6 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </TableHead>
                <TableHead className="w-1/6 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="w-1/6 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="w-1/6 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seat
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket, index) => (
                <TableRow
                  key={ticket.id}
                  className={`transition-colors duration-200 hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <TableCell className="py-4 px-6 text-sm font-medium text-gray-900">{ticket.event}</TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-500">{ticket.type}</TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-500">${ticket.price.toFixed(2)}</TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-500">{ticket.statusTicket}</TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-500">{ticket.name}</TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-500">{ticket.seat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

