const Account = require('./Account');

class AccountCorrente extends Account {
    constructor(accountNumber, accountBalance) {
        super(accountNumber, accountBalance)
        this.fee = 0.10; 
    }

    withdraw(balance, percent) {
        if (!percent) {
            throw new Error("Percent required");
        }

        super.withdraw(balance);
    }
}

const accountCorrente = new AccountCorrente(1000, 10);

console.log(accountCorrente.getAccount())
accountCorrente.withdraw(1, 1);
console.log(accountCorrente.getAccount())