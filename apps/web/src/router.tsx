import React from "react"
import { createBrowserRouter } from "react-router-dom"
import { AppShell } from "./ui/AppShell"
import { HomePage } from "./views/HomePage"
import { BrowseCareersPage } from "./views/BrowseCareersPage"
import { SearchCareersPage } from "./views/SearchCareersPage"
import { CareerDetailPage } from "./views/CareerDetailPage"
import { ComparePage } from "./views/ComparePage"
import { QuizPage } from "./views/QuizPage"
import { ResourcesPage } from "./views/ResourcesPage"
import { ChatPage } from "./views/ChatPage"
import { AboutPage } from "./views/AboutPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "careers", element: <SearchCareersPage /> },
      { path: "careers/:slug", element: <CareerDetailPage /> },
      { path: "compare", element: <ComparePage /> },
      { path: "quiz", element: <QuizPage /> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "about", element: <AboutPage /> }
    ]
  }
])


