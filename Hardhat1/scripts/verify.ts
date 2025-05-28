import { run } from "hardhat";

async function main() {
  const address = "0xdCB8e8c5506f7949043d4a2D1B475A715D7F3693";
  const args = [
    ["https://tan-peaceful-otter-575.mypinata.cloud/ipfs/bafkreie5qhfdpdpk52tq3uynqvhf7o26funxd4os6ap5o6hv4zlwure7ey"]
  ];

  await run("verify:verify", {
    address,
    constructorArguments: args,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
