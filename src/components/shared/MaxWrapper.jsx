import { cn } from "@/lib/utils";

export default function MaxWrapper({ children, className }) {
  return (
    <div className={cn("max-w-[1616px] mx-auto w-full", className)}>
      {children}
    </div>
  );
}
