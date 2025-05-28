import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const INFURA_ID = "2f39d2741427b8416e8d619cd4645ad2a2336de3" 
const PRIVATE_KEY = "61c057e5bea01536392db1c1efea8081be0a4d40910094419587131c7cb2467e"; 
const API_KEY = "RWTZUNMF2XG2IR38KKXH9H5EGCW5MN183F";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://blue-multi-gadget.ethereum-sepolia.quiknode.pro/${INFURA_ID}/`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: API_KEY,
  }
};

export default config;
