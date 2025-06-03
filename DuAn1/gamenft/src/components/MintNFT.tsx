"use client"

import { useEffect, useState } from "react"
import { ethers, type Eip1193Provider } from "ethers"
import { Sparkles } from "lucide-react"
import "./MintNFT.css"

const CONTRACT_ADDRESS = "0xD231494Ece1F76557c92479E6961EF64432F958d"
const MAX_SUPPLY = 10

// Mock ABI - thay thế bằng ABI thực tế của bạn
const MonMonFINFT = {
  abi: [
    "function owner() view returns (address)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function mintPrice() view returns (uint256)",
    "function mint() payable returns (uint256)",
  ],
}

interface MintPageProps {
  address: string
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

export default function MintNFT({ address }: MintPageProps) {
  const [hasNFT, setHasNFT] = useState(false)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [sufficientBalance, setSufficientBalance] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [tokenAvailable, setTokenAvailable] = useState(false)

  useEffect(() => {
    if (!address) return

    const ethereum = window.ethereum
    if (!ethereum) return

    const checkConditions = async () => {
      try {
        const provider = new ethers.BrowserProvider(ethereum)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, MonMonFINFT.abi, provider)

        const owner = await contract.owner()
        setIsOwner(owner.toLowerCase() === address.toLowerCase())

        let ownsNFT = false
        for (let tokenId = 1; tokenId <= MAX_SUPPLY; tokenId++) {
          try {
            const nftOwner = await contract.ownerOf(tokenId)
            if (nftOwner.toLowerCase() === address.toLowerCase()) {
              ownsNFT = true
              break
            }
          } catch {}
        }
        setHasNFT(ownsNFT)

        let available = false
        for (let tokenId = 1; tokenId <= MAX_SUPPLY; tokenId++) {
          try {
            const nftOwner = await contract.ownerOf(tokenId)
            if (nftOwner.toLowerCase() === owner.toLowerCase()) {
              available = true
              break
            }
          } catch {}
        }
        setTokenAvailable(available)

        const balance = await provider.getBalance(address)
        const mintPrice: bigint = await contract.mintPrice()
        setSufficientBalance(balance >= mintPrice)
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Lỗi khi kiểm tra điều kiện mint:", err.message)
        } else {
          console.error("Lỗi khi kiểm tra điều kiện mint:", err)
        }
        setHasNFT(false)
        setSufficientBalance(false)
        setTokenAvailable(false)
      }
    }

    checkConditions()
  }, [address])

  const mintNFT = async () => {
    if (!address || loading || hasNFT || isOwner || !sufficientBalance || !tokenAvailable) return

    const ethereum = window.ethereum
    if (!ethereum) {
      setStatus("Vui lòng cài MetaMask!")
      return
    }

    try {
      setLoading(true)
      setStatus("🔄 Đang gửi giao dịch...")

      const provider = new ethers.BrowserProvider(ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MonMonFINFT.abi, signer)
      const price = await contract.mintPrice()

      const tx = await contract.mint({ value: price })
      await tx.wait()

      setStatus("✅ Minted thành công!")
      setHasNFT(true)
      // Nếu bạn có context để refresh, hãy gọi ở đây
      // triggerRefresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus("❌ Mint thất bại: " + err.message)
        console.error("Mint lỗi:", err.message)
      } else {
        setStatus("❌ Mint thất bại.")
        console.error("Mint lỗi:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  const isMintDisabled = !address || loading || hasNFT || isOwner || !sufficientBalance || !tokenAvailable

  // Hiển thị thông báo phù hợp
  const getStatusMessage = () => {
    if (!address) return ""
    if (hasNFT) return ""
    if (isOwner) return ""
    if (!tokenAvailable) return ""
    if (!sufficientBalance) return ""
    return "Sẵn sàng mint NFT"
  }

  return (
    <div className="mint-card">
      <div className="mint-content">
        <div className="mint-status-area">
          <h3 className="mint-title">Mint NFT</h3>
          <p className="mint-status">{status || getStatusMessage()}</p>

          {hasNFT && <div className="mint-info mint-info-success">Bạn đã sở hữu NFT</div>}
          {!tokenAvailable && address && <div className="mint-info mint-info-error">Không còn NFT để mint</div>}
          {!sufficientBalance && address && <div className="mint-info mint-info-error">Không đủ ETH để mint</div>}
        </div>

        <button onClick={mintNFT} disabled={isMintDisabled} className="mint-button">
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              <span>Đang mint...</span>
            </>
          ) : (
            <>
              <Sparkles className="button-icon" />
              <span>Mint NFT</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
