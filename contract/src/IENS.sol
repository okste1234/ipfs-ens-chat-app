// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface  IENS {
    

     struct Profile{
        bytes32 name;
        string uri;
        address userAddress;
        bool isRegistered;
    }
   

    function registerUser(bytes32 _username, string memory _imageUrl) external;

    function getAddressByUsername(bytes32 username) external view returns(address);

    function getUsernameByAddress(address _addr) external view returns(bytes32);
  
    function getAllUserProfile() external view  returns ( Profile [] memory);


    function checkIsRegistered(address _address) external view returns(bool);

  
    
}


