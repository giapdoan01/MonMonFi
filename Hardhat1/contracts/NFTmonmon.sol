// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MonMonFINFT is ERC721URIStorage, Ownable {
    uint256 public constant MAX_SUPPLY = 10;
    uint256 public mintPrice = 0.01 ether;
    uint256 public nextTokenToTransfer = 1;

    constructor(string[] memory uris) ERC721("MonMonFI", "MMF") Ownable(msg.sender) {
        require(uris.length == MAX_SUPPLY, "Need exactly 10 URIs");

        // Mint sẵn 10 NFT cho owner với URI tương ứng
        for (uint256 i = 0; i < MAX_SUPPLY; i++) {
            uint256 tokenId = i + 1;
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, uris[i]);
        }
    }

    function mint() external payable {
        require(msg.sender != owner(), "Owner cannot mint");
        require(balanceOf(msg.sender) == 0, "You already own an NFT");
        require(nextTokenToTransfer <= MAX_SUPPLY, "All NFTs have been transferred");
        require(msg.value >= mintPrice, "Insufficient payment");

        uint256 tokenId = nextTokenToTransfer;
        address currentOwner = ownerOf(tokenId);
        require(currentOwner == owner(), "Token already transferred");

        // ✅ Chuyển trực tiếp không cần approval
        _transfer(owner(), msg.sender, tokenId);
        nextTokenToTransfer++;

        // Chuyển tiền cho owner
        payable(owner()).transfer(msg.value);
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }
}
