import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

// export const shortenAddress = (addr: string) => {
//   return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
// };

export default function Chat({ chatId }: { chatId: number }) {
  return (
    <NavLink
      to={`/chat/message/${chatId}`}
      className={({ isActive }) =>
        cn("flex items-center pl-4 gap-4 h-[71px]", {
          "bg-[#2A3942]": isActive,
        })
      }>
      <Avatar className="w-[49px] h-[49px]">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="h-full border-b flex-1 pr-[15px] flex items-center justify-start">
        <div className="flex flex-col">
          <h1 className="text-base font-semibold capitalize">
            Abdullahi Salihu
          </h1>
          <p className="text-xs text-muted-foreground font-normal">
            0x0000000000000000000000000000000000000000
          </p>
        </div>
      </div>
    </NavLink>
  );
}
