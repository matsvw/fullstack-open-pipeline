import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

import { NotificationContextProvider } from '../contexts/NotificationContext'
import { UserContextProvider } from './MockUserContext'

export function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <Router>
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <UserContextProvider>{ui}</UserContextProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    </Router>
  )
}
