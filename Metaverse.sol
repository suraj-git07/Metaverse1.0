// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

//Openzeppelin imports
import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.4.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.4.2/utils/Counters.sol";

contract Metaverse is ERC721, Ownable {
    constructor() ERC721("META", "MTA") {}

    using Counters for Counters.Counter;

    Counters.Counter private supply;

    uint256 public maxSupply = 100;
    uint256 public cost = 10 wei;

    // nft
    struct Object {
        string name;
        int8 w;
        int8 h;
        int8 d;
        int8 x;
        int8 y;
        int8 z;
    }

    // address of owner mapped with the array of objects(there nfts)
    mapping(address => Object[]) public NFTOwners;
    Object[] public objects;

    function getObjects() public view returns (Object[] memory) {
        return objects;
    }

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function mint(
        string memory _name,
        int8 _w,
        int8 _h,
        int8 _d,
        int8 _x,
        int8 _y,
        int8 _z
    ) public payable {
        require(supply.current() <= maxSupply, "Supply exceeds max");
        require(msg.value >= cost, "Insufficint payment");
        supply.increment();
        _safeMint(msg.sender, supply.current());
        Object memory _newObject = Object(_name, _w, _h, _d, _x, _y, _z);
        objects.push(_newObject);

        NFTOwners[msg.sender].push(_newObject);
    }

    // to withdraw the money of the contract
    function withdraw() external payable onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    function getOwnerObjects() public view returns (Object[] memory) {
        return NFTOwners[msg.sender];
    }
}
