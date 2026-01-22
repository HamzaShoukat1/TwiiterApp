import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

export default function App() {
 



  return (
    <div>
      <main>
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
