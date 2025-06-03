"use client"
import { useState } from "react"
import { Wallet, LogOut } from "lucide-react"
import "./connect-wallet.css"
import type { Eip1193Provider } from "ethers"

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

export default function ConnectWallet({
  address,
  setAddress,
}: {
  address: string
  setAddress: (addr: string) => void
}) {
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!")
      return
    }

    setIsConnecting(true)
    try {
      const accounts: string[] = await window.ethereum.request({
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
    <div className="wallet-page-container">
      <div className="wallet-card">
        {address ? (
          <div className="wallet-content">
            {/* Connected State */}
            <div className="wallet-status-area connected">
              <div className="wallet-connected-info">
                <Wallet className="wallet-icon" />
                <div className="status-indicator"></div>
              </div>
              <p className="connected-status-text">Đã kết nối ví</p>
              <p className="wallet-address">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>

            <button onClick={disconnect} className="wallet-button disconnect-button">
              <LogOut className="button-icon" />
              Ngắt kết nối
            </button>
          </div>
        ) : (
          <div className="wallet-content">
            {/* Disconnected State */}
            <div className="wallet-status-area">
              <p className="wallet-status-text">Vui lòng kết nối ví.</p>
            </div>

            <button onClick={connect} disabled={isConnecting} className="wallet-button connect-button">
              {isConnecting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Đang kết nối...</span>
                </>
              ) : (
                <>
                  <Wallet className="button-icon" />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
