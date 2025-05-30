import { ethers } from "hardhat";

async function main() {
  const uris = [
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c1.json",
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c2.json",
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c3.json",
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c4.json",
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c5.json",
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c6.json",
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c7.json",
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c8.json",
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c9.json",
    "https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafybeihavqlqdvgmthig47mtvy6goguojjaf4hhrl4ou7pmmkeq2hcury4/c10.json"
  ];

  const MonMonFINFT = await ethers.getContractFactory("MonMonFINFT");
  const contract = await MonMonFINFT.deploy(uris);

  await contract.waitForDeployment();

  console.log(`✅ MonMonFINFT deployed at: ${(await contract.getAddress())}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});