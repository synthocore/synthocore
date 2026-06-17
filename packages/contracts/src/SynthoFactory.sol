// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "./SynthoToken.sol";

/**
 * @title SynthoFactory
 * @notice Factory contract used by the SynthoCore agent to deploy SynthoTokens
 *         on Base via Coinbase Developer Platform (CDP).
 * @dev Each deploy() call creates a new SynthoToken and records it in the registry.
 */
contract SynthoFactory {
    address public immutable agent;

    struct TokenRecord {
        address tokenAddress;
        string name;
        string symbol;
        uint256 totalSupply;
        string sourceTweetUrl;
        uint256 deployedAt;
    }

    /// @notice All tokens deployed by this factory
    TokenRecord[] public tokens;

    /// @notice Emitted on each successful token deployment
    event TokenDeployed(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 totalSupply,
        string sourceTweetUrl,
        uint256 deployedAt
    );

    /// @notice Only the authorized SynthoCore agent wallet can deploy
    modifier onlyAgent() {
        require(msg.sender == agent, "SynthoFactory: caller is not the agent");
        _;
    }

    /**
     * @param agent_ Address of the SynthoCore CDP agent wallet.
     */
    constructor(address agent_) {
        agent = agent_;
    }

    /**
     * @notice Deploy a new SynthoToken.
     * @param name_          Token name
     * @param symbol_        Token symbol
     * @param totalSupply_   Total supply (pre-decimal)
     * @param metadataURI_   IPFS metadata URI
     * @param sourceTweetUrl_ Source tweet URL
     * @return tokenAddress Address of the deployed ERC-20 contract
     */
    function deploy(
        string calldata name_,
        string calldata symbol_,
        uint256 totalSupply_,
        string calldata metadataURI_,
        string calldata sourceTweetUrl_
    ) external onlyAgent returns (address tokenAddress) {
        SynthoToken token = new SynthoToken(
            name_,
            symbol_,
            totalSupply_,
            agent,
            metadataURI_,
            sourceTweetUrl_
        );

        tokenAddress = address(token);

        tokens.push(TokenRecord({
            tokenAddress: tokenAddress,
            name: name_,
            symbol: symbol_,
            totalSupply: totalSupply_,
            sourceTweetUrl: sourceTweetUrl_,
            deployedAt: block.timestamp
        }));

        emit TokenDeployed(tokenAddress, name_, symbol_, totalSupply_, sourceTweetUrl_, block.timestamp);
    }

    /**
     * @notice Returns the total number of tokens deployed by this factory.
     */
    function totalDeployed() external view returns (uint256) {
        return tokens.length;
    }
}
