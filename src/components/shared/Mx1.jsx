import { cn } from "@/lib/utils";

export default function Mx1({ className, children }) {
  return (
    <div
      className={cn("mx-auto max-w-[1200px] w-full px-3 md:px-5", className)}>
      {children}
    </div>
  );
}
