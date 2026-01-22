import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom"
import { router } from './routes/route.tsx'
import { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from '@tanstack/react-query'




const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus:false// Do NOT refetch data when the window regains focus.”
    }
  }
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>

      <RouterProvider router={router} />
    </QueryClientProvider>

  </StrictMode>,
)
