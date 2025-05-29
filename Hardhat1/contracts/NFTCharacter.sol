// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyCharacterNFT is ERC721URIStorage, Ownable {
    uint256 public totalMinted = 0;
    uint256 public constant MAX_SUPPLY = 10;
    uint256 private nextTokenToTransfer = 1;
    uint256 public mintPrice = 0.001 ether; 

    constructor(string[] memory uris)
        ERC721("MyCharacter", "CHAR")
        Ownable(msg.sender)
    {
        require(uris.length == MAX_SUPPLY, "Need exactly 10 URIs");

        for (uint256 i = 0; i < MAX_SUPPLY; i++) {
            _safeMint(msg.sender, i + 1);
            _setTokenURI(i + 1, uris[i]);
            totalMinted++;
        }
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function mint() external payable {
        require(msg.sender != owner(), "Owner cannot mint");
        require(balanceOf(msg.sender) == 0, "You already own an NFT");
        require(nextTokenToTransfer <= MAX_SUPPLY, "No NFTs left to transfer");
        require(msg.value >= mintPrice, "Insufficient payment");

        uint256 tokenId = nextTokenToTransfer;

        require(ownerOf(tokenId) == owner(), "Token already transferred");

        safeTransferFrom(owner(), msg.sender, tokenId);

        nextTokenToTransfer++;
        
        payable(owner()).transfer(msg.value);
    }
}
