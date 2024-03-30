import Sidebar from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";

export default function Messenger() {
  return (
    <div className="flex flex-1 h-screen">
      <Sidebar />
      <div className="flex-1 p-3 h-full">
        <div className="bg-secondary/30 border flex-1 flex flex-col h-full rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
