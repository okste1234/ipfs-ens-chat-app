import { ethers } from "ethers";
import CHATAPP_CONTRACT_ABI from "../json/chat_abi.json";
import ENS_CONTRACT_ABI from "../json/ens_abi.json";

const {
  VITE_CHATAPP_CONTRACT_ADDRESS,
  VITE_INFURA_ID,
  VITE_ENS_CONTRACT_ADDRESS,
} = import.meta.env;

export const getChatAppContract = (providerOrSigner) =>
  new ethers.Contract(
    VITE_CHATAPP_CONTRACT_ADDRESS,
    CHATAPP_CONTRACT_ABI,
    providerOrSigner
  );

export const getEnsContract = (providerOrSigner) =>
  new ethers.Contract(
    VITE_ENS_CONTRACT_ADDRESS,
    ENS_CONTRACT_ABI,
    providerOrSigner
  );

// read only provider pointing to sepolia. It allows read only access to the sepolia blockchain
export const readOnlyProvider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${VITE_INFURA_ID}`
);

// read/write provider, that allows you to read data and also sign transaction on whatever chain it's pointing to
export const getProvider = (provider) => new ethers.BrowserProvider(provider);
