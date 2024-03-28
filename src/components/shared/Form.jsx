import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

import { isSupportedChain } from "@/lib/utils";
import { getChatAppContract, getProvider } from "@/constants";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";

export default function Form() {
  const [selectedFile, setSelectedFile] = useState();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { walletProvider } = useWeb3ModalProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    if (!selectedFile && !username) {
      toast("Please select an image or enter a username");
      setIsLoading(false);
    } else {
      formData.append("file", selectedFile);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
          },
        }
      );

      const fileUrl = response.data.IpfsHash;
      // const fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();

      const contract = getChatAppContract(signer);

      const data = {
        name: username,
        image: fileUrl,
      };

      console.log(data);

      try {
        const tx = await contract.userRegistration(
          ethers.encodeBytes32String(username),
          fileUrl
        );
        const receipt = await tx.wait();

        console.log("receipt: ", receipt);

        if (receipt.status) {
          navigate("/chat");
          return toast("Successful transaction", {
            description: "Account created successfully",
          });
        } else {
          toast("Failed transaction", {
            description: "Failed to create pool",
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

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Input
          type="file"
          accept="image/*"
          hidden
          className="hidden"
          id="selectFile"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <label
          htmlFor="selectFile"
          className="rounded-full w-32 h-32 bg-secondary flex items-center justify-center cursor-pointer">
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              className="w-full h-full object-cover rounded-full"
              alt="Selected File"
            />
          ) : (
            <Camera className="w-16 h-16 text-muted-foreground" />
          )}
        </label>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col my-4 w-full gap-4">
          <div className="space-y-2">
            <label className="text-sm">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <Button disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>

        <w3m-button />
      </div>
    </div>
  );
}
