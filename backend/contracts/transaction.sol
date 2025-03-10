



/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SmartMoneyAgent is ReentrancyGuard {
    address public owner;
    IERC20 public defaultToken;
    uint256 public swapFee = 1; // 1% fee

    mapping(string => address) public supportedTokens;

    event FundsSent(address indexed from, address indexed to, uint256 amount);
    event TokensSwapped(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event TokenTransferred(address indexed from, address indexed to, uint256 amount, string symbol);
    event TokenAdded(string symbol, address tokenAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor(address _defaultToken) {
        owner = msg.sender;
        defaultToken = IERC20(_defaultToken);
        supportedTokens["TEST"] = _defaultToken;
    }

    // ✅ Add new ERC-20 token support
    function addToken(string memory symbol, address tokenAddress) public onlyOwner {
        supportedTokens[symbol] = tokenAddress;
        emit TokenAdded(symbol, tokenAddress);
    }

    // ✅ Send ETH securely
    function sendFunds(address payable _to) public payable nonReentrant {
        require(msg.value > 0, "Send some ETH");
        (bool success, ) = _to.call{value: msg.value}("");
        require(success, "ETH transfer failed");
        emit FundsSent(msg.sender, _to, msg.value);
    }

    // ✅ Check ETH or token balance
    function getBalance(address user, string memory symbol) public view returns (uint256) {
        address token = supportedTokens[symbol];
        if (keccak256(abi.encodePacked(symbol)) == keccak256(abi.encodePacked("ETH"))) {
            return user.balance;
        } else if (token != address(0)) {
            return IERC20(token).balanceOf(user);
        } else {
            return 0;
        }
    }

    // ✅ Improved token swap function with fee deduction
    function swap(string memory tokenInSymbol, string memory tokenOutSymbol, uint256 amount) public nonReentrant {
        address tokenIn = supportedTokens[tokenInSymbol];
        address tokenOut = supportedTokens[tokenOutSymbol];
        require(tokenIn != address(0) && tokenOut != address(0), "Unsupported token");

        uint256 fee = (amount * swapFee) / 100;
        uint256 amountAfterFee = amount - fee;

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenOut).transfer(msg.sender, amountAfterFee);

        emit TokensSwapped(msg.sender, tokenIn, tokenOut, amount, amountAfterFee);
    }

    // ✅ Transfer ERC-20 tokens
    function transferToken(string memory symbol, address _to, uint256 _amount) public nonReentrant {
        address token = supportedTokens[symbol];
        require(token != address(0), "Token not supported");
        require(IERC20(token).transferFrom(msg.sender, _to, _amount), "Transfer failed");
        emit TokenTransferred(msg.sender, _to, _amount, symbol);
    }

    // ✅ Owner can set swap fee
    function setSwapFee(uint256 _fee) public onlyOwner {
        require(_fee <= 5, "Fee too high");
        swapFee = _fee;
    }
}
