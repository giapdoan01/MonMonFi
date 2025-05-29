"use client"
import { useState } from "react"
import styles from "./page.module.css"
import ConnectWallet from "components/connectWallet"
import CheckNFT from "components/CheckNFT"
import "bootstrap/dist/css/bootstrap.min.css"

export default function Home() {
  const [address, setAddress] = useState("")

  return (
    <div className={styles.page}>
      <div className={styles.background} />
      <main className={styles.content}>
        <div className={styles.container}>
          <div className={styles.nftSection}>
            <CheckNFT address={address} />
          </div>
          <div className={styles.walletSection}>
            <ConnectWallet address={address} setAddress={setAddress} />
          </div>
        </div>
      </main>
      <main>
        
      </main>
    </div>
  )
}
