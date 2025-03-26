// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Users{
    string proofHash;
    string gender;
    string[] fastags;
    address wallet;
    Transaction[] transactions;
}

struct Fastag {
    string user;
    string rcNumber;
    string chasisNumber;
    string model;
    string carNum;
    address parentWallet;
}
struct Transaction {
    string fromUser;
    uint256 amount;
    uint256 timestamp;
    string toll;
    string carNo;
}
contract Registery{
    mapping(string => Users) userRegister; // address to user /  maybe change to hash to user for better mapping
    mapping(string => Fastag) fastagRegister; // some identifier say IDSTRING for fastag -- can be based on RC
    
    // mapping(address => Fastag[]) public userFastags;
    // mapping(address => Transaction[]) public userTransactions; // tmporarily commented --  may use if Storage write issue occurs - then remove User field of fastag array

    event FastagAdded(string user, string fastagID);
    event TransactionLogged(string from, uint256 amount, uint256 timestamp, string toll, string carNo);
    event UserAdded(string user);
    event TollAuthFail(string fromUser, string toll);
    event WalletCreated(address indexed wallet, string proofHash);
    // event FastagRemoved(address indexed owner, address indexed fastagAddress);

    function createWallet(string memory proofHash) public returns (address) {
        // Deploy minimal AA wallet (simplified example)
        bytes memory code = type(MinimalWallet).creationCode;
        address wallet;
        assembly {
            wallet := create(0, add(code, 0x20), mload(code))
        }

        emit WalletCreated(wallet, proofHash);
        return wallet;
    }

    function addUser(
        string memory proofHash,
        string memory gender
    ) external {
        string[] memory fast = new string[](0);
        Transaction[] memory trans = new Transaction[](0);
        address wallet = createWallet(proofHash);
        Users memory newUser = Users({
            proofHash: proofHash,
            gender: gender,
            wallet: wallet,
            fastags: fast,
            transactions:trans
        });

        userRegister[proofHash] = newUser;
        emit UserAdded(proofHash);
    }

    function addFastag(
        string memory userProofHash,
        string memory rcNumber,
        string memory chasisNumber,
        string memory model,
        string memory carNum,
        address parentWallet
    ) external {
        Fastag memory newFastag = Fastag({
            user: userProofHash,
            rcNumber: rcNumber,
            chasisNumber: chasisNumber,
            model: model,
            carNum : carNum,
            parentWallet : parentWallet
        });

        userRegister[userProofHash].fastags.push(chasisNumber);
        fastagRegister[chasisNumber] = newFastag;
        emit FastagAdded(userProofHash, chasisNumber);
    }
    function makePayment(string memory fastag, uint256 amount,string memory toll) external {
        require(amount > 0, "Invalid amount"); 
        
        address wallet = fastagRegister[fastag].parentWallet;
        string memory fromUser = fastagRegister[fastag].user;
        require(wallet != address(0),"Invalid Wallet");
        // TODO: Check if car blacklisted

        // TODO:verify that toll is authentic
        if(false){
            emit TollAuthFail(fromUser, toll);
            revert("Auth Fail"); 
        }
        // TODO: IMPLEMENT PAYING LOGIC
        address govt;
        bool success = MinimalWallet(payable(wallet)).execute(govt, amount);
        require(success,"Payment Failed!");
        logTransaction(fastag, amount, toll);
    }
    function logTransaction(string memory fastag, uint256 amount,string memory toll) public {
        require(amount > 0, "Invalid amount");
        
        // require(fromUser != "", "Invalid recipient"); <-------- Remake this
        string memory fromUser = fastagRegister[fastag].user;
        
        string memory carNo = fastagRegister[fastag].carNum; 
        Transaction memory newTransaction = Transaction({
            fromUser: fromUser,
            amount: amount,
            timestamp: block.timestamp,
            toll:toll,
            carNo : carNo
        });

        userRegister[fromUser].transactions.push(newTransaction);

        emit TransactionLogged(fromUser, amount, block.timestamp, toll, carNo);
    }

    function getTransactions(string memory proofHash) 
        public 
        view 
        returns (string[] memory, uint256[] memory, uint256[] memory, string[] memory) 
    {
        uint256 count = userRegister[proofHash].transactions.length;
        string[] memory fromAddresses = new string[](count);
        uint256[] memory amounts = new uint256[](count);
        uint256[] memory timestamps = new uint256[](count);
        string[] memory tolls = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            Transaction storage tt = userRegister[proofHash].transactions[i];
            fromAddresses[i] = tt.fromUser;
            amounts[i] = tt.amount;
            timestamps[i] = tt.timestamp;
            tolls[i] = tt.toll;
        }

        return (fromAddresses, amounts, timestamps, tolls);
    }

}

contract MinimalWallet {
    // Basic AA wallet implementation
    receive() external payable {}

    function execute(address govtAdd, uint256 value) external returns(bool) {
        require(address(this).balance >= value,"Insufficient Account Balance");
        (bool success, ) = govtAdd.call{value: value}("");
        
        return success;
    }
}