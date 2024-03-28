import MaxWrapper from "@/components/shared/MaxWrapper";
import Sidebar from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="h-screen xl:p-5 bg-[#0C1317]">
      <MaxWrapper className="bg-[#111B21] h-full flex flex-1">
        <Sidebar />
        <Outlet />
      </MaxWrapper>
    </div>
  );
}
