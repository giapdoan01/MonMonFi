import { run } from "hardhat";

async function main() {
  const address = "0xD231494Ece1F76557c92479E6961EF64432F958d";
  const args = [
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

  await run("verify:verify", {
    address,
    constructorArguments: [args], 
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
