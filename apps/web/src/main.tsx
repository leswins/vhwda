import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { router } from "./router"
import { initAnalytics } from "./utils/analytics"
import "./styles/globals.css"

initAnalytics()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
)


