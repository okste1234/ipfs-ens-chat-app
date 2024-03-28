import { isSupportedChain } from "@/lib/utils";
import { getChatAppContract, getProvider } from "@/constants";
import { Navigate } from "react-router-dom";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";

export const useRegister = async (username, imageUrl) => {
  const { chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  return useCallback(async () => {
    if (!isConnected)
      return toast("Oops! Maybe you've forgotten", {
        description: "You need to connect your wallet to continue",
      });
    if (!isSupportedChain(chainId))
      return toast("Wrong network", {
        description: "Please select the supported chain",
      });

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getChatAppContract(signer);

    try {
      toast("Pending transaction", {
        description: "Please wait while we create pool!",
      });

      const txCreatePool = await contract.userRegistration(username, imageUrl);
      const receipt = await txCreatePool.wait();

      console.log("receipt: ", receipt);

      if (receipt.status) {
        Navigate({ to: "/chat" });
        return toast("Successful transaction", {
          description: "Pool was successfully created!",
        });
      } else {
        toast("Failed transaction", {
          description: "Failed to create pool",
        });
      }
    } catch (error) {
      if (error.reason === "rejected") {
        toast("Failed transaction", {
          description: "You rejected the transaction",
        });
      } else {
        toast("Error transaction", {
          description: error.code,
        });
      }
    }
  }, []);
};
