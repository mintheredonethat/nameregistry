pragma solidity ^0.4.7;

contract StakeOne {

  address public owner;
  uint public required;

  struct Member {
    bytes32 name;
    address addr;
  }

  Member[] public members;
  /*mapping (Member => uint) public memberIndex;*/

  enum TransactionState { noTransaction, transactionMade, transactionAccepted }
  TransactionState public currentState;

  struct Transaction {
    uint id;
    /*address source;*/
    address destination;
    uint amount;
    // in Wei
  }

  Transaction[] public transactions;

  function() payable {
    /*if (msg.value > 0) */
  }

  modifier onlyState(TransactionState expectedState) {
    if (expectedState == currentState) {
      _;
    }
    else {
      throw;
    }
  }

  function StakeOne() {
    owner = msg.sender;
    required++;
    currentState = TransactionState.noTransaction;
  }

  function registerMember(bytes32 _name, address _addr) {
    Member memory newMember;

    newMember.name = _name;
    newMember.addr = _addr;

    members.push(newMember);
  }

  function getMembers() constant returns (bytes32[], address[]) {
    uint length = members.length;

    bytes32[] memory names = new bytes32[](length);
    address[] memory addresses = new address[](length);

    for (uint i = 0; i < length; i++) {
      Member memory currentMember;
      currentMember = members[i];

      names[i] = currentMember.name;
      addresses[i] = currentMember.addr;
    }

    return (names, addresses);
  }

  function getBalance() constant returns (uint) {
    return this.balance;
  }

  function depositStake() payable returns (bool) {
    if (msg.value > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  function makeTransaction(address _to, uint _amount) onlyState(TransactionState.noTransaction)
    returns (bool)
  {
    if (_amount > this.balance) {
      throw;
    }

    Transaction memory newTransaction;
    newTransaction.id = transactions.length;
    /*newTransaction.source = msg.sender;*/
    newTransaction.destination = _to;
    newTransaction.amount = _amount;

    transactions.push(newTransaction);
    currentState = TransactionState.transactionMade;

    return true;
  }

  function getCurrentTransaction() onlyState(TransactionState.transactionMade)
    public constant returns (uint, address, uint)
  {
    var txID = transactions.length - 1;
    return(
      transactions[txID].id,
      /*transactions[txID].source,*/
      transactions[txID].destination,
      transactions[txID].amount
    );
  }

  function kill() {
    if (msg.sender == owner) {
      selfdestruct(owner);
    }
  }

}