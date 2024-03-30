// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Test} from "lib/forge-std/src/Test.sol";


import "../src/ChatApp.sol";
import "../src/EnsApp.sol";

contract ChatAppTest is Test{

    EnsApp  ensService;
    ChatApp chatApp;
    address  A = address (0xa);
    address  B = address (0xbb);
    bytes32 ebukizy1 = 0x6562756b697a7931000000000000000000000000000000000000000000000000;
    bytes32 segun = 0x736567756e000000000000000000000000000000000000000000000000000000;

    function setUp() public {
        ensService = new EnsApp();
        chatApp = new ChatApp(address(ensService));
    }

    function testRegister() public {
        vm.prank(A);
        ensService.registerUser(ebukizy1, "image_url");
        assertEq(ensService.getAllUserProfile().length, 1);
        
    }

    function testRevertDuplicateUsernameCannotBeRegistered() external{
        testRegister();

        vm.expectRevert("already been registered");
        testRegister();
    }

    function testImageUrlCannotBeNull() external {
         vm.prank(A);
         vm.expectRevert("enter the url");
        ensService.registerUser(ebukizy1, "");
    }

    function testCreateMultipleUser() public {
        testRegister();
        vm.prank(B);
        ensService.registerUser(segun, "image_urls");
        assertEq(ensService.getAllUserProfile().length, 2);
    }


    function testSendMessage() external{
    

        bytes32 ebuka = keccak256(bytes("ebukizy1"));
        vm.prank(address(1));
        ensService.registerUser(ebuka, "image 1");

        bytes32 dele = keccak256(bytes("dele"));
        vm.prank(address(2));
        ensService.registerUser(dele, "image 1");

        bytes32 seun = keccak256(bytes("Yet"));
        vm.prank(address(3));
        ensService.registerUser(seun, "uri");


        // console.log("Updated inside",ensService.checkIsRegistered(address(1)));
        assertTrue(ensService.checkIsRegistered(address(2)));



        vm.prank(address(1));
        chatApp.sendMessage(dele, "how are you?");

        vm.prank(address(1));
        chatApp.sendMessage(seun, "How are things going over there?");

        vm.prank(address(3));
        chatApp.sendMessage(dele, "baba how far?");

        vm.prank(address(1));
        assertEq(chatApp.getMessages(dele)[0].message, "how are you?");

        vm.prank(address(2));
        assertEq(chatApp.getMessages(ebuka)[0].message, "how are you?");


        vm.prank(address(3));
        assertEq(chatApp.getMessages(ebuka)[0].message, "How are things going over there?");
        assertEq(ensService.getAllUserProfile().length, 3);


        

    }

    }

 
//  forge create --rpc-url https:eth-sepolia.g.alchemy.com/v2/3hjxNaZiX0_Axc9w2_wiD7hxi_0QU5bs \
//     --private-key ef257f59dc15ea8d0cfa7f5a177fb173b3125a3d79e6c13eb1e88831e40dc62c\
//     --etherscan-api-key Z1B3MIMUR8FJB7WZXD7399FNM89Z6B4DVV \
//     --verify \
//     src/EnsApp.sol:EnsApp

//  forge create --rpc-url https:eth-sepolia.g.alchemy.com/v2/3hjxNaZiX0_Axc9w2_wiD7hxi_0QU5bs --private-key ef257f59dc15ea8d0cfa7f5a177fb173b3125a3d79e6c13eb1e88831e40dc62c src/EnsApp.sol:EnsApp
