import { Suspense, lazy } from "react"
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import App from "../App"
import ProtectedRoute from '../hooks/ProectedRoute'
import ErrorPage from "../components/ErrorPage"
import LoadingSpinner from "../components/LoadingSpinner"

// Full-screen loader for Suspense fallback
const LoaderFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
    <LoadingSpinner size="lg" />
  </div>
)

// Lazy-loaded layouts
const AuthLayout = lazy(() => import("../Auth/AuthLayout"))
const RootLayout = lazy(() => import("../Root/Rootlayout"))

// Lazy-loaded pages
const SigninPage = lazy(() => import("../Auth/SigninPage"))
const SignupPage = lazy(() => import("../Auth/SignupPage"))
const HomePage = lazy(() => import("../Root/pages/HomePage"))
const NotificationPage = lazy(() => import("../Root/pages/Nitifications"))
const ProfilePage = lazy(() => import("../Root/pages/ProfilePage"))
const ForgetPasswordPage = lazy(() => import("../Root/pages/ForgetPasswordPage"))
const VerifyEmailPage = lazy(() => import("../Root/pages/VerifyemailPage"))
const ResetPasswordPage = lazy(() => import("../Root/pages/ResetPasswordPage"))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>

      {/* Public Routes */}
      <Route
        element={
          <Suspense fallback={<div className="bg-black w-full h-full fixed inset-0 z-50" />}>
            <AuthLayout />
          </Suspense>
        }
      >
        <Route path="sign-in" element={<SigninPage />} />
        <Route path="sign-up" element={<SignupPage />} />
      </Route>

      {/* Private Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <Suspense fallback={<div className="bg-black w-full h-full fixed inset-0 z-50" />}>
              <RootLayout /> {/* Contains <Outlet /> */}
            </Suspense>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />

          {/* Optional private/public routes inside RootLayout */}
          <Route path="forget-password" element={<ForgetPasswordPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
      </Route>

    </Route>
  )
)

export { router }