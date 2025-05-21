pragma solidity ^0.8.20;

contract MembershipPoints {
    mapping(address => uint256) public points;

    function addPoints(uint256 amount) public {
        points[msg.sender] += amount;
    }

    function getPoints(address user) public view returns (uint256){
        return points[user];
    }
}