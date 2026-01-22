import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import App from "../App"
import AuthLayout from "../Auth/AuthLayout"
import SigninPage from "../Auth/SigninPage"
import SignupPage from "../Auth/SignupPage"
import Rootlayout from "../Root/Rootlayout"
import { HomePage } from "../Root/index"
import NotificationPage from "../Root/pages/Nitifications"
import ProfilePage from "../Root/ProfilePage"
import ProtectedRoute from '../components/ProectedRoute'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      //public route
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SigninPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
      </Route>

      //private route
      <Route element={<ProtectedRoute />}>

        <Route element={<Rootlayout />}>
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />


        </Route>
      </Route>


    </Route>
  )
)

export { router }
