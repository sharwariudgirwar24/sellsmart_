import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppDataProvider } from './context/AppDataContext'

// ── Pages ──────────────────────────────────────────────────────────────────
import LandingPage from './pages/Landing'

// Auth
import RoleSelect from './pages/auth/RoleSelect'
import VendorLogin from './pages/auth/VendorLogin'
import VendorSignup from './pages/auth/VendorSignup'
import CustomerLogin from './pages/auth/CustomerLogin'
import CustomerSignup from './pages/auth/CustomerSignup'

// Dashboards
import VendorDashboard from './pages/vendor/VendorDashboard'
import CustomerDashboard from './pages/customer/CustomerDashboard'

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
    return (
        <AppDataProvider>
            <BrowserRouter>
                <Routes>
                    {/* Landing */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Auth gate */}
                    <Route path="/role-select" element={<RoleSelect />} />

                    {/* Vendor auth */}
                    <Route path="/vendor-login" element={<VendorLogin />} />
                    <Route path="/vendor-signup" element={<VendorSignup />} />

                    {/* Customer auth */}
                    <Route path="/customer-login" element={<CustomerLogin />} />
                    <Route path="/customer-signup" element={<CustomerSignup />} />

                    {/* Dashboards */}
                    <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                    <Route path="/customer-dashboard" element={<CustomerDashboard />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AppDataProvider>
    )
}
