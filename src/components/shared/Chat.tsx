import { cn } from "@/lib/utils";

export default function Chat({
  mine,
  message,
}: {
  mine: boolean;
  message: string;
}) {
  return (
    <div
      className={cn("flex gap-3 justify-start w-full", {
        "flex-row-reverse": mine,
      })}>
      {!mine && (
        <div className="w-10 h-10 bg-secondary rounded-full hidden md:flex"></div>
      )}
      <div
        className={cn("w-max max-w-xl h-max bg-secondary rounded-xl", {
          "bg-primary": mine,
        })}>
        <p className="text-sm px-3 py-[10px]">{message}</p>
      </div>
    </div>
  );
}
