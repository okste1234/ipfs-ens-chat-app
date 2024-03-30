import { getEnsContract, getProvider } from "@/constants";
import { cn, getInitials, shortenAddress } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ethers } from "ethers";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DisconnectWallet from "./DisconnectWallet";
import { Loader2 } from "lucide-react";

export default function Sidebar() {
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const contract = getEnsContract(signer);

      try {
        let tx = await contract.getAllUserProfile();

        // Find the current user
        const user = tx.find((u) => u[2] === address);
        setCurrentUser(user);

        // Filter out the current user from the list
        tx = tx.filter((u) => u[2] !== address);

        setAllUsers(tx);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [walletProvider, address]);

  return (
    <div className="p-3 max-w-[320px] w-full flex flex-col gap-3 border-r">
      <div className="w-full pb-2 border-b">
        {currentUser && (
          <div className="h-12 w-full flex items-center gap-2">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={`https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${currentUser[1]}`}
              />
              <AvatarFallback className="text-xs">
                {getInitials(ethers.decodeBytes32String(currentUser[0]))}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-1 justify-center">
              <h1 className="text-base font-semibold">
                {ethers.decodeBytes32String(currentUser[0])}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {shortenAddress(currentUser[2])}
              </p>
            </div>

            <DisconnectWallet />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          allUsers.map((u, _key) => {
            return (
              <NavLink
                to={`/chat/message/${u[0]}`}
                key={_key}
                className={({ isActive }) =>
                  cn("w-full px-3 py-2 rounded-md", {
                    "bg-secondary/80": isActive,
                    "hover:bg-secondary/30": !isActive,
                  })
                }>
                <h1 className="text-sm font-semibold">
                  {ethers.decodeBytes32String(u[0])}
                </h1>
                <p className="text-xs text-muted-foreground truncate">{u[2]}</p>
              </NavLink>
            );
          })
        )}
      </div>
    </div>
  );
}
