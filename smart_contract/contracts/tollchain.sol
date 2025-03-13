// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FastTag {
    struct User {
        string vehicleID;
        uint256 balance;
        uint256 nonce;
        bool registered;
    }

    mapping(address => User) public users;
    address public owner;

    bytes32 private constant DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant PERMIT_DEDUCT_TYPEHASH =
        keccak256("PermitDeductToll(address user,uint256 amount,uint256 nonce)");
    bytes32 private DOMAIN_SEPARATOR;

    event UserRegistered(address indexed user, string vehicleID);
    event TollDeducted(address indexed user, uint256 amount);
    event FundsAdded(address indexed user, uint256 amount);

    modifier onlyRegistered() {
        require(users[msg.sender].registered, "User not registered");
        _;
    }

    constructor() {
        owner = msg.sender;
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256("FastTag"),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );
    }

    function registerUser(string memory _vehicleID) public {
        require(!users[msg.sender].registered, "User already registered");
        users[msg.sender] = User(_vehicleID, 0, 0, true);
        emit UserRegistered(msg.sender, _vehicleID);
    }

    function addFunds() public payable onlyRegistered {
        users[msg.sender].balance += msg.value;
        emit FundsAdded(msg.sender, msg.value);
    }

    function deductToll(address _user, uint256 _amount) public {
        require(msg.sender == owner, "Only owner can deduct toll");
        require(users[_user].registered, "User not registered");
        require(users[_user].balance >= _amount, "Insufficient balance");
        
        users[_user].balance -= _amount;
        emit TollDeducted(_user, _amount);
    }

    function deductTollWithSignature(address user, uint256 amount, bytes memory signature) public {
        require(msg.sender == owner, "Only owner can deduct toll");
        require(users[user].registered, "User not registered");
        
        uint256 nonce = users[user].nonce;
        bytes32 structHash = keccak256(abi.encode(PERMIT_DEDUCT_TYPEHASH, user, amount, nonce));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
        
        address signer = recover(digest, signature);
        require(signer == user, "Invalid signature");
        require(users[user].balance >= amount, "Insufficient balance");

        users[user].balance -= amount;
        users[user].nonce++;
        emit TollDeducted(user, amount);
    }

    function getUserBalance(address _user) public view returns (uint256) {
        return users[_user].balance;
    }

    function getNonce(address user) public view returns (uint256) {
        return users[user].nonce;
    }

    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
        if (signature.length != 65) return address(0);

        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        if (v < 27) v += 27;
        if (v != 27 && v != 28) return address(0);

        return ecrecover(hash, v, r, s);
    }
}