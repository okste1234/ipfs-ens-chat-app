import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { EllipsisVertical, ListFilter } from "lucide-react";
import { Input } from "../ui/input";
import Chat from "./Chat";
import { useEffect, useState } from "react"; // Added useState
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getChatAppContract, getProvider } from "@/constants";

export default function Sidebar() {
  const { walletProvider } = useWeb3ModalProvider();
  const [everyUser, setEveryUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // fetchAllUserNames
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
        const contract = getChatAppContract(signer);
        const tx = await contract.fetchAllUserNames();
        setEveryUser(tx);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, [walletProvider]); // Add walletProvider to the dependency array

  return (
    <div className="w-full max-w-[450px] flex-1 flex flex-col border-r h-full">
      <div className="w-full h-[59px] bg-[#202c33] flex items-center justify-between px-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2">
          <Button size="icon" className="rounded-full" variant="ghost">
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 py-2 overflow-y-auto">
        <div className="px-4 flex items-center gap-3 mb-2">
          <Input
            className="bg-[#202c33] border-0 font-light"
            placeholder="Search or start a new chat"
          />
          <ListFilter className="w-5 h-5" />
        </div>

        <div className="flex flex-col-reverse">
          {isLoading ? (
            <div>Loading</div>
          ) : everyUser <= 0 ? (
            <div className="w-full py-6 flex items-center justify-center">
              <p>No chats yet.</p>
            </div>
          ) : (
            <Chat users={everyUser} />
          )}
        </div>
      </div>
    </div>
  );
}
