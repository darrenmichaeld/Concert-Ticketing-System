export interface Ticket {
    id: number
    event: string
    type: string
    price: number
    statusTicket: string
    name: string
    seat: string
  }
  
  export interface Event {
    id: number
    documentId: string
    name: string
    date: string
    venue: string
    description: string
    max_capacity: number
    start_time: string
    end_time: string
  }
  
  export interface TicketsResponse {
    data: Ticket[]
    meta: {
      pagination: any
    }
  }
  
  export interface EventsResponse {
    data: Event[]
    meta: {
      pagination: any
    }
  }
  
  