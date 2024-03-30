// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract EnsApp {
    mapping(bytes32 => address) public  usernameToAddress;
    mapping(address => bytes32) public addressToUsername;
    mapping(address => Profile) userProfile;
    mapping(address => bool) isRegister;

    Profile[] private allUsers;


    struct Profile{
        bytes32 name;
        string uri;
        address userAddress;
        bool isRegistered;
    }
    bytes32[] public usernameList;


    event registrationSuccessful(address indexed sender,bytes32 username, string url);



    function registerUser(bytes32 _username, string memory _imageUrl) external {
        require(usernameToAddress[_username] == address(0), "already been registered");
        require(bytes(_imageUrl).length != 0, "enter the url");

        Profile storage profile = userProfile[msg.sender];
        profile.name = _username;
        profile.uri = _imageUrl;
        profile.userAddress = msg.sender;
        profile.isRegistered = true;
        allUsers.push(profile);

        usernameToAddress[_username] = msg.sender;
        addressToUsername[msg.sender] = profile.name;

        emit registrationSuccessful(msg.sender, _username, _imageUrl);

       

    }

    function getAddressByUsername(bytes32 username) external view returns(address) {
        return  usernameToAddress[username]; 
    }

    function getUsernameByAddress(address _addr) external view returns(bytes32) {
        return addressToUsername[_addr];
    }

  
      function getAllUserProfile() external view  returns (Profile [] memory) {
        return  allUsers;
    }

      function checkIsRegistered(address _address) public view returns(bool){
        return userProfile[_address].isRegistered;
    }



    
}