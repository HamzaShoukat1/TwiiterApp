// ErrorPage.tsx
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    // Errors thrown from loaders/actions or with status
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
        <p className="text-xl mt-2">{error.statusText || "Something went wrong"}</p>
        <p className="text-gray-500">Status Code: {error.status}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-red-100">Something went wrong!</h1>
      <p className="text-red-500">{(error as Error)?.message || "Unknown error"}</p>
    </div>
  );
}
