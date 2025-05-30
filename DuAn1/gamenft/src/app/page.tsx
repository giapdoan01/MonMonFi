"use client"
import { useState } from "react"
import styles from "./page.module.css"
import ConnectWallet from "components/connectWallet"
import CheckNFT from "components/CheckNFT"
import "bootstrap/dist/css/bootstrap.min.css"
import MintPage from "components/MintNFT"
import { NFTProvider } from "components/NFTcontext"

export default function Home() {
  const [address, setAddress] = useState("")

  return (
    <div className={styles.page}>
      <div className={styles.background} />
      <NFTProvider>
      <main className={styles.content}>
        {/* Main Container - Wallet & NFT Check */}
        <div className={styles.mainContainer}>
          <div className={styles.nftSection}>
            <CheckNFT address={address} />
          </div>
          <div className={styles.walletSection}>
            <ConnectWallet address={address} setAddress={setAddress} />
          </div>
        </div>

        {/* Mint Container */}
        <div className={styles.mintContainer}>
          <MintPage address={address}/>
        </div>

        {/* Small Container 1 */}
        <div className={styles.smallContainer1}>
          <div className={`${styles.gameIcon} ${styles.blueIcon}`}></div>
        </div>

        {/* Small Container 2 */}
        <div className={styles.smallContainer2}>
          <div className={`${styles.gameIcon} ${styles.purpleIcon}`}></div>
        </div>

        {/* Marketplace Container */}
        <div className={styles.marketplaceContainer}>
          <div className={styles.marketplaceIcons}>
            <div className={`${styles.marketplaceIcon} ${styles.marketplaceIcon1}`}></div>
            <div className={`${styles.marketplaceIcon} ${styles.marketplaceIcon2}`}></div>
            <div className={`${styles.marketplaceIcon} ${styles.marketplaceIcon3}`}></div>
          </div>
          <button className={styles.marketplaceButton}>MARKETPLACE</button>
        </div>

        {/* Fighting Container */}
        <div className={styles.fightingContainer}>
          <div className={styles.fightingIcon}></div>
          <button className={styles.fightingButton}>FIGHTING</button>
        </div>
      </main>
      </NFTProvider>
    </div>
  )
}
