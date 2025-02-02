import { useState, useEffect } from "react"

export default function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001${url}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setData(result)
      } catch (e) {
        setError(e instanceof Error ? e : new Error("An error occurred while fetching the data."))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, error, loading }
}

