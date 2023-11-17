import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>123</div>,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};
export { Router };
