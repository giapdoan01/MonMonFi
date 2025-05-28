"use client"
import { useEffect, useState } from "react"
import Image from "next/image";
import styles from "./page.module.css";
import ConnectWallet from "components/connectWallet";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Home() {
  const [address, setAddress] = useState("")

  return (
    <div className={styles.page}>
      <div className={styles.background} />
      {address ? (
        <main className={styles.content}>
          <div className={styles.ConnectWallet1}>
            <ConnectWallet address={address} setAddress={setAddress} />
          </div>
        </main>
      ) : (
        <main className={styles.content}>
          <div className={styles.ConnectWallet2}>
            <ConnectWallet address={address} setAddress={setAddress} />
          </div>
        </main>
      )}
    </div>
  )
}
