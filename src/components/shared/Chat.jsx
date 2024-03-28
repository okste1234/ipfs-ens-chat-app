import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, getInitials, shortenAddress } from "@/lib/utils";
import { ethers } from "ethers";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import { getChatAppContract, getProvider } from "@/constants";

export default function Chat({ users }) {
  const { walletProvider } = useWeb3ModalProvider();
  const [userImg, setUserImg] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
        const contract = getChatAppContract(signer);

        const mappedUser = users.map((us) => us);

        const tx = await contract.getUserUrl(mappedUser);
        setUserImg(tx);
        console.log(tx);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, [walletProvider]); // Add walletProvider to the dependency array

  return users.map((user) => (
    <NavLink
      to={`/chat/message/${user}`}
      className={({ isActive }) =>
        cn("flex items-center pl-4 gap-4 h-[71px]", {
          "bg-[#2A3942]": isActive,
        })
      }>
      <Avatar className="w-[49px] h-[49px]">
        <AvatarImage src={`https://ipfs.io/ipfs/${userImg}`} />
        <AvatarFallback>
          {getInitials(ethers.decodeBytes32String(user))}
        </AvatarFallback>
      </Avatar>

      <div className="h-full border-b flex-1 pr-[15px] flex items-center justify-start">
        <div className="flex flex-col">
          <h1 className="text-base font-semibold capitalize">
            {ethers.decodeBytes32String(user)}
          </h1>
          <p className="text-xs text-muted-foreground font-normal">
            {shortenAddress(user)}
          </p>
        </div>
      </div>
    </NavLink>
  ));
}
