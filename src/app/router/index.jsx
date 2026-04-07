import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layout/app-layout";
import { DashboardPage } from "../../pages/dashboard-page";
import { CoursesPage } from "../../pages/courses-page";
import { CourseDetailPage } from "../../pages/course-detail-page";
import { NotFoundPage } from "../../pages/not-found-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "courses/:courseId",
        element: <CourseDetailPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
