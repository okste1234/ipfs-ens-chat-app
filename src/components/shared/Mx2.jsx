import { cn } from "@/lib/utils";

export default function Mx2({ className, children }) {
  return (
    <div
      className={cn("mx-auto max-w-[1400px] w-full px-3 md:px-5", className)}>
      {children}
    </div>
  );
}
