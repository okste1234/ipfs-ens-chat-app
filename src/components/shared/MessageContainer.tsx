import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Chat from "./Chat";

const messages = [
  {
    message: "Hi",
    mine: true,
  },
  {
    message: "Hello",
    mine: false,
  },
];

export default function MessageContainer() {
  return (
    <div className="flex-1 p-4 w-full h-full flex flex-col gap-4">
      <div className="w-full flex-1 flex flex-col gap-1.5 overflow-y-auto">
        {messages.map((message) => (
          <Chat key={message.message} {...message} />
        ))}
      </div>

      <div className="h-12 w-full bg-secondary rounded-full flex items-center px-2">
        <Input
          autoComplete="false"
          className="border-0 h-full rounded-full"
          placeholder="Send a message"
        />
        <Button className="text-sm rounded-full font-semibold">Send</Button>
      </div>
    </div>
  );
}
