import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getChatAppContract, getEnsContract, getProvider } from "@/constants";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { ethers } from "ethers";
import {
  EllipsisVertical,
  Loader2,
  Mic,
  Plus,
  SendHorizonal,
  Smile,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function MessageContainer() {
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);

  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { id } = useParams();
  const username = ethers.decodeBytes32String(id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userMessage) {
      toast("You cannot send an empty message");
      setIsLoading(false);
    } else {
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();

      const contract = getChatAppContract(signer);

      try {
        const tx = await contract.sendMessage(
          ethers.encodeBytes32String(username),
          userMessage
        );
        const receipt = await tx.wait();

        console.log("receipt: ", receipt);

        if (receipt.status) {
          return toast("Message sent successfully");
        } else {
          toast("Failed transaction", {
            description: "Failed to send message",
          });
        }
      } catch (error) {
        console.log(error);

        if (error.reason === "rejected") {
          toast("Failed transaction", {
            description: "You rejected the transaction",
          });
        } else {
          toast("Error transaction", {
            description: error,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
        const contract = getChatAppContract(signer);
        const ensContract = getEnsContract(signer);

        const currentUser = await ensContract.getUsernameByAddress(address);

        const data = {
          currentChat: ethers.encodeBytes32String(username),
          loggedInUser: currentUser,
        };
        console.log(data);

        const tx = await contract.getChatHistory(
          ethers.encodeBytes32String(currentUser),
          id
        );
        setAllMessages(tx);
        console.log(tx);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full h-[59px] bg-[#202c33] flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <h1>{username}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" className="rounded-full" variant="ghost">
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* //! users chat */}
      <div className="flex-1 lg:px-[63px] flex flex-col justify-end gap-1 py-4 overflow-y-auto">
        {allMessages?.map((_, _key) => (
          <div className="flex gap-3 justify-start w-full" key={_key}>
            <div className="w-max max-w-[645px] h-max bg-[#202C33] rounded-md relative">
              <span className="absolute top-0 -left-3 w-4 h-4 bg-[#202c33]"></span>
              <span className="absolute top-1 -left-[26px] w-6 h-4 bg-[#111B21] rotate-45"></span>
              <p className="text-sm py-1.5 px-3">
                Boss with the money, I de greet
              </p>
            </div>
          </div>
        ))}
        <div className="flex gap-3 justify-end w-full">
          <div className="w-max max-w-xl h-max bg-[#005C4B] rounded-md relative">
            <span className="absolute top-0 -right-3 w-4 h-4 bg-[#005C4B]"></span>
            <span className="absolute top-1 -right-[26px] w-6 h-4 bg-[#111B21] -rotate-45"></span>
            <p className="text-sm py-1.5 px-2">{address}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full h-[63px] bg-[#202c33] border-t flex items-center justify-between px-4 py-2.5 gap-3">
        <Smile className="w-6 h-6 opacity-50" />
        <Plus className="w-6 h-6 opacity-50" />
        <Input
          value={userMessage}
          disabled={isLoading}
          onChange={(e) => setUserMessage(e.target.value)}
          className="w-full bg-[#2A3942] border-0 h-full px-4 text-base"
          placeholder={`Send a message to ${username}`}
        />
        {!userMessage.trimStart() ? (
          <Mic className="w-6 h-6 opacity-50" />
        ) : isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <SendHorizonal className="w-5 h-5" onClick={handleSubmit} />
        )}
      </form>
    </div>
  );
}
