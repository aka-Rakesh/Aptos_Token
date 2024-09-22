module game::in_game_token {
    use aptos_framework::coin::{self, Coin};
    use aptos_framework::aptos_account;
    use std::signer;

    struct Token has store {
        balance: u64,
    }

    /// Initialize the player's account with the token balance.
    public entry fun mint_token(
        sender: &signer,
        to: address,
        amount: u64,
    ) acquires Token {
        let sender_addr = signer::address_of(sender);
        assert!(sender_addr == aptos_account::address(), 1); // Only admin can mint

        if (!exists<Token>(to)) {
            move_to(&signer::borrow_signer(to), Token { balance: 0 });
        }

        let recipient_token = borrow_global_mut<Token>(to);
        recipient_token.balance += amount;
    }

    /// Transfer token from one player to another
    public entry fun transfer_token(
        sender: &signer,
        to: address,
        amount: u64,
    ) acquires Token {
        let sender_addr = signer::address_of(sender);
        let sender_token = borrow_global_mut<Token>(sender_addr);

        assert!(sender_token.balance >= amount, 2); // Insufficient balance
        sender_token.balance -= amount;

        if (!exists<Token>(to)) {
            move_to(&signer::borrow_signer(to), Token { balance: 0 });
        }

        let recipient_token = borrow_global_mut<Token>(to);
        recipient_token.balance += amount;
    }
}
