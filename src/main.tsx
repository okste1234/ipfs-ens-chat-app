import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/index.css";
import App from "./pages/App";
import { Web3Modal } from "./providers/Web3Modal";
import MessageContainer from "./pages/MessageContainer";
import { Toaster } from "./components/ui/sonner";
import Connect from "./pages/Connect";

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Modal>
      <Toaster />
      <RouterProvider router={router} />
    </Web3Modal>
  </React.StrictMode>
);
