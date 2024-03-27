import { Camera } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Form() {
  const [selectedFile, setSelectedFile] = useState();
  const [username, setUsername] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectImage = ({ target }: { target: any }) => {
    setSelectedFile(target.files[0]);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    console.log(selectedFile, username);
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

          <Button>Submit</Button>
        </form>
      </div>
    </div>
  );
}
