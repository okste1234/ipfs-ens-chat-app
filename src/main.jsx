import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { Toaster } from "./components/ui/sonner";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Web3Modal } from "./provider/WalletProvider";
import Root from "./routes/Root";
import Messenger from "./routes/Messenger";
import Chats from "./components/shared/Chats";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/chat",
    element: <Messenger />,
    children: [
      {
        path: "message/:id",
        element: <Chats />,
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
