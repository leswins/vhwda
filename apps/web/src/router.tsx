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
import { ScholarshipSubmitPage } from "./views/ScholarshipSubmitPage"
import { ScholarshipPortalPage } from "./views/ScholarshipPortalPage"
import { ResourceSubmitPage } from "./views/ResourceSubmitPage"
import { ResourcePortalPage } from "./views/ResourcePortalPage"
import { TeacherPortalPage } from "./views/TeacherPortalPage"
import { TeacherAuthCallbackPage } from "./views/TeacherAuthCallbackPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "careers", element: <SearchCareersPage /> },
      { path: "browse", element: <BrowseCareersPage /> },
      { path: "careers/:slug", element: <CareerDetailPage /> },
      { path: "compare", element: <ComparePage /> },
      { path: "quiz", element: <QuizPage /> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "teachers", element: <TeacherPortalPage /> },
      { path: "teachers/auth/callback", element: <TeacherAuthCallbackPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "resource-submit", element: <ResourceSubmitPage /> },
      { path: "resource-portal", element: <ResourcePortalPage /> },
      { path: "scholarship-submit", element: <ScholarshipSubmitPage /> },
      { path: "scholarship-portal", element: <ScholarshipPortalPage /> }
    ]
  }
])


