"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import MyCharacterNFT from "abi/MyCharacterNFT.json";
import "./CheckNFT.css"


const CONTRACT_ADDRESS = "0x12276D9724906C78C3Ca8964F745197fC8b20B79";
const MAX_SUPPLY = 1; // Số lượng NFT tối đa của contract

interface CheckNFTProps {
  address: string;
}


export default function CheckNFT({ address }: CheckNFTProps) {
  const [status, setStatus] = useState<string>("Đang kiểm tra NFT...");
  const [nftImage, setNftImage] = useState<string | null>(null);
  const [nftName, setNftName] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setStatus("Vui lòng kết nối ví.");
      setNftImage(null);
      return;
    }

    async function fetchNFT() {
      try {
        if (!(window as any).ethereum) {
          setStatus("Vui lòng cài MetaMask!");
          setNftImage(null);
          return;
        }

        setStatus("Đang kiểm tra NFT...");
        setNftImage(null);
        const provider = new ethers.BrowserProvider((window as any).ethereum);


        // Nếu chỉ gọi các hàm đọc (view), dùng provider không cần signer
        const contract = new ethers.Contract(CONTRACT_ADDRESS, MyCharacterNFT.abi, provider);

        let found = false;
        for (let tokenId = 1; tokenId <= MAX_SUPPLY; tokenId++) {
          try {
            const ownerAddress = await contract.ownerOf(tokenId);
            // ownerAddress là Address object (ethers v6), convert về string rồi so sánh
            if (ownerAddress.toString().toLowerCase() === address.toLowerCase()) {
              const uri: string = await contract.tokenURI(tokenId);
              const url = uri.startsWith("ipfs://")
                ? uri.replace("ipfs://", "https://ipfs.io/ipfs/")
                : uri;

              const metadata = await fetch(url).then((res) => res.json());
              console.log("NFT Metadata:", metadata);

              setNftImage(metadata.image);
              setNftName(metadata.name);
              setStatus("NFT đã được tìm thấy!");
              found = true;
              break;
            }
          } catch {
            // Token không tồn tại hoặc lỗi, bỏ qua
          }
        }

        if (!found) {
          setStatus("Ví chưa sở hữu NFT nào.");
          setNftImage(null);
        }
      } catch (error: any) {
        setStatus("Lỗi khi kiểm tra NFT: " + (error.message || error));
        setNftImage(null);
      }
    }

    fetchNFT();
  }, [address]);

  return (
    <div className="nft-container">
      {nftImage ? (
        <div className="nft-display">
          <img src={nftImage || "/placeholder.svg?height=300&width=300"} alt="NFT Character" className="nft-image" />
          <div className="nft-glow"></div>
           
        </div>
      ) : (
        <div className="status-message">{status}</div>
      )}
      <p className="nft-name">{nftName}</p>
    </div>
  );
}
