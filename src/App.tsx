import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { ConnectButton, useApi, useConnection } from "arweave-wallet-kit";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const { connected } = useConnection();
  const api = useApi();
  const [connectedAddress, setConnectedAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");

  async function getConnectedAddress() {
    try {
      // const address = await window.arweaveWallet.getActiveAddress();
      const address = await api?.getActiveAddress();
      if (address) setConnectedAddress(address);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to get active address: " + String(error));
    }
  }

  useEffect(() => {
    if (connected) {
      void getConnectedAddress();
    } else {
      setErrorMessage("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ConnectButton profileModal={false} showBalance={true} />
        </div>
        <div>
          Connected address with `useApi` hook:{" "}
          <b style={{ color: "green" }}>{connectedAddress}</b>
        </div>
        {errorMessage && (
          <div
            style={{
              color: "red",
            }}
          >
            Error: {errorMessage}
          </div>
        )}
        <br />
      </div>
    </>
  );
}

export default App;
