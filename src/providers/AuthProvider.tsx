import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ReactNode, createContext } from "react";
import { redirect } from "react-router-dom";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected } = useWeb3ModalAccount();

  if (!isConnected) {
    return redirect("/connect");
  }

  return (
    <AuthContext.Provider value={{ isConnected }}>
      {children}
    </AuthContext.Provider>
  );
};
