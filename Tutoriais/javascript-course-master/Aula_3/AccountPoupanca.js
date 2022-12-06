const Account = require('./Account');

class AccountPoupanca extends Account {
    constructor(accountNumber, accountBalance) {
        super(accountNumber, accountBalance)
        this.fee = 0.10; 
    }

    withdraw(balance) {
        const newBalance = (this.fee + 1) * balance;
        super.withdraw(newBalance)
    }
}

const accountPoupanca = new AccountPoupanca(1000, 10);

console.log(accountPoupanca.getAccount())
accountPoupanca.withdraw(1);
console.log(accountPoupanca.getAccount())