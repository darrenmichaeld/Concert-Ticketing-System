import { useState, useEffect } from "react"

interface FetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export default function useFetch<T>(url: string): FetchResult<T> {
  const [result, setResult] = useState<FetchResult<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setResult({ data, loading: false, error: null })
      } catch (error) {
        setResult({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error("An unknown error occurred"),
        })
      }
    }

    fetchData()

    // Cleanup function
    return () => {
      // If needed, you can add cleanup logic here
    }
  }, [url])

  return result
}

