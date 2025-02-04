import { useQuery } from "@tanstack/react-query"
import type { EventsResponse, TicketsResponse } from "../components/lib/types"

async function fetchEventTicketData() {
  const [eventsResponse, ticketsResponse] = await Promise.all([
    fetch("http://localhost:3000/events"),
    fetch("http://localhost:3000/tickets"),
  ])

  if (!eventsResponse.ok || !ticketsResponse.ok) {
    throw new Error("Network response was not ok")
  }

  const eventsData: EventsResponse = await eventsResponse.json()
  const ticketsData: TicketsResponse = await ticketsResponse.json()

  return {
    events: eventsData.data,
    tickets: ticketsData.data,
    lastUpdated: new Date().toLocaleTimeString(),
  }
}

export function useEventTicketData() {
  return useQuery({
    queryKey: ["eventTicketData"],
    queryFn: fetchEventTicketData,
    refetchInterval: 15000,
  })
}

