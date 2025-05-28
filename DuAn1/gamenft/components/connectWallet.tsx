// components/connectWallet.tsx
"use client"
import { useState } from "react"
import { Wallet, LogOut } from 'lucide-react'
import "./connect-wallet.css"

export default function ConnectWallet({
  address,
  setAddress,
}: {
  address: string;
  setAddress: (addr: string) => void;
}) {
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = async () => {
    if (!(window as any).ethereum) {
      alert("Please install MetaMask!")
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      })
      setAddress(accounts[0])
    } catch (err) {
      console.error("Error connecting wallet:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress("")
  }

  return (
    <div className="wallet-container">
      {address ? (
        <div className="wallet-connected-container">
          <div className="wallet-connected-card">
            <div className="wallet-header">
              <div className="wallet-icon-container">
                <Wallet className="wallet-icon" />
                <div className="status-indicator"></div>
              </div>
            </div>

            <div className="address-container">
              <p className="address-text">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
            
            <button onClick={disconnect} className="disconnect-button">
              <LogOut className="logout-icon" />
            </button>
          </div>
        </div>
      ) : (
        <div className="wallet-connect-container">
          <button onClick={connect} disabled={isConnecting} className="connect-button">
            <div className="button-background"></div>
            <div className="button-glow"></div>
            <div className="button-content">
              {isConnecting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span className="button-text">Connecting...</span>
                </>
              ) : (
                <>
                  <span className="button-text">Connect Wallet</span>
                </>
              )}
            </div>
            <div className="shine-effect"></div>
          </button>
          <div className="button-border"></div>
          <div className="button-inner-background"></div>
        </div>
      )}
    </div>
  )
}
