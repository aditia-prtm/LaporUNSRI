import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes/AppRoutes'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
