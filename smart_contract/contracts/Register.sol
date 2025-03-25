// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Users{
    string name;
    string gender;
    Fastag[] fastags;
    address wallet;
    Transaction[] transactions;
    string PrivateKey;
}

struct Fastag {
    address user;
    string rcNumber;
    string chasisNumber;
    string model;
    string carNum;
    address parentWallet;
}
struct Transaction {
    address fromUser;
    uint256 amount;
    uint256 timestamp;
    string toll;
    string carNo;
}
contract Registery{
    mapping(address => Users) userRegister; // address to user /  maybe change to hash to user for better mapping
    mapping(string => Fastag) fastagRegister; // some identifier say IDSTRING for fastag -- can be based on RC
    
    // mapping(address => Fastag[]) public userFastags;
    // mapping(address => Transaction[]) public userTransactions; // tmporarily commented --  may use if Storage write issue occurs - then remove User field of fastag array

    event FastagAdded(address indexed owner, string fastagID);
    event TransactionLogged(address indexed from, uint256 amount, uint256 timestamp, string toll, string carNo);
    event FastagRemoved(address indexed owner, address indexed fastagAddress);
    event UserAdded(address indexed user);
    event TollAuthFail(address indexed fromUser, string toll);
    
    function addUser(
        string memory name,
        string memory gender,
        address wallet,
        string memory privateKey
    ) public {
        Fastag[] memory fast = new Fastag[](0);
        Transaction[] memory trans = new Transaction[](0);
        Users memory newUser = Users({
            name: name,
            gender: gender,
            wallet: wallet,
            fastags: fast,
            transactions:trans,
            PrivateKey:privateKey
        });

        userRegister[msg.sender] = newUser;
        emit UserAdded(msg.sender);
    }

    function addFastag(
        address user,
        string memory rcNumber,
        string memory chasisNumber,
        string memory model,
        string memory carNum,
        address parentWallet
    ) public {
        Fastag memory newFastag = Fastag({
            user: user,
            rcNumber: rcNumber,
            chasisNumber: chasisNumber,
            model: model,
            carNum : carNum,
            parentWallet : parentWallet
        });

        string memory ID = ""; // TODO: Implement this string gen!!
        userRegister[msg.sender].fastags.push(newFastag);
        fastagRegister[ID] = newFastag;
        emit FastagAdded(msg.sender, ID);
    }
    function makePayment(string memory fastag, uint256 amount,string memory toll) public{
        require(amount > 0, "Invalid amount"); 
        
        address wallet = fastagRegister[fastag].parentWallet;
        address fromUser = fastagRegister[fastag].user;
        require(wallet != address(0),"Invalid Wallet");
        require(fromUser != address(0), "Invalid recipient");
        // TODO: Check if car blacklisted

        // TODO:verify that toll is authentic
        if(false){
            emit TollAuthFail(fromUser, toll);
            revert("Auth Fail"); 
        }
        // TODO: IMPLEMENT PAYING LOGIC

        logTransaction(fastag, amount, toll);
    }
    function logTransaction(string memory fastag, uint256 amount,string memory toll) public {
        require(amount > 0, "Invalid amount");
        address fromUser = fastagRegister[fastag].user;
        require(fromUser != address(0), "Invalid recipient");
        
        string memory carNo = fastagRegister[fastag].carNum; 
        Transaction memory newTransaction = Transaction({
            fromUser: fromUser,
            amount: amount,
            timestamp: block.timestamp,
            toll:toll,
            carNo : carNo
        });

        userRegister[msg.sender].transactions.push(newTransaction);

        emit TransactionLogged(fromUser, amount, block.timestamp, toll, carNo);
    }

    function getTransactions() 
        public 
        view 
        returns (address[] memory, uint256[] memory, uint256[] memory, string[] memory) 
    {
        uint256 count = userRegister[msg.sender].transactions.length;
        address[] memory fromAddresses = new address[](count);
        uint256[] memory amounts = new uint256[](count);
        uint256[] memory timestamps = new uint256[](count);
        string[] memory tolls = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            Transaction storage tt = userRegister[msg.sender].transactions[i];
            fromAddresses[i] = tt.fromUser;
            amounts[i] = tt.amount;
            timestamps[i] = tt.timestamp;
            tolls[i] = tt.toll;
        }

        return (fromAddresses, amounts, timestamps, tolls);
    }

}