// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyCharacterNFT is ERC721URIStorage, Ownable {
    uint256 public totalMinted = 0;
    uint256 public constant MAX_SUPPLY = 10;

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
}
