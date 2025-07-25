"use client"
import { useState } from "react"
import styles from "./page.module.css"
import ConnectWallet from "../components/connectWallet"
import CheckNFT from "../components/CheckNFT"
import "bootstrap/dist/css/bootstrap.min.css"
import MintNFT from "@/components/MintNFT"
import Marketplace from "@/components/Marketplace"
import Faucet from "@/components/faucet"
import Fighting from "@/components/fighting"

export default function Home() {
  const [address, setAddress] = useState("")

  return (
    <div className={styles.containerConnectWalletCheckNFT}>
      <div className={styles.containerConnectWalletFaucet}>
        <ConnectWallet address={address} setAddress={setAddress}/>
        <Faucet/>
      </div>
      <CheckNFT address={address}/>
      <div className={styles.containerMintNFTMarketplaceFighting}>
        <div className={styles.containerMintNFTFighting}>
          <MintNFT address={address}/>
          <Fighting fightingUrl="/Fight"/>
        </div>
        <Marketplace/>
      </div>
    </div>
  )
}
