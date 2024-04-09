import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { ArrowRight, Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ethers } from "ethers";
import { toast } from "sonner";
import { getEnsContract, getProvider } from "@/constants";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    username: "",
    address: "",
    profile: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formDetails.username && !formDetails.profile) {
      toast("Please select an image or enter a username");
      setIsLoading(false);
    } else {
      const data = {
        username: ethers.encodeBytes32String(formDetails.username),
        address: address,
        profile: formDetails.profile,
      };

      const formData = new FormData();
      formData.append("file", data.profile);

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
      };

      options.body = formData;
      setIsLoading(true);

      fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", options)
        .then((response) => response.json())
        .then(async (response) => {
          const fileUrl = response.IpfsHash;
          // const fileUrl = `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`;
          // const fileUrl = `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${response.IpfsHash}`;

          const readWriteProvider = getProvider(walletProvider);
          const signer = await readWriteProvider.getSigner();

          const contract = getEnsContract(signer);

          try {
            const tx = await contract.registerUser(data.username, fileUrl);
            const receipt = await tx.wait();

            if (receipt.status) {
              navigate("/chat");
              setFormDetails({
                username: "",
                address: "",
                profile: "",
              });
              return toast("Successful transaction", {
                description: "Account created successfully",
              });
            } else {
              toast("Failed transaction", {
                description: "Failed to create account",
              });
            }
          } catch (error) {
            setIsLoading(false);
            if (error.reason === "rejected") {
              toast("Failed transaction", {
                description: "You rejected the transaction",
              });
            } else {
              setIsLoading(false);
              console.log(error);
              toast("Error transaction", {
                description: error,
              });
            }
          } finally {
            setIsLoading(false);
          }
        })
        .catch((err) => console.error(err));
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          disabled={!isConnected}
          className="rounded-full border py-3 px-6 w-max text-sm bg-primary uppercase flex items-center disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-0">
          Register <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription>
            Fill the form to create an account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              id="profile"
              hidden
              className="hidden"
              disabled={isLoading}
              onChange={(e) =>
                setFormDetails((prev) => ({
                  ...prev,
                  profile: e.target.files[0],
                }))
              }
              type="file"
              accept="image/*"
            />
            <Label
              htmlFor="profile"
              className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center cursor-pointer">
              {formDetails.profile ? (
                <img
                  src={URL.createObjectURL(formDetails.profile)}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Camera className="w-12 h-12 text-muted-foreground" />
              )}
            </Label>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              disabled={isLoading}
              onChange={(e) =>
                setFormDetails((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              value={formDetails.username}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" disabled={isLoading} defaultValue={address} />
          </div>
          <Button
            type="submit"
            className="text-foreground"
            disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
