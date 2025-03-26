// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) external view returns (bool);
}

contract Verifier is IVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) external pure override returns (bool) {
        // Mock verification logic (always returns true for testing)
        return true;
    }
}
contract AadhaarRegistry {
    IVerifier public verifier;
    address public walletFactory;
    // Maps proof hash to wallet address
    mapping(bytes32 => address) public hashToWallet;

    constructor(address _verifier) { 
        verifier = IVerifier(_verifier);
    }

    // Add a function to set WalletFactory after deployment
    function setWalletFactory(address _walletFactory) external {
        walletFactory = _walletFactory;
    }

    // Verify proof and check registration
    function verifyAndCheck(
        // uint[2] memory a,
        // uint[2][2] memory b,
        // uint[2] memory c,
        // uint[3] memory input
    ) public view returns (bool isVerified, bool isRegistered, bytes32 proofHash) {
        uint[2] memory ax;
        uint[2][2] memory bx;
        uint[3] memory cx;    
        isVerified = verifier.verifyProof(ax,bx,ax,cx);
        proofHash = keccak256(abi.encodePacked("a"));
        // input[0], input[1], input[2]
        isRegistered = (hashToWallet[proofHash] != address(0));
    }

    // Called by Wallet Factory after deployment
    function registerWallet(bytes32 proofHash, address wallet) external {
        require(msg.sender == walletFactory, "Unauthorized");
        hashToWallet[proofHash] = wallet;
    }

    function getWallet(bytes32 proofHash) external view returns(address wallet) {
        require(hashToWallet[proofHash] != address(0), "Unregistered");
        wallet = hashToWallet[proofHash];
    }
}

contract WalletFactory {
    address public registryAddress;
    AadhaarRegistry public registry;
    event WalletCreated(address indexed wallet, bytes32 proofHash);

    constructor(address _registry) {
        registryAddress = _registry;
        registry = AadhaarRegistry(_registry);
    }

    function createWallet(bytes32 proofHash) external returns (address) {
        // Deploy minimal AA wallet (simplified example)
        bytes memory code = type(MinimalWallet).creationCode;
        address wallet;
        assembly {
            wallet := create(0, add(code, 0x20), mload(code))
        }
        
        registry.registerWallet(proofHash, wallet);
        emit WalletCreated(wallet, proofHash);
        return wallet;
    }
}

contract MinimalWallet {
    // Basic AA wallet implementation
    function execute(address govtAdd, uint256 value, bytes memory data) external {
        (bool success, ) = govtAdd.call{value: value}(data);
        require(success);
    }
}

// User ={name, gender, pincode, walletAddress}
// Card -> BC -> Fastag -> (ParentWallet) -> Wallet Instance (Holds some eth) -> execute call(govtAdds,180,"")