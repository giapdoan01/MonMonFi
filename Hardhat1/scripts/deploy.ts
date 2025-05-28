const { ethers } = require("hardhat");

async function main() {
  const uris = ["https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafkreie5qhfdpdpk52tq3uynqvhf7o26funxd4os6ap5o6hv4zlwure7ey"];
  const NFT = await ethers.getContractFactory("MyCharacterNFT");
  const contract = await NFT.deploy(uris);
  await contract.waitForDeployment();
  console.log("✅ Contract deployed at:", await contract.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
