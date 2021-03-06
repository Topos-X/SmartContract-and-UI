pragma solidity ^0.4.16;

contract SafeMath{

  // math operations with safety checks that throw on error
  // small gas improvement

  function safeMul(uint256 a, uint256 b) internal returns (uint256){
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }
  
  function safeDiv(uint256 a, uint256 b) internal returns (uint256){
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }
  
  function safeSub(uint256 a, uint256 b) internal returns (uint256){
    assert(b <= a);
    return a - b;
  }
  
  function safeAdd(uint256 a, uint256 b) internal returns (uint256){
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }

  // mitigate short address attack
  // https://github.com/numerai/contract/blob/c182465f82e50ced8dacb3977ec374a892f5fa8c/contracts/Safe.sol#L30-L34
  modifier onlyPayloadSize(uint numWords){
     assert(msg.data.length >= numWords * 32 + 4);
     _;
  }

}


contract Token{ // ERC20 standard

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    function balanceOf(address _owner) constant returns (uint256 balance);
    function transfer(address _to, uint256 _value) returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    function approve(address _spender, uint256 _value) returns (bool success);
    function allowance(address _owner, address _spender) constant returns (uint256 remaining);

}


contract StandardToken is Token, SafeMath{

    uint256 public totalSupply;

    function transfer(address _to, uint256 _value) onlyPayloadSize(2) returns (bool success){
        require(_to != address(0));
        require(balances[msg.sender] >= _value && _value > 0);
        balances[msg.sender] = safeSub(balances[msg.sender], _value);
        balances[_to] = safeAdd(balances[_to], _value);
        Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) onlyPayloadSize(3) returns (bool success){
        require(_to != address(0));
        require(balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0);
        balances[_from] = safeSub(balances[_from], _value);
        balances[_to] = safeAdd(balances[_to], _value);
        allowed[_from][msg.sender] = safeSub(allowed[_from][msg.sender], _value);
        Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner) constant returns (uint256 balance){
        return balances[_owner];
    }
    
    //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    function approve(address _spender, uint256 _value) onlyPayloadSize(2) returns (bool success){
        require((_value == 0) || (allowed[msg.sender][_spender] == 0));
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function changeApproval(address _spender, uint256 _oldValue, uint256 _newValue) onlyPayloadSize(3) returns (bool success){
        require(allowed[msg.sender][_spender] == _oldValue);
        allowed[msg.sender][_spender] = _newValue;
        Approval(msg.sender, _spender, _newValue);
        return true;
    }

    function allowance(address _owner, address _spender) constant returns (uint256 remaining){
        return allowed[_owner][_spender];
    }

    // this creates an array with all balances
    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;

}


