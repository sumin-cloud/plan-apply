import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from './api.ts'
const queryClient = new QueryClient({
  defaultOptions : {
    queries:{
      retry:(failureCount,error)=>{
        if(error instanceof ApiError && error.status < 500)return false;
        return failureCount < 2;
      }
    }
  }
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
