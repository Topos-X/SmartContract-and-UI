pragma solidity ^0.4.16;

contract owned {
    address public owner;

    function owned() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}

interface tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) public; }

contract TokenERC20 {
    // Public variables of the token
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    // 18 decimals is the strongly suggested default, avoid changing it
    uint256 public totalSupply;

    // This creates an array with all balances
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);

    // This notifies clients about the amount burnt
    event Burn(address indexed from, uint256 value);

    /**
     * Constructor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    function TokenERC20(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) public {
        totalSupply = initialSupply * 10 ** uint256(decimals);  // Update total supply with the decimal amount
        balanceOf[msg.sender] = totalSupply;                // Give the creator all initial tokens
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != 0x0);
        // Check if the sender has enough
        require(balanceOf[_from] >= _value);
        // Check for overflows
        require(balanceOf[_to] + _value > balanceOf[_to]);
        // Save this for an assertion in the future
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        // Subtract from the sender
        balanceOf[_from] -= _value;
        // Add the same to the recipient
        balanceOf[_to] += _value;
        Transfer(_from, _to, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) public {
        _transfer(msg.sender, _to, _value);
    }

    /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens to `_to` in behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender]);     // Check allowance
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * Set allowance for other address
     *
     * Allows `_spender` to spend no more than `_value` tokens in your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /**
     * Set allowance for other address and notify
     *
     * Allows `_spender` to spend no more than `_value` tokens in your behalf, and then ping the contract about it
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     * @param _extraData some extra information to send to the approved contract
     */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
        public
        returns (bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }

    /**
     * Destroy tokens
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _value the amount of money to burn
     */
    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);   // Check if the sender has enough
        balanceOf[msg.sender] -= _value;            // Subtract from the sender
        totalSupply -= _value;                      // Updates totalSupply
        Burn(msg.sender, _value);
        return true;
    }

    /**
     * Destroy tokens from other ccount
     *
     * Remove `_value` tokens from the system irreversibly on behalf of `_from`.
     *
     * @param _from the address of the sender
     * @param _value the amount of money to burn
     */
    function burnFrom(address _from, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value);                // Check if the targeted balance is enough
        require(_value <= allowance[_from][msg.sender]);    // Check allowance
        balanceOf[_from] -= _value;                         // Subtract from the targeted balance
        allowance[_from][msg.sender] -= _value;             // Subtract from the sender's allowance
        totalSupply -= _value;                              // Update totalSupply
        Burn(_from, _value);
        return true;
    }
}

/******************************************/
/*       ADVANCED TOKEN STARTS HERE       */
/******************************************/

