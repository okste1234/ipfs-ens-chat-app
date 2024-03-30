import { Loader2, Mic, Plus, SendHorizonal, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { cn, getInitials } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { Button } from "../ui/button";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getChatAppContract, getEnsContract, getProvider } from "@/constants";
import { toast } from "sonner";

export default function Chats() {
  const { id } = useParams();
  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [currentReceiver, setCurrentReceiver] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initialize isLoading state to true

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    if (!userMessage) {
      setIsSending(false);
      toast("Please enter a message");
      return;
    } else {
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const contract = getChatAppContract(signer);

      try {
        const tx = await contract.sendMessage(id, userMessage);
        const receipt = await tx.wait();

        if (receipt.status) {
          setUserMessage("");
          return toast("Message sent successfully");
        } else {
          toast("Failed transaction", {
            description: "Failed to send message",
          });
        }
      } catch (error) {
        if (error.reason === "rejected") {
          toast("Failed transaction", {
            description: "You rejected the transaction",
          });
        } else {
          console.log(error);
          toast("Error transaction", {
            description: error,
          });
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true); // Set loading state to true when useEffect starts

    const interval = setInterval(async () => {
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();

      const contract = getChatAppContract(signer);
      const ensContract = getEnsContract(signer);

      try {
        const messages = await contract.getMessages(id);

        let users = await ensContract.getAllUserProfile();

        const activeUser = users.find((u) => u[2] === address);
        const receiver = users.find((u) => u[0] === id);

        setCurrentUser(activeUser);
        setCurrentReceiver(receiver);

        setMessages(messages);
      } catch (error) {
        if (error.reason === "rejected") {
          toast("Failed transaction", {
            description: "You rejected the transaction",
          });
        } else {
          console.log(error);
          toast("Error transaction", {
            description: error,
          });
        }
      } finally {
        setIsLoading(false); // Set loading state to false after fetching messages
      }
    }, 100);

    return () => clearInterval(interval);
  }, [address, id, walletProvider]);

  return (
    <div className="flex-1 w-full h-full flex flex-col">
      <div className="w-full h-full overflow-y-auto">
        {messages <= 0 ? (
          <div className="w-full py-10 flex justify-center">
            <p className="text-base font-normal">
              You have no chat with{" "}
              <span>{ethers.decodeBytes32String(id)}</span>
            </p>
          </div>
        ) : isLoading ? (
          <div className="w-full py-10 flex justify-center flex-1">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : (
          messages?.map((message, _key) => {
            return (
              <div
                key={_key}
                className={cn("flex gap-3 py-6 px-4 border-b last:border-b-0", {
                  "bg-secondary/40": currentUser[0] !== message[1],
                })}>
                <div className="mx-auto max-w-[784px] w-full flex gap-3">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={`https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${
                        currentUser[0] !== message[1]
                          ? currentUser[1]
                          : currentReceiver[1]
                      }`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(ethers.decodeBytes32String(message[1]))}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 pt-[2px]">
                    <h1 className="text-sm font-semibold">
                      {currentUser[0] === id
                        ? "You"
                        : currentUser[0] === message[1]
                        ? ethers.decodeBytes32String(id)
                        : "You"}
                    </h1>
                    <p className="text-base leading-7 font-normal text-muted-foreground">
                      {message[0]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full bg-secondary/50 border-t px-4 py-2.5">
        <div className="mx-auto max-w-[784px] flex items-center justify-between gap-2 h-12">
          <Button variant="secondary" size="icon">
            <Smile className="w-5 h-5 opacity-50" />
          </Button>
          <Button variant="secondary" size="icon">
            <Plus className="w-5 h-5 opacity-50" />
          </Button>
          <Input
            disabled={isSending}
            onChange={(e) => setUserMessage(e.target.value)}
            className="flex-1 bg-secondary border-0 h-full px-4 rounded-full placeholder:font-normal text-sm"
            placeholder="Send a message"
          />
          <Button
            variant="secondary"
            size="icon"
            disabled={isSending || !userMessage.trimStart()}>
            {!userMessage.trimStart() ? (
              <Mic className="w-5 h-5 opacity-50" />
            ) : isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SendHorizonal className="w-4 h-4" onClick={handleSubmit} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
