import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./routes/App";
import { Toaster } from "./components/ui/sonner";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Connect from "./routes/Connect";
import MessageContainer from "./routes/MessageContainer";
import { Web3Modal } from "./provider/WalletProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Connect />,
  },
  {
    path: "/chat",
    element: <App />,
    children: [
      {
        path: "message/:id",
        element: <MessageContainer />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Web3Modal>
      <Toaster />
      <RouterProvider router={router} />
    </Web3Modal>
  </React.StrictMode>
);
