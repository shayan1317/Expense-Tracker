import { type ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "@context/AuthProvider";

type LayoutProps = { children: ReactNode };

const DashboardLayout = ({ children }: LayoutProps) => {
  const { user } = useAuth() || {};
  console.log("user", user);
  return (
    <div className="h-screen overflow-hidden bg-[#fcfbfc] font-[Poppins] flex flex-col">
      {/* Header - Fixed height */}
      <Header />

      {/* Main layout container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width */}
        <aside className="w-[20%] min-w-[240px] bg-white shadow-sm overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Main content - Scrollable */}

        <main className="w-[80%] py-6 h-full">
          <div className="px-6 overflow-y-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