contract DHUCoin is StandardToken{

    // public variables of the token

    string public name = "DHUCoin";
    string public symbol = "DHU";
    uint256 public decimals = 18;
    
    // reachable if max amount raised
    uint256 public maxSupply = 100000000e18;
    
    // ICO starting and ending blocks, can by changed as needed
    uint256 public icoStartBlock;
    // icoEndBlock = icoStartBlock + 345,600 blocks for 2 months ICO
    uint256 public icoEndBlock;

    // set the wallets with different levels of authority
    address public mainWallet;
    address public secondaryWallet;
    
    // time to wait between secondaryWallet price updates, mainWallet can update without restrictions
    uint256 public priceUpdateWaitingTime = 1 hours;

    uint256 public previousUpdateTime = 0;
    
    // strucure of price
    PriceDHU public currentPrice;
    uint256 public minInvestment = 0.01 ether;
    
    // for tokens allocated to the team
    address public grantVestedDHUContract;
    bool private grantVestedDHUSet = false;
    
    // halt the crowdsale should any suspicious behavior of a third-party be identified
    // tokens will be locked for trading until they are listed on exchanges
    bool public haltICO = false;
    bool public setTrading = false;

    // maps previousUpdateTime to the next price
    mapping (uint256 => PriceDHU) public prices;
    // maps verified addresses
    mapping (address => bool) public verified;

    event Verification(address indexed investor);
    event Buy(address indexed investor, address indexed beneficiary, uint256 ethValue, uint256 amountTokens);
    event PriceDHUUpdate(uint256 topInteger, uint256 bottomInteger);
    
    // for price updates as a rational number
    struct PriceDHU{
        uint256 topInteger;
        uint256 bottomInteger;
    }

    // grantVestedDHUContract and mainWallet can transfer to allow team allocations
    modifier isSetTrading{
        require(setTrading || msg.sender == mainWallet || msg.sender == grantVestedDHUContract);
        _;
    }

    modifier onlyVerified{
        require(verified[msg.sender]);
        _;
    }

    modifier onlyMainWallet{
        require(msg.sender == mainWallet);
        _;
    }

    modifier onlyControllingWallets{
        require(msg.sender == secondaryWallet || msg.sender == mainWallet);
        _;
    }

    modifier only_if_secondaryWallet{
        if (msg.sender == secondaryWallet) _;
    }
    modifier require_waited{
        require(safeSub(now, priceUpdateWaitingTime) >= previousUpdateTime);
        _;
    }
    modifier only_if_increase (uint256 newTopInteger){
        if (newTopInteger > currentPrice.topInteger) _;
    }

    function DHUCoin(address secondaryWalletInput, uint256 priceTopIntegerInput, uint256 startBlockInput, uint256 endBlockInput){
        require(secondaryWalletInput != address(0));
        require(endBlockInput > startBlockInput);
        require(priceTopIntegerInput > 0);
        mainWallet = msg.sender;
        secondaryWallet = secondaryWalletInput;
        verified[mainWallet] = true;
        verified[secondaryWallet] = true;
        // priceTopIntegerInput = 800,000 for 1 ETH = 800 DHU at 1 ETH = $400
        currentPrice = PriceDHU(priceTopIntegerInput, 1000);
        // icoStartBlock should be around block number 5,528,800 = May 1st 2018
        icoStartBlock = startBlockInput;
        // icoEndBlock = icoStartBlock + 345,600 blocks
        icoEndBlock = endBlockInput;
        previousUpdateTime = now;
    }

    function setGrantVestedDHUContract(address grantVestedDHUContractInput) external onlyMainWallet{
        require(grantVestedDHUContractInput != address(0));
        grantVestedDHUContract = grantVestedDHUContractInput;
        verified[grantVestedDHUContract] = true;
        grantVestedDHUSet = true;
    }

    function updatePriceDHU(uint256 newTopInteger) external onlyControllingWallets{
        require(newTopInteger > 0);
        require_limited_change(newTopInteger);
        currentPrice.topInteger = newTopInteger;
        // maps time to new PriceDHU
        prices[previousUpdateTime] = currentPrice;
        previousUpdateTime = now;
        PriceDHUUpdate(newTopInteger, currentPrice.bottomInteger);
    }

    function require_limited_change (uint256 newTopInteger) private only_if_secondaryWallet require_waited only_if_increase(newTopInteger){
        uint256 percentage_diff = 0;
        percentage_diff = safeDiv(safeMul(newTopInteger, 100), currentPrice.topInteger);
        percentage_diff = safeSub(percentage_diff, 100);
        // secondaryWallet can increase price by 20% maximum once every priceUpdateWaitingTime
        require(percentage_diff <= 20);
    }

    function updatePriceBottomInteger(uint256 newBottomInteger) external onlyMainWallet{
        require(block.number > icoEndBlock);
        require(newBottomInteger > 0);
        currentPrice.bottomInteger = newBottomInteger;
        // maps time to new Price
        prices[previousUpdateTime] = currentPrice;
        previousUpdateTime = now;
        PriceDHUUpdate(currentPrice.topInteger, newBottomInteger);
    }

    function tokenAllocation(address investor, uint256 amountTokens) private{
        require(grantVestedDHUSet);
        // the 15% allocated to us
        uint256 theoJawadAllocation = safeDiv(safeMul(amountTokens, 1764705882352941), 10e16);
        uint256 newTokens = safeAdd(amountTokens, theoJawadAllocation);
        require(safeAdd(totalSupply, newTokens) <= maxSupply);
        totalSupply = safeAdd(totalSupply, newTokens);
        balances[investor] = safeAdd(balances[investor], amountTokens);
        balances[grantVestedDHUContract] = safeAdd(balances[grantVestedDHUContract], theoJawadAllocation);
    }

    function verifyInvestor(address investor) external onlyControllingWallets{
        verified[investor] = true;
        Verification(investor);
    }
    
    function removeVerifiedInvestor(address investor) external onlyControllingWallets{
        verified[investor] = false;
        Verification(investor);
    }

    function buy() external payable{
        buyTo(msg.sender);
    }

    function buyTo(address investor) public payable onlyVerified{
        require(!haltICO);
        require(investor != address(0));
        require(msg.value >= minInvestment);
        require(block.number >= icoStartBlock && block.number < icoEndBlock);
        uint256 icoBottomInteger = icoBottomIntegerPrice();
        uint256 tokensToBuy = safeDiv(safeMul(msg.value, currentPrice.topInteger), icoBottomInteger);
        tokenAllocation(investor, tokensToBuy);
        // send ether to mainWallet
        mainWallet.transfer(msg.value);
        Buy(msg.sender, investor, msg.value, tokensToBuy);
    }

    // bonus scheme during ICO, $0.5 for 1st 20 days, $0.55 for 2nd 20 days, $0.6 for 3rd 20 days
    function icoBottomIntegerPrice() public constant returns (uint256){
        uint256 icoDuration = safeSub(block.number, icoStartBlock);
        uint256 bottomInteger;
        // icoDuration < 115,200 blocks = 20 days
        if (icoDuration < 100){
            return currentPrice.bottomInteger;
        }
        // icoDuration < 230,400 blocks = 40 days
        else if (icoDuration < 200 ){
            bottomInteger = safeDiv(safeMul(currentPrice.bottomInteger, 110), 10e2);
            return bottomInteger;
        }
        else{
            bottomInteger = safeDiv(safeMul(currentPrice.bottomInteger, 120), 10e2);
            return bottomInteger;
        }
    }

    // change ICO starting date if more time needed for preparation
    function changeIcoStartBlock(uint256 newIcoStartBlock) external onlyMainWallet{
        require(block.number < icoStartBlock);
        require(block.number < newIcoStartBlock);
        icoStartBlock = newIcoStartBlock;
    }

    function changeIcoEndBlock(uint256 newIcoEndBlock) external onlyMainWallet{
        require(block.number < icoEndBlock);
        require(block.number < newIcoEndBlock);
        icoEndBlock = newIcoEndBlock;
    }

    function changePriceUpdateWaitingTime(uint256 newPriceUpdateWaitingTime) external onlyMainWallet{
        priceUpdateWaitingTime = newPriceUpdateWaitingTime;
    }

    function changeMainWallet(address newMainWallet) external onlyMainWallet{
        require(newMainWallet != address(0));
        mainWallet = newMainWallet;
    }

    function changeSecondaryWallet(address newSecondaryWallet) external onlyMainWallet{
        require(newSecondaryWallet != address(0));
        secondaryWallet = newSecondaryWallet;
    }

    function enableTrading() external onlyMainWallet{
        require(block.number > icoEndBlock);
        setTrading = true;
    }

    function claimDHU(address _token) external onlyMainWallet{
        require(_token != address(0));
        Token token = Token(_token);
        uint256 balance = token.balanceOf(this);
        token.transfer(mainWallet, balance);
     }

    // disable transfers and allow them once token is tradeable
    function transfer(address _to, uint256 _value) isSetTrading returns (bool success){
        return super.transfer(_to, _value);
    }
    function transferFrom(address _from, address _to, uint256 _value) isSetTrading returns (bool success){
        return super.transferFrom(_from, _to, _value);
    }

    function haltICO() external onlyMainWallet{
        haltICO = true;
    }
    
    function unhaltICO() external onlyMainWallet{
        haltICO = false;
    }
    
    // fallback function
    function() payable{
        require(tx.origin == msg.sender);
        buyTo(msg.sender);
    }
}
