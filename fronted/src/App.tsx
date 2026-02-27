import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

export default function App() {




  return (
    <div>
      <main>
        <Outlet />
        <Toaster toastOptions={{
          style: {
            background: "black",
            color: "white",
            padding: "5px",
          }
        }} />
      </main>
    </div>
  );
}
