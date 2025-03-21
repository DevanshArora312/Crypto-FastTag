// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract FastTag {
    address public owner;
    IERC20 public token;  

    mapping(address => bool) public authorizedScanners;

    event TollDeducted(address indexed user, uint256 amount);

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);  
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyScanner() {
        require(authorizedScanners[msg.sender], "Unauthorized scanner");
        _;
    }

    function addScanner(address scanner) external onlyOwner {
        authorizedScanners[scanner] = true;
    }

    function removeScanner(address scanner) external onlyOwner {
        authorizedScanners[scanner] = false;
    }

    function deductToll(address user, uint256 amount) external onlyScanner {
        require(token.balanceOf(user) >= amount, "Insufficient balance");
        require(token.transferFrom(user, owner, amount), "Payment failed");

        emit TollDeducted(user, amount);
    }
}
