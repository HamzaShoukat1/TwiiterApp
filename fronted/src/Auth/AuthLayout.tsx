import { Outlet } from "react-router-dom"
import XSvg from "../components/Svgs/X.svg"

export default function AuthLayout() {
  return (
    <div className="flex h-screen">
      <div className="hidden xl:flex h-screen w-1/2 items-center justify-center">
        <XSvg className="h-60 w-60 object-cover" />
      </div>

      <div className="flex-1 justify-center items-center flex flex-col py-10">
        <Outlet />
      </div>
    </div>
  )
}
