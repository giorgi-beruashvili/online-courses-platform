import { Outlet } from "react-router-dom";
import { Navbar } from "../../shared/components/navbar/navbar";

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-shell">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
