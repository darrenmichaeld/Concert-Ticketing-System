import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import React from "react"

const data = [
  { month: "Jan", amount: 4000 },
  { month: "Feb", amount: 3000 },
  { month: "Mar", amount: 5000 },
  { month: "Apr", amount: 2780 },
  { month: "May", amount: 1890 },
  { month: "Jun", amount: 2390 },
  { month: "Jul", amount: 3490 },
]

export function SalesChart() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm sm:text-base font-medium text-gray-900">Sales Overview (Dummy Data)</h2>
      <div className="h-[200px] sm:h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={true}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}