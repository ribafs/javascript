class Account {
    constructor(accountNumber, accountBalance) {
        this.accountNumber = accountNumber;
        this.accountBalance = accountBalance;
    }

    getAccount() {
        console.log(this.accountNumber, this.accountBalance)
    }

    deposit(balance) {
        this.accountBalance = this.accountBalance + balance;
    }

    withdraw(balance) {
        this.accountBalance = this.accountBalance - balance;
    }
}

module.exports = Account