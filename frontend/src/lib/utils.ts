import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isSupportedChain = (chainId: number) =>
  Number(chainId) === 11155111;

export const shortenAddress = (addr: string) => {
  return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
};

export const getInitials = (name: string) => {
  const words = name.split(" ");

  let initials = "";
  for (let i = 0; i < words.length; i++) {
    // Concatenate the first character of each word to the initials string
    initials += words[i][0];

    // Break the loop if initials contains 2 characters
    if (initials.length === 2) {
      break;
    }
  }

  // Return the initials
  return initials;
};
