pragma solidity ^0.4.12;

import "./../../contracts/ERC721Draft.sol";

/// @title NonFungibleMock
/// @dev Mock implementation of NonFungible, aiming for simplicity.
contract NonFungibleMock is ERC721 {

    struct MockNFT {
        uint256 id;
    }

    // Global list of all NFTs
    MockNFT[] tokens;
    // Tracks ownership of each token
    mapping (uint => address) tokenIdToOwner;
    // Tracks allowances for proxy ownership of each token
    mapping (uint => address) allowances;

    function implementsERC721() public pure returns (bool)
    {
        return true;
    }

    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return ownerOf(_tokenId) == _claimant;
    }

    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return allowances[_tokenId] == _claimant;
    }

    /// @dev creates a new token and assigns ownership to the sender
    function createToken() public returns (uint) {
        uint256 id = tokens.length + 1;
        tokens.push(MockNFT(id));
        tokenIdToOwner[id] = msg.sender;
    }

    function totalSupply() public view returns (uint) {
        return tokens.length;
    }

    function balanceOf(address _owner) public view returns (uint) {
        uint256 balance = 0;
        for (uint256 i = 0; i < totalSupply(); i++) {
            if (tokenIdToOwner[tokens[i].id] == _owner) {
                balance++;
            }
        }
        return balance;
    }

    function tokensOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256 tokenId) {
        uint256 indexCounter = 0;
        for (uint256 i = 0; i < totalSupply(); i++) {
            if (tokenIdToOwner[tokens[i].id] == _owner) {
                if (indexCounter == _index) {
                    return tokens[i].id;
                } else {
                    indexCounter++;
                }
            }
        }
        return 0;
    }

    function ownerOf(uint256 _tokenId) public view returns (address owner) {
        return tokenIdToOwner[_tokenId];
    }

    function transfer(address _to, uint256 _tokenId) public {
        require(_owns(msg.sender, _tokenId));
        // NOTE: This implementation does not clear approvals on transfer for simplicity
        // A complete implementation should do this.
        tokenIdToOwner[_tokenId] = _to;
    }

    function approve(address _to, uint256 _tokenId) public {
        require(_owns(msg.sender, _tokenId));
        allowances[_tokenId] = _to;
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));
        // NOTE: This implementation does not clear approvals on transfer for simplicity
        // A complete implementation should do this.
        tokenIdToOwner[_tokenId] = _to;
    }
}
