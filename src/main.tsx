import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import App from "./App.tsx";
import NavBar from "./components/NavBar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <ArweaveWalletKit
        config={{
          permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"],
          ensurePermissions: true,
          appInfo: {
            name: "Arweave-Wallet-Kit-Demo",
          },
        }}
      >
        <NavBar />
        <App />
      </ArweaveWalletKit>
    </ChakraProvider>
  </React.StrictMode>
);
