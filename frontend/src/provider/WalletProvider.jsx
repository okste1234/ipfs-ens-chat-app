import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

export const MORPH_CHAIN_ID = 2710;

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "";

// 2. Set chains
const morph = {
  chainId: MORPH_CHAIN_ID,
  name: "Morph Testnet",
  currency: "ETH",
  explorerUrl: "https://explorer-testnet.morphl2.io/",
  rpcUrl: `https://rpc-testnet.morphl2.io`,
};

// 3. Create a metadata object
const metadata = {
  name: "Chat app",
  description: "Description",
  url: "http://localhost:5173/", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// Check if projectId is defined before passing it to createWeb3Modal
if (projectId) {
  createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [morph],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
  });
} else {
  console.error("Project ID is not defined.");
}

export function Web3Modal({ children }) {
  return children;
}
