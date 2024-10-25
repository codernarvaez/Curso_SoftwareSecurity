import { useEffect, useState } from "react";
import { ethers } from "ethers"; 
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, []);

  const iniciarSesion = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setWalletAddress(address);
        await resolveUserName(address);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Por favor instale MetaMask");
    }
  };

  const cerrarSesion = () => {
    setWalletAddress(""); 
    setUserDisplayName(""); 
    console.log("Sesión cerrada.");
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          await resolveUserName(address);
        } else {
          console.log("Conecte MetaMask usando el botón de conexión");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Por favor instale MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          await resolveUserName(address);
        } else {
          cerrarSesion(); 
        }
      });
    } else {
      console.log("Por favor instale MetaMask");
    }
  };

  const resolveUserName = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const ens = await provider.lookupAddress(address);
      if (ens) {
        setUserDisplayName(ens);
      } else {
        const shortAddress = `${address.substring(0, 6)}...${address.substring(38)}`;
        setUserDisplayName(shortAddress);
      }
    } catch (error) {
      console.error("Error al resolver ENS:", error);
      const shortAddress = `${address.substring(0, 6)}...${address.substring(38)}`;
      setUserDisplayName(shortAddress);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Página web con blockchain</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              {walletAddress ? (
                <>
                  <button
                    className="button is-white connect-wallet"
                    onClick={cerrarSesion}
                  >
                    <span className="is-link has-text-weight-bold">
                      Cerrar sesión
                    </span>
                  </button>
                </>
              ) : (
                <button
                  className="button is-white connect-wallet"
                  onClick={iniciarSesion}
                >
                  <span className="is-link has-text-weight-bold">Ingresar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Bienvenido</h1>
            {userDisplayName && (
              <h2 className="subtitle is-3 mt-4">Usuario: {userDisplayName}</h2>
            )}
            <p>La web 3.0.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
