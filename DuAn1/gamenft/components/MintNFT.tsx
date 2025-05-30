"use client";

import { useEffect, useState } from "react";
import { ethers, Eip1193Provider } from "ethers";
import MonMonFINFT from "abi/MonMonFINFT.json";
import "./MintNFT.css";
import { useNFT } from "./NFTcontext";

const CONTRACT_ADDRESS = "0xD231494Ece1F76557c92479E6961EF64432F958d";
const MAX_SUPPLY = 10;

interface MintPageProps {
  address: string;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export default function MintPage({ address }: MintPageProps) {
  const [hasNFT, setHasNFT] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [sufficientBalance, setSufficientBalance] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState(false);

  const { triggerRefresh } = useNFT();

  useEffect(() => {
    if (!address) return;

    const ethereum = window.ethereum;
    if (!ethereum) return;

    const checkConditions = async () => {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, MonMonFINFT.abi, provider);

        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === address.toLowerCase());

        let ownsNFT = false;
        for (let tokenId = 1; tokenId <= MAX_SUPPLY; tokenId++) {
          try {
            const nftOwner = await contract.ownerOf(tokenId);
            if (nftOwner.toLowerCase() === address.toLowerCase()) {
              ownsNFT = true;
              break;
            }
          } catch {}
        }
        setHasNFT(ownsNFT);

        let available = false;
        for (let tokenId = 1; tokenId <= MAX_SUPPLY; tokenId++) {
          try {
            const nftOwner = await contract.ownerOf(tokenId);
            if (nftOwner.toLowerCase() === owner.toLowerCase()) {
              available = true;
              break;
            }
          } catch {}
        }
        setTokenAvailable(available);

        const balance = await provider.getBalance(address);
        const mintPrice: bigint = await contract.mintPrice();
        setSufficientBalance(balance >= mintPrice);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Lỗi khi kiểm tra điều kiện mint:", err.message);
        } else {
          console.error("Lỗi khi kiểm tra điều kiện mint:", err);
        }
        setHasNFT(false);
        setSufficientBalance(false);
        setTokenAvailable(false);
      }
    };

    checkConditions();
  }, [address]);

  const mintNFT = async () => {
    if (!address || loading || hasNFT || isOwner || !sufficientBalance || !tokenAvailable) return;

    const ethereum = window.ethereum;
    if (!ethereum) {
      setStatus("Vui lòng cài MetaMask!");
      return;
    }

    try {
      setLoading(true);
      setStatus("🔄 Đang gửi giao dịch...");

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MonMonFINFT.abi, signer);
      const price = await contract.mintPrice();

      const tx = await contract.mint({ value: price });
      await tx.wait();

      setStatus("✅ Minted");
      setHasNFT(true);
      triggerRefresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus("❌ Mint thất bại: " + err.message);
        console.error("Mint lỗi:", err.message);
      } else {
        setStatus("❌ Mint thất bại.");
        console.error("Mint lỗi:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const isMintDisabled =
    !address || loading || hasNFT || isOwner || !sufficientBalance || !tokenAvailable;

  return (
    <div className="mint-container">
      <button
        onClick={mintNFT}
        disabled={isMintDisabled}
        className={`mint-Button ${isMintDisabled ? "disabled" : ""}`}
      >
        {loading ? "Đang mint..." : "Mint NFT"}
      </button>

      <p className="mint-status">{status}</p>

      {hasNFT && <p className="mint-info-success"> You already have NFT.</p>}
      {isOwner && <p className="mint-info-error"> Owner can not mint NFT</p>}
      {!tokenAvailable && <p className="mint-info-error"> No more NFTs to mint</p>}
      {!sufficientBalance && address && (
        <p className="mint-info-error"> not enough ETH</p>
      )}
    </div>
  );
}
