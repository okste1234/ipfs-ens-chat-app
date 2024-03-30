import Header from "@/components/shared/Header";
import Hero from "@/components/shared/Hero";
import Mx1 from "@/components/shared/Mx1";
import Mx2 from "@/components/shared/Mx2";
import { getEnsContract, getProvider } from "@/constants";
import { isSupportedChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Root() {
  const navigate = useNavigate();

  const { isConnected, chainId, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (isConnected) {
        if (!isSupportedChain(chainId))
          return toast("Wrong network", {
            description: "Please select the supported chain",
          });

        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getEnsContract(signer);

        try {
          const tx = await contract.checkIsRegistered(address);

          if (tx === true) {
            return navigate("/chat");
          } else {
            return navigate("/");
          }
        } catch (error) {
          if (error.reason === "rejected") {
            toast("Failed transaction", {
              description: "You rejected the transaction",
            });
          } else {
            console.log(error);
            toast("Error transaction", {
              description: error.code,
            });
          }
        }
      } else {
        return navigate("/");
      }
    };

    checkUserRegistration();
  }, [address, chainId, isConnected, navigate, walletProvider]);

  return (
    <div className="flex flex-col">
      <div className="w-screen h-screen fixed top-0 left-0 -z-10 select-none">
        <span className="absolute w-full h-full bg-black/50 select-none"></span>
        <img
          className="w-full h-full object-cover select-none"
          src="/assets/banner.webp"
        />
      </div>
      <Header />
      <Hero />

      <Mx2>
        <div className="bg-secondary w-full h-auto p-2 rounded-xl">
          <img
            src="/assets/he.png"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      </Mx2>

      <div className="pt-[60px] pb-[88px] mt-20 md:mt-[60px]">
        <Mx1 className="text-foreground">
          <h1 className="font-normal text-2xl md:text-4xl lg:text-5xl uppercase">
            Evoke in <span className="sans">Numbers</span>
          </h1>

          <p className="text-lg max-w-[600px] w-full font-normal my-5">
            Being highly streamlined is the key to minimize friction and
            maximize operational efficiency. All partners get access to a
            tailored...
          </p>
        </Mx1>
      </div>
    </div>
  );
}
