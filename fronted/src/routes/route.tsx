import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import App from "../App"
import AuthLayout from "../Auth/AuthLayout"
import SigninPage from "../Auth/SigninPage"
import SignupPage from "../Auth/SignupPage"
import Rootlayout from "../Root/Rootlayout"
import { HomePage } from "../Root/index"
import NotificationPage from "../Root/pages/Nitifications"
import ProfilePage from "../Root/pages/ProfilePage"
import ProtectedRoute from '../components/ProectedRoute'
import ErrorPage from "../components/ErrorPage"
import ForgetPasswordPage from "../Root/pages/ForgetPasswordPage"
import VerifyemailPage from "../Root/pages/VerifyemailPage"
import ResetPasswordPage from "../Root/pages/ResetPasswordPage"


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>

      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="sign-in" element={<SigninPage />} />
        <Route path="sign-up" element={<SignupPage />} />
      </Route>
      {/* //  */}

      {/* //  */}

      {/* Private Routes */}
      <Route element={<ProtectedRoute />}>

        <Route element={<Rootlayout />}>
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
        </Route>
        __________________
        <Route>
          <Route path="forget-password" element={<ForgetPasswordPage />} />
          <Route path="verify-email" element={<VerifyemailPage />} />
                    <Route path="reset-password/:token" element={<ResetPasswordPage />} />


        </Route>
        _________________________

      </Route>

    </Route>
  )
)

export { router }
