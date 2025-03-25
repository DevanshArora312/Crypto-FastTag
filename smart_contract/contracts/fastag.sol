// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract fastagContract {

    struct Fastag {
        address _address;
        uint256 balance;
        string rcNumber;
        string chasisNumber;
        string model;
    }

    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Fastag[]) public userFastags;
    mapping(address => Transaction[]) public userTransactions;

    event FastagAdded(address indexed owner, address indexed fastagAddress);
    event BalanceUpdated(address indexed owner, uint256 indexed index, uint256 newBalance);
    event TransactionLogged(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
    event FastagRemoved(address indexed owner, address indexed fastagAddress);

    modifier onlyFastagOwner(uint256 index) {
        require(index < userFastags[msg.sender].length, "Invalid index");
        _;
    }

    function addFastag(
        address _address, 
        uint256 balance, 
        string memory rcNumber, 
        string memory chasisNumber, 
        string memory model
    ) public {
        Fastag memory newFastag = Fastag({
            _address: _address,
            balance: balance,
            rcNumber: rcNumber,
            chasisNumber: chasisNumber,
            model: model
        });

        userFastags[msg.sender].push(newFastag);
        emit FastagAdded(msg.sender, _address);
    }

    function getFastags(address parentWallet) 
        public 
        view 
        returns (address[] memory, uint256[] memory, string[] memory, string[] memory, string[] memory) 
    {
        uint256 count = userFastags[parentWallet].length;
        address[] memory addresses = new address[](count);
        uint256[] memory balances = new uint256[](count);
        string[] memory rcNumbers = new string[](count);
        string[] memory chasisNumbers = new string[](count);
        string[] memory models = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            Fastag storage ff = userFastags[parentWallet][i];
            addresses[i] = ff._address;
            balances[i] = ff.balance;
            rcNumbers[i] = ff.rcNumber;
            chasisNumbers[i] = ff.chasisNumber;
            models[i] = ff.model;
        }

        return (addresses, balances, rcNumbers, chasisNumbers, models);
    }

    function updateFastagBalance(uint256 index, uint256 newBalance) public onlyFastagOwner(index) {
        userFastags[msg.sender][index].balance = newBalance;
        emit BalanceUpdated(msg.sender, index, newBalance);
    }

    function depositFunds(uint256 index, uint256 amount) public onlyFastagOwner(index) {
        require(amount > 0, "Deposit amount must be greater than zero");
        userFastags[msg.sender][index].balance += amount;
        emit BalanceUpdated(msg.sender, index, userFastags[msg.sender][index].balance);
    }

    function withdrawFunds(uint256 index, uint256 amount) public onlyFastagOwner(index) {
        require(amount > 0, "Withdrawal amount must be greater than zero");
        require(userFastags[msg.sender][index].balance >= amount, "Insufficient balance");

        userFastags[msg.sender][index].balance -= amount;
        emit BalanceUpdated(msg.sender, index, userFastags[msg.sender][index].balance);
    }

    function transferBalance(uint256 fromIndex, uint256 toIndex, address recipient) public {
        require(fromIndex < userFastags[msg.sender].length, "Invalid sender Fastag index");
        require(toIndex < userFastags[recipient].length, "Invalid recipient Fastag index");

        Fastag storage senderFastag = userFastags[msg.sender][fromIndex];
        Fastag storage receiverFastag = userFastags[recipient][toIndex];

        require(senderFastag.balance > 0, "Insufficient funds");

        uint256 amount = senderFastag.balance;
        senderFastag.balance = 0;
        receiverFastag.balance += amount;

        logTransaction(recipient, amount);
    }

    function logTransaction(address to, uint256 amount) public {
        require(amount > 0, "Invalid amount");
        require(to != address(0), "Invalid recipient");

        Transaction memory newTransaction = Transaction({
            from: msg.sender,
            to: to,
            amount: amount,
            timestamp: block.timestamp
        });

        userTransactions[msg.sender].push(newTransaction);
        userTransactions[to].push(newTransaction);

        emit TransactionLogged(msg.sender, to, amount, block.timestamp);
    }

    function getTransactions(address parentWallet) 
        public 
        view 
        returns (address[] memory, address[] memory, uint256[] memory, uint256[] memory) 
    {
        uint256 count = userTransactions[parentWallet].length;
        address[] memory fromAddresses = new address[](count);
        address[] memory toAddresses = new address[](count);
        uint256[] memory amounts = new uint256[](count);
        uint256[] memory timestamps = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Transaction storage tt = userTransactions[parentWallet][i];
            fromAddresses[i] = tt.from;
            toAddresses[i] = tt.to;
            amounts[i] = tt.amount;
            timestamps[i] = tt.timestamp;
        }

        return (fromAddresses, toAddresses, amounts, timestamps);
    }

    function removeFastag(uint256 index) public onlyFastagOwner(index) {
        uint256 length = userFastags[msg.sender].length;
        require(length > 0, "No Fastag to remove");

        Fastag memory fastagToRemove = userFastags[msg.sender][index];

        userFastags[msg.sender][index] = userFastags[msg.sender][length - 1];
        userFastags[msg.sender].pop();

        emit FastagRemoved(msg.sender, fastagToRemove._address);
    }

    function getTotalBalance(address user) public view returns (uint256 totalBalance) {
        uint256 count = userFastags[user].length;
        for (uint256 i = 0; i < count; i++) {
            totalBalance += userFastags[user][i].balance;
        }
    }
}