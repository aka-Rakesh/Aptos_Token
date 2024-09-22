# Aptos Token Currency - In-Game Token Contract

## Vision

The **Aptos Token Currency** project is designed to power in-game economies by creating a fungible token contract. This token serves as an in-game currency that players can earn, trade, and stake while playing. By leveraging the Aptos blockchain's security, speed, and scalability, this contract enables a decentralized and reliable token economy for games.

The vision is to make in-game assets truly valuable and interoperable across various gaming platforms, ensuring players have full control over their earned currency.

## Features

- **Earn Tokens**: Players can earn tokens by completing tasks, achievements, or participating in in-game events.
- **Trade Tokens**: Players can send and receive tokens to trade in the in-game marketplace or peer-to-peer transactions.
- **Stake Tokens**: Players can stake their tokens for in-game rewards, exclusive access, or participate in game governance.
- **Easy Token Management**: Simplified methods to mint, transfer, and manage tokens for the game administrators.
  
## Contract Information

This project contains a basic token contract written in the Move programming language for the Aptos blockchain. The contract contains two main functions: `mint_tokens` and `transfer_tokens`. These allow the admin to mint tokens and users to transfer tokens between each other.

### Smart Contract Code

```move
module game::in_game_token {
    use std::signer;
    use std::vector;

    struct TokenStore has key {
        balance: u64,
    }

    // Mint new tokens for a player (only admin)
    public entry fun mint_tokens(admin: &signer, recipient: address, amount: u64) {
        assert!(signer::address_of(admin) == @game, 1);  // Only admin can mint
        if (!exists<TokenStore>(recipient)) {
            move_to(&recipient, TokenStore { balance: 0 });
        }
        let recipient_token = borrow_global_mut<TokenStore>(recipient);
        recipient_token.balance = recipient_token.balance + amount;
    }

    // Transfer tokens between players
    public entry fun transfer_tokens(sender: &signer, recipient: address, amount: u64) {
        let sender_token = borrow_global_mut<TokenStore>(signer::address_of(sender));
        assert!(sender_token.balance >= amount, 2);  // Ensure sender has enough balance
        sender_token.balance = sender_token.balance - amount;
        
        if (!exists<TokenStore>(recipient)) {
            move_to(&recipient, TokenStore { balance: 0 });
        }
        let recipient_token = borrow_global_mut<TokenStore>(recipient);
        recipient_token.balance = recipient_token.balance + amount;
    }

    // Get token balance of an account
    public fun get_balance(owner: address): u64 {
        if (exists<TokenStore>(owner)) {
            let token_store = borrow_global<TokenStore>(owner);
            token_store.balance
        } else {
            0
        }
    }
}
```

### Functions Overview

1. **mint_tokens**: 
   - **Description**: This function allows the admin (defined by a specific address) to mint new tokens for a player.
   - **Parameters**: 
     - `admin`: The signer who must be the contract admin to mint tokens.
     - `recipient`: The address receiving the newly minted tokens.
     - `amount`: The number of tokens to mint.
   
2. **transfer_tokens**: 
   - **Description**: Allows players to transfer tokens between each other.
   - **Parameters**: 
     - `sender`: The signer initiating the transfer.
     - `recipient`: The address receiving the tokens.
     - `amount`: The number of tokens to transfer.
   
3. **get_balance**: 
   - **Description**: This view function returns the token balance of a given address.
   - **Parameters**: 
     - `owner`: The address of the player whose balance is being queried.

## Development
**Contract Address**: https://explorer.aptoslabs.com/txn/0xa5d76322b58a8124b22e251bd8eb75e87ca7e08b50059ad3f30f56daecb29103?network=testnet
**Transaction ID**: 0xa5d76322b58a8124b22e251bd8eb75e87ca7e08b50059ad3f30f56daecb29103

## Future Scope

1. **Advanced Staking Mechanism**: Develop staking contracts to allow users to stake tokens for governance, rewards, and in-game privileges.
2. **Market Integration**: Create a marketplace module for trading in-game assets and tokens using the in-game currency.
3. **Cross-Game Tokenization**: Enable interoperability between multiple games, allowing players to use the same tokens across different titles.
4. **In-Game NFT Integration**: Extend the contract to handle NFTs representing rare in-game items or collectibles that can be purchased or traded using the in-game currency.
5. **Burn Mechanism**: Introduce a burn mechanism for token deflationary control, enhancing token scarcity and long-term value.
6. **Upgradable Governance**: Develop governance contracts for decentralized control over token economics, letting the player community vote on game economic policies.

![image](https://github.com/user-attachments/assets/a8dc4689-8c55-4b73-921b-1b30fec59640)
