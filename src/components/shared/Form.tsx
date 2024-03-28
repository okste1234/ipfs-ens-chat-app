import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
// import bytes32 from "bytes32";
import { redirect } from "react-router-dom";

export default function Form() {
  const [selectedFile, setSelectedFile] = useState();
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectImage = ({ target }: { target: any }) => {
    setSelectedFile(target.files[0]);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile!);

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

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      const data = {
        username: username,
        image: fileUrl,
      };

      redirect("/chat");
      console.log(data);
    } catch (error) {
      console.log("Pinata API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-sm flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          hidden
          className="hidden"
          id="selectFile"
          onChange={handleSelectImage}
        />
        <label
          htmlFor="selectFile"
          className="rounded-full w-32 h-32 bg-secondary flex items-center justify-center cursor-pointer">
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              className="w-full h-full object-cover rounded-full"
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