contract MyAdvancedToken is owned, TokenERC20 {

    uint256 public sellPrice;
    uint256 public buyPrice;

    mapping (address => bool) public frozenAccount;

    /* This generates a public event on the blockchain that will notify clients */
    event FrozenFunds(address target, bool frozen);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function MyAdvancedToken(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) TokenERC20(initialSupply, tokenName, tokenSymbol) public {}

    /* Internal transfer, only can be called by this contract */
    function _transfer(address _from, address _to, uint _value) internal {
        require (_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
        require (balanceOf[_from] > _value);                // Check if the sender has enough
        require (balanceOf[_to] + _value > balanceOf[_to]); // Check for overflows
        require(!frozenAccount[_from]);                     // Check if sender is frozen
        require(!frozenAccount[_to]);                       // Check if recipient is frozen
        balanceOf[_from] -= _value;                         // Subtract from the sender
        balanceOf[_to] += _value;                           // Add the same to the recipient
        Transfer(_from, _to, _value);
    }

    /// @notice Create `mintedAmount` tokens and send it to `target`
    /// @param target Address to receive the tokens
    /// @param mintedAmount The amount of tokens it will receive
    function mintToken(address target, uint256 mintedAmount) onlyOwner public {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        Transfer(0, this, mintedAmount);
        Transfer(this, target, mintedAmount);
    }

    /// @notice `freeze? Prevent | Allow` `target` from sending & receiving tokens
    /// @param target Address to be frozen
    /// @param freeze Either to freeze it or not
    function freezeAccount(address target, bool freeze) onlyOwner public {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }

    /// @notice Allow users to buy tokens for `newBuyPrice` eth and sell tokens for `newSellPrice` eth
    /// @param newSellPrice Price the users can sell to the contract
    /// @param newBuyPrice Price users can buy from the contract
    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner public {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }

    /// @notice Buy tokens from contract by sending ether
    function buy() payable public {
        uint amount = msg.value / buyPrice;               // Calculates the amount
        _transfer(this, msg.sender, amount);              // Makes the transfers
    }

    /// @notice Sell `amount` tokens to contract
    /// @param amount Amount of tokens to be sold
    function sell(uint256 amount) public {
        require(this.balance >= amount * sellPrice);      // Checks if the contract has enough ether to buy
        _transfer(msg.sender, this, amount);              // Makes the transfers
        msg.sender.transfer(amount * sellPrice);          // Sends ether to the seller. It's important to do this last to avoid recursion attacks
    }
    
    
    
    
    
    
/******************************************/
/*       CODES FOR COMPLETE PROOF OF WORK       */
/******************************************/
    
    
 
    /// Proof of Work, shor's algorithm + discrete logarithm problem + random hash
        bytes32 public currentChallenge;                         // The coin starts with a challenge
        uint public timeOfLastProof;                             // Variable to keep track of when rewards were given
        uint public difficulty = 10**32;                         // Difficulty starts reasonably low
        
    function greatestCommonDivisor(uint256 a, uint256 b) public returns (uint256){
        uint256 r = a % b;
        if (r != 0){
            return greatestCommonDivisor(b, r);
        } else {
            return b;
        }
    }
    
    /// New functions squareRoot and ceiling and elliptic curve operations
    function squareRoot(uint256 number) public returns (uint256 root) {
        uint256 z = (number + 1) / 2;
        root = number;
        while (z < root) {
            root = z;
            z = ((number / z) + z) / 2;
        }
    }
    
    /// Converts a point (Px, Py, Pz) expressed in Jacobian coordinates to (Px', Py', 1).
    /// Mutates P.
    ///  P is the point.
    /// zInv is the modular inverse of 'Pz'.
    /// z2Inv is the square of zInv
    /// prime is the prime modulus.
    /// return (Px', Py', 1)
    function jacobianToAffine(uint[3] memory P, uint zInv, uint z2Inv, uint prime) internal constant {
        P[0] = mulmod(P[0], z2Inv, prime);
        P[1] = mulmod(P[1], mulmod(zInv, z2Inv, prime), prime);
        P[2] = 1;
    }
    
    /// Modular inverse of a (mod p) using extended euclidean algorithm.
    /// 'a' and 'p' must be co-prime.
    /// a is the number.
    /// p is the modulus.
    /// Return x such that ax = 1 (mod p) so x = a**-1 (mod p)
    function modularInverse(uint256 a, uint256 p) internal constant returns (uint256){
        require(a != 0 && a != p && p != 0);
        
        if (a > p){
            a = a % p;
        int256 t1;
        int256 t2 = 1;
        uint256 r1 = p;
        uint256 r2 = a;
        uint256 q;
        }
        while (r2 != 0){
            q = r1 / r2;
            (t1, t2, r1, r2) = (t2, t1 - int256(q) * t2, r2, r1 - q * r2);
        }
        if (t1 < 0){
            return (p - uint256(-t1));
        }
        return uint256(t1);
    }
        
    function proofOfWorkOptimized() onlyOwner public {
        uint256 base = uint256(keccak256(block.timestamp))%10 +1;
        uint256 exponent;
        uint256 modulus = 221;
        
        uint256 rootCeiling = squareRoot(modulus) + 1;
        
        uint256[] memory A = new uint256[](rootCeiling);
        uint256[] memory B = new uint256[](rootCeiling);
        
        if (greatestCommonDivisor(base, modulus) == 1 && base > 1){              // Checks that base and modulo are coprimes and that base > 1
            for (uint256 i = 0; i < rootCeiling; i++){
                A[i] = base**i % modulus;
            }
            for (uint256 j = 1; j <= rootCeiling; j++){
                B[j-1] = base**(rootCeiling*j) % modulus;
            }
            for (i = 0; i <= A.length - 1; i++){
                for (j = 0; j <= B.length - 1; j++){
                    if (A[i] == B[j]){
                        exponent = (((j + 1) * rootCeiling) - i) % modulus;
                        break;
                    }
                }
            }
            if (exponent % 2 == 0 && (base**(exponent / 2) + 1) % modulus != 0){        // Checks that the exponent is an even number and excludes the modulo as one of its divisor
                    uint256 p = greatestCommonDivisor((base**(exponent / 2) + 1), modulus);     // Returns p as one of modulo's divisor (17)
                    uint256 q = greatestCommonDivisor((base**(exponent / 2) - 1), modulus);     // Returns q as one of modulo's divisor (13)
                }
        }
        
        bytes16 hashExp = bytes16(keccak256(exponent, currentChallenge));
        require(hashExp >= bytes16(difficulty));
        
        uint256 timeSinceLastProof = (now - timeOfLastProof);                          // Calculate time since last reward was given
        require(timeSinceLastProof >= 10 seconds);                                     // Rewards cannot be given too quickly
        balanceOf[msg.sender] += 3* (exponent + 2 * p + 3 * q + 4 * base) * 1e17;                  // The reward to the winner grows by the minute

        difficulty = difficulty * 10 minutes / timeSinceLastProof + 1;  // Adjusts the difficulty

        timeOfLastProof = now;                              // Reset the counter
        currentChallenge = keccak256(exponent, currentChallenge, block.blockhash(block.number - 1));  // Save a hash that will be used as the next proof
    }
}
