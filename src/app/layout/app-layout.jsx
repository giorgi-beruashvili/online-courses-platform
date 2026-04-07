import { Outlet } from "react-router-dom";
import { Navbar } from "../../shared/components/navbar/navbar";
import { ModalRoot } from "../../shared/components/modal/modal-root";
import { EnrolledCoursesSidebar } from "../../features/enrollments/components/enrolled-courses-sidebar";

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-shell">
        <div className="page-container">
          <Outlet />
        </div>
      </main>

      <ModalRoot />
      <EnrolledCoursesSidebar />
    </div>
  );
}
