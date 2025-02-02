import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './components/lib/react-query'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
