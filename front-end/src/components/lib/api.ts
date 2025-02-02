// Define the Ticket type.  This is a placeholder, replace with your actual type definition.
type Ticket = {
    id: number
    title: string
    // Add other properties as needed
  }
  
  type Event = {
    id: number
    name: string
    // Add other properties as needed
  }
  
  type MetricData = {
    // Define the structure of your metric data
  }
  
  export async function fetchTickets(){
    const res = await fetch("http://localhost:3000/api/tickets")
    if (!res.ok) throw new Error("Failed to fetch tickets")
    return res.json()
  }
  
  export async function fetchEvents(){
    const res = await fetch("http://localhost:3000/api/events")
    if (!res.ok) throw new Error("Failed to fetch events")
    return res.json()
  }
  
  export async function fetchMetrics(){
    const res = await fetch("http://localhost:3000/api/metrics")
    if (!res.ok) throw new Error("Failed to fetch metrics")
    return res.json()
  }
  
  