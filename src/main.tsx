import React from "react";
import ReactDOM from "react-dom/client";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ArweaveWalletKit
      config={{
        permissions: ["ACCESS_ADDRESS"],
        ensurePermissions: true,
        appInfo: {
          name: "Arweave-Wallet-Kit-Demo",
        },
      }}
    >
      <App />
    </ArweaveWalletKit>
  </React.StrictMode>
);
