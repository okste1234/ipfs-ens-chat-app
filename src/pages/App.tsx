import Form from "@/components/shared/Form";
import MessageContainer from "@/components/shared/MessageContainer";
import Sidebar from "@/components/shared/Sidebar";

export default function App() {
  const isAuthenticated = false;

  return (
    <div className="flex-1 flex flex-col h-screen p-6">
      <div className="w-full h-full max-w-[1440px] overflow-y-auto bg-secondary/30 mx-auto rounded-md flex">
        {isAuthenticated ? (
          <>
            <Sidebar />
            <MessageContainer />
          </>
        ) : (
          <Form />
        )}
      </div>
    </div>
  );
}
