import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useDisconnect } from "@web3modal/ethers/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DisconnectWallet() {
  const navigate = useNavigate();

  const { disconnect } = useDisconnect();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline">
          <LogOut className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Disconnecting your account means you won&apos;t be able to use the
            app till you connect your wallet back
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              navigate("/");
              disconnect();
            }}>
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
