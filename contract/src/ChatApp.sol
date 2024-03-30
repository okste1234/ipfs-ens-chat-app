
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import {IENS} from "../src/IENS.sol";

contract ChatApp {

    IENS ensServices;

    mapping(address => mapping(address => Message[])) messages;
    mapping(address => bytes32) usernames;



    struct Message{
        string message;
        bytes32 name;
    }


    struct Profile{
        bytes32 name;
        string uri;
        address userAddress;
        bool isRegistered;
    }



    constructor (address _ensAddr) {
        ensServices = IENS(_ensAddr);
    }

    event SentMessage(address indexed, address indexed, uint);


        // 0x6562756b697a7931000000000000000000000000000000000000000000000000
        // 0x6562756b697a7931320000000000000000000000000000000000000000000000
 


    function sendMessage(bytes32  _receiver, string memory _message) external{
        address _receiverAddr = ensServices.getAddressByUsername(_receiver);
        
        require(_receiverAddr != msg.sender);
        require(ensServices.checkIsRegistered(_receiverAddr), "Recipient not registered here");
        require(ensServices.checkIsRegistered(msg.sender), "sender not registered here");

        Message memory message;
        message.name = _receiver;
        message.message = _message;

        messages[msg.sender][_receiverAddr].push(message);
        messages[_receiverAddr][msg.sender].push(message);

        emit SentMessage(msg.sender, _receiverAddr, block.timestamp);
    }

  
    function getMessages(bytes32 _receiver) external view returns(Message[] memory){
        address reciverAddr = ensServices.getAddressByUsername(_receiver);
        return messages[msg.sender][reciverAddr];
    }



    function getUsernameByAddr(address _addr) external  view returns(bytes32){
        return  ensServices.getUsernameByAddress(_addr);
    }


    function getAddressByUsername(bytes32  _username) external view returns(address){
        return ensServices.getAddressByUsername(_username);
    }

 


    
}
