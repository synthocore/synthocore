// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SynthoToken
 * @notice ERC-20 token deployed autonomously by the SynthoCore agent
 *         via Coinbase Developer Platform (CDP) on Base.
 * @dev Deployed by the SynthoCore pipeline Stage 6 (Deploy).
 *      Each token is uniquely derived from a qualifying X/Twitter signal.
 */
contract SynthoToken is ERC20, ERC20Burnable, Ownable {
    /// @notice IPFS URI for token metadata (name, description, image, source tweet)
    string public metadataURI;

    /// @notice Source tweet URL that triggered this token's deployment
    string public sourceTweetUrl;

    /// @notice Block timestamp of deployment
    uint256 public immutable deployedAt;

    event MetadataURIUpdated(string indexed newURI);

    /**
     * @param name_         Token name (e.g. "PepeCoin")
     * @param symbol_       Token symbol (e.g. "PEPE")
     * @param totalSupply_  Total supply in token units (18 decimals applied internally)
     * @param owner_        Initial owner — receives full supply
     * @param metadataURI_  IPFS URI for off-chain metadata
     * @param sourceTweetUrl_ X/Twitter URL that triggered deployment
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address owner_,
        string memory metadataURI_,
        string memory sourceTweetUrl_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        _mint(owner_, totalSupply_ * 10 ** decimals());
        metadataURI = metadataURI_;
        sourceTweetUrl = sourceTweetUrl_;
        deployedAt = block.timestamp;
    }

    /**
     * @notice Update the token metadata URI (owner only).
     * @param newURI New IPFS URI pointing to updated metadata JSON.
     */
    function setMetadataURI(string calldata newURI) external onlyOwner {
        metadataURI = newURI;
        emit MetadataURIUpdated(newURI);
    }
}
