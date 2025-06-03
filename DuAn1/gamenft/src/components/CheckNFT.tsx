"use client"

import { useEffect, useState } from "react"
import { ethers, type Eip1193Provider } from "ethers"
import { RefreshCw } from "lucide-react"
import "./checkNFT.css"

const CONTRACT_ADDRESS = "0xD231494Ece1F76557c92479E6961EF64432F958d"
const MAX_SUPPLY = 10

// Mock ABI - thay thế bằng ABI thực tế của bạn
const MonMonFINFT = {
  abi: [
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function tokenURI(uint256 tokenId) view returns (string)",
  ],
}

interface CheckNFTProps {
  address: string
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

export default function CheckNFT({ address }: CheckNFTProps) {
  const [status, setStatus] = useState<string>("Đang kiểm tra NFT...")
  const [nftImage, setNftImage] = useState<string | null>(null)
  const [nftName, setNftName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchNFT = async () => {
    if (!address) {
      setStatus("Vui lòng kết nối ví.")
      setNftImage(null)
      setNftName(null)
      return
    }

    setIsLoading(true)
    try {
      if (!window.ethereum) {
        setStatus("Vui lòng cài MetaMask!")
        setNftImage(null)
        setNftName(null)
        return
      }

      setStatus("Đang kiểm tra NFT...")
      setNftImage(null)
      setNftName(null)

      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MonMonFINFT.abi, provider)

      let found = false
      for (let tokenId = 1; tokenId <= MAX_SUPPLY; tokenId++) {
        try {
          const ownerAddress = await contract.ownerOf(tokenId)
          if (ownerAddress.toString().toLowerCase() === address.toLowerCase()) {
            const uri: string = await contract.tokenURI(tokenId)
            const url = uri.startsWith("ipfs://") ? uri.replace("ipfs://", "https://ipfs.io/ipfs/") : uri

            const metadata = await fetch(url).then((res) => res.json())
            console.log("NFT Metadata:", metadata)

            setNftImage(metadata.image)
            setNftName(metadata.name)
            setStatus("NFT đã được tìm thấy!")
            found = true
            break
          }
        } catch {
          // Token không tồn tại hoặc lỗi, bỏ qua
        }
      }

      if (!found) {
        setStatus("Ví chưa sở hữu NFT nào.")
        setNftImage(null)
        setNftName(null)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus("Lỗi khi kiểm tra NFT: " + error.message)
      } else {
        setStatus("Lỗi khi kiểm tra NFT.")
      }
      setNftImage(null)
      setNftName(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNFT()
  }, [address])

  return (
    
      <div className="nft-card">
        <div className="nft-content">
          {/* NFT Display Area */}
          <div className="nft-display-area">
            {nftImage ? (
              <>
                <div className="nft-display">
                  <img
                    src={nftImage || "/placeholder.svg?height=200&width=200"}
                    alt="NFT Character"
                    className="nft-image"
                  />
                  <div className="nft-glow"></div>
                </div>
                {nftName && <p className="nft-name">{nftName}</p>}
              </>
            ) : (
              <p className="nft-status-message">{status}</p>
            )}
          </div>

          {/* Refresh Button */}
          <button onClick={fetchNFT} disabled={isLoading} className="refresh-button">
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Đang kiểm tra...</span>
              </>
            ) : (
              <>
                <RefreshCw className="button-icon" />
                <span>Kiểm tra lại NFT</span>
              </>
            )}
          </button>
        </div>
      </div>
    
  )
}
